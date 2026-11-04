"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState, useTransition } from "react";
import { AlertCircle, CheckCircle2, CircleDashed, FileCheck2, FileText, Loader2, RefreshCcw, Trash2, UploadCloud } from "lucide-react";
import { REJECT_REASONS } from "@/lib/portal/constants";
import type { ClientItemView, ClientView } from "@/lib/portal/client";
import { fmtBytes, fmtDate } from "@/lib/portal/ui";
import { Progress } from "./Progress";

/**
 * Parcours client. Chaque pièce a une zone de dépôt dédiée (glisser-déposer ou sélection depuis l'ordinateur / le téléphone).
 * Aucune permission (caméra, localisation…) n'est demandée : on utilise le sélecteur de fichiers standard du téléphone.
 */

interface Pending {
  id: string;
  name: string;
  progress: number;
  stage: "autorisation" | "envoi" | "verification";
  error?: string;
}

const EXT_OK = (name: string, formats: string[]) => formats.includes(name.split(".").pop()?.toLowerCase() ?? "");

async function postJson<T = { ok: true }>(url: string, body?: unknown, method = "POST"): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error ?? "Une erreur est survenue.");
  return data as T;
}

function putWithProgress(url: string, file: File, onProgress: (p: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", "application/octet-stream");
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) return resolve();
      try {
        reject(new Error(JSON.parse(xhr.responseText).error));
      } catch {
        reject(new Error("L'envoi a échoué, veuillez réessayer."));
      }
    };
    xhr.onerror = () => reject(new Error("Connexion interrompue pendant l'envoi. Vérifiez votre réseau et réessayez."));
    xhr.onabort = () => reject(new Error("Envoi annulé."));
    xhr.send(file);
  });
}

const STATE_UI = {
  to_provide: { label: "À fournir", icon: CircleDashed, cls: "bg-night/5 text-ink-soft" },
  received: { label: "Reçu", icon: FileCheck2, cls: "bg-info-soft text-info" },
  to_replace: { label: "À remplacer", icon: RefreshCcw, cls: "bg-danger-soft text-danger" },
  validated: { label: "Validé", icon: CheckCircle2, cls: "bg-ok-soft text-ok" },
} as const;

function ItemCard({
  item,
  index,
  token,
  onChanged,
  disabled,
}: {
  item: ClientItemView;
  index: number;
  token: string;
  onChanged: () => void;
  disabled: boolean;
}) {
  const [pending, setPending] = useState<Pending[]>([]);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const uploading = pending.some((p) => !p.error);
  const ui = uploading ? { label: "Téléversement en cours", icon: Loader2, cls: "bg-warn-soft text-warn" } : STATE_UI[item.state];
  const Icon = ui.icon;
  const accept = item.formats.map((f) => `.${f}`).join(",");

  const patch = (id: string, p: Partial<Pending>) => setPending((x) => x.map((y) => (y.id === id ? { ...y, ...p } : y)));

  const send = useCallback(
    async (files: FileList | File[]) => {
      setError("");
      for (const file of Array.from(files)) {
        if (!EXT_OK(file.name, item.formats)) {
          setError(`« ${file.name} » : format non accepté. Formats possibles : ${item.formats.map((f) => f.toUpperCase()).join(", ")}.`);
          continue;
        }
        if (file.size > item.maxBytes) {
          setError(`« ${file.name} » est trop volumineux (${fmtBytes(file.size)}). Maximum : ${fmtBytes(item.maxBytes)}.`);
          continue;
        }
        if (file.size === 0) {
          setError(`« ${file.name} » est vide.`);
          continue;
        }
        const id = crypto.randomUUID();
        setPending((x) => [...x, { id, name: file.name, progress: 0, stage: "autorisation" }]);
        try {
          const intent = await postJson<{ uploadId: string; uploadUrl: string }>(`/api/portal/${token}/upload-intent`, {
            itemId: item.id,
            fileName: file.name,
            size: file.size,
          });
          patch(id, { stage: "envoi" });
          await putWithProgress(intent.uploadUrl, file, (p) => patch(id, { progress: p }));
          patch(id, { stage: "verification", progress: 100 });
          await postJson(`/api/portal/${token}/complete`, { uploadId: intent.uploadId });
          setPending((x) => x.filter((y) => y.id !== id));
          onChanged();
        } catch (e) {
          patch(id, { error: (e as Error).message });
        }
      }
    },
    [item, token, onChanged],
  );

  const remove = async (fileId: string, name: string) => {
    if (!window.confirm(`Supprimer « ${name} » ?`)) return;
    try {
      await postJson(`/api/portal/${token}/files/${fileId}`, undefined, "DELETE");
      onChanged();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const reason = item.rejectReason ? REJECT_REASONS[item.rejectReason as keyof typeof REJECT_REASONS] : null;

  return (
    <li className="rounded-xl bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-4">
          <span className="display pt-0.5 text-[1.5rem] leading-none text-champagne-deep" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <div className="min-w-0">
            <h3 className="text-[1.08rem] font-semibold leading-snug text-night">{item.label}</h3>
            <p className="mt-0.5 text-[0.82rem] text-ink-muted">{item.required ? "Obligatoire" : "Facultatif"}</p>
            {item.instructions && <p className="mt-1.5 text-[0.9rem] leading-6 text-ink-soft">{item.instructions}</p>}
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[0.82rem] font-semibold ${ui.cls}`} aria-live="polite">
          <Icon className={`h-4 w-4 ${uploading ? "animate-spin" : ""}`} aria-hidden="true" />
          {ui.label}
        </span>
      </div>

      {item.state === "to_replace" && (
        <div role="alert" className="mt-4 rounded-lg bg-danger-soft p-4 text-[0.92rem] leading-6 text-danger">
          <p className="font-semibold">Ce document est à remplacer{reason ? ` — ${reason.toLowerCase()}` : ""}.</p>
          {item.rejectNote && <p className="mt-1">{item.rejectNote}</p>}
          <p className="mt-1 text-[0.85rem]">Il suffit d&apos;envoyer le nouveau fichier ci-dessous : vous n&apos;avez pas à renvoyer les autres documents.</p>
        </div>
      )}
      {item.state === "received" && !uploading && <p className="mt-3 text-[0.85rem] text-info">Reçu. Ruby Assur&apos; va l&apos;examiner.</p>}
      {item.state === "validated" && <p className="mt-3 text-[0.85rem] text-ok">Ce document a été examiné et validé par Ruby Assur&apos;.</p>}

      {item.files.length > 0 && (
        <ul className="mt-4 divide-y divide-line rounded-lg border border-line">
          {item.files.map((f) => (
            <li key={f.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <span className="flex min-w-0 items-center gap-3">
                <FileText className="h-4 w-4 shrink-0 text-champagne-deep" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block truncate text-[0.92rem] font-medium text-night">{f.name}</span>
                  <span className="text-[0.78rem] text-ink-muted">{fmtBytes(f.size)} · envoyé le {fmtDate(f.at)}</span>
                </span>
              </span>
              {!item.locked && !disabled && (
                <button type="button" onClick={() => remove(f.id, f.name)} aria-label={`Supprimer ${f.name}`} className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-ink-muted transition hover:bg-danger-soft hover:text-danger">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {pending.length > 0 && (
        <ul className="mt-3 space-y-2" aria-live="polite">
          {pending.map((p) => (
            <li key={p.id} className={`rounded-lg p-3 text-[0.88rem] ${p.error ? "bg-danger-soft text-danger" : "bg-ivory text-ink-soft"}`}>
              <span className="flex items-center justify-between gap-3">
                <span className="min-w-0 truncate font-medium">{p.name}</span>
                {!p.error && <span className="shrink-0 text-[0.8rem]">{p.stage === "verification" ? "Vérification…" : p.stage === "autorisation" ? "Préparation…" : `${p.progress} %`}</span>}
              </span>
              {p.error ? (
                <span className="mt-1 flex items-start justify-between gap-3">
                  <span className="flex items-start gap-2"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{p.error}</span>
                  <button type="button" className="shrink-0 underline" onClick={() => setPending((x) => x.filter((y) => y.id !== p.id))}>Fermer</button>
                </span>
              ) : (
                <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-night/10" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={p.progress} aria-label={`Envoi de ${p.name}`}>
                  <span className="block h-full rounded-full bg-champagne-deep transition-[width] duration-200" style={{ width: `${p.progress}%` }} />
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {!item.locked && !disabled && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); if (e.dataTransfer.files.length) void send(e.dataTransfer.files); }}
          className={`mt-4 rounded-lg border-2 border-dashed p-5 text-center transition ${drag ? "border-champagne-deep bg-champagne/10" : "border-night/20 bg-paper"}`}
        >
          <UploadCloud className="mx-auto h-7 w-7 text-champagne-deep" aria-hidden="true" />
          <input
            ref={input}
            id={`file-${item.id}`}
            type="file"
            accept={accept}
            multiple
            className="sr-only"
            onChange={(e) => { if (e.target.files?.length) void send(e.target.files); e.target.value = ""; }}
          />
          <label htmlFor={`file-${item.id}`} className="btn-primary mt-3 cursor-pointer">
            {item.state === "to_replace" ? "Envoyer le nouveau fichier" : item.files.length ? "Ajouter un fichier" : "Choisir un fichier"}
          </label>
          <p className="mt-3 text-[0.82rem] leading-5 text-ink-muted">
            ou glissez-le ici<br />
            {item.formats.map((f) => f.toUpperCase()).join(", ")} · {fmtBytes(item.maxBytes)} maximum
          </p>
        </div>
      )}
      {error && <p role="alert" className="mt-3 text-[0.88rem] text-danger">{error}</p>}
    </li>
  );
}

/** Informations à saisir (en plus des documents) : enregistrement automatique après chaque modification. */
function InfoSection({ token, view }: { token: string; view: ClientView }) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(view.info);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [err, setErr] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback(
    async (v: Record<string, string>) => {
      setState("saving");
      setErr("");
      try {
        await postJson(`/api/portal/${token}/info`, { values: v });
        setState("saved");
        router.refresh();
      } catch (e) {
        setState("error");
        setErr((e as Error).message);
      }
    },
    [token, router],
  );

  const change = (key: string, value: string, immediate = false) => {
    const next = { ...values, [key]: value };
    setValues(next);
    setState("idle");
    if (timer.current) clearTimeout(timer.current);
    if (immediate) void save(next);
    else timer.current = setTimeout(() => void save(next), 900);
  };

  const base = "field";
  return (
    <section className="mt-6 rounded-xl bg-white p-5 shadow-card sm:p-6" aria-labelledby="infos">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="infos" className="display text-[1.25rem] text-night">Vos informations</h2>
        <p className="text-[0.82rem] text-ink-muted" aria-live="polite">
          {state === "saving" ? "Enregistrement…" : state === "saved" ? "✓ Enregistré" : "Enregistrées automatiquement"}
        </p>
      </div>
      <p className="mt-1 text-[0.88rem] text-ink-muted">Complétez ce que vous savez : cela permet à Ruby Assur&apos; d&apos;avancer plus vite. Rien n&apos;est obligatoire sauf indication contraire.</p>
      <div className="mt-5 grid gap-x-5 gap-y-4 sm:grid-cols-2">
        {view.fields.map((f) => {
          const id = `info-${f.key}`;
          const v = values[f.key] ?? "";
          const wide = f.type === "textarea";
          return (
            <div key={f.key} className={wide ? "sm:col-span-2" : ""}>
              <label htmlFor={id} className="mb-1.5 block text-[0.88rem] font-semibold text-night">
                {f.label}
                {f.unit ? ` (${f.unit})` : ""}
                {f.required ? <span className="text-danger"> *</span> : null}
              </label>
              {f.type === "textarea" ? (
                <textarea id={id} rows={3} value={v} onChange={(e) => change(f.key, e.target.value)} className={base} />
              ) : f.type === "choice" ? (
                <div role="radiogroup" aria-labelledby={id} className="flex flex-wrap gap-2">
                  {(f.options ?? []).map((o) => (
                    <label key={o} className={`cursor-pointer rounded-full border px-4 py-2 text-[0.9rem] font-semibold transition ${v === o ? "border-night bg-night text-white" : "border-night/25 text-night hover:border-night"}`}>
                      <input type="radio" name={id} value={o} checked={v === o} onChange={() => change(f.key, v === o ? "" : o, true)} className="sr-only" />
                      {o}
                    </label>
                  ))}
                </div>
              ) : (
                <input
                  id={id}
                  type={f.type === "number" ? "text" : f.type}
                  inputMode={f.type === "number" ? "decimal" : undefined}
                  value={v}
                  onChange={(e) => change(f.key, e.target.value)}
                  className={base}
                />
              )}
              {f.hint && <p className="mt-1 text-[0.78rem] text-ink-muted">{f.hint}</p>}
            </div>
          );
        })}
      </div>
      {state === "error" && <p role="alert" className="mt-3 text-[0.88rem] text-danger">{err}</p>}
      {view.infoMissing > 0 && <p className="mt-4 text-[0.85rem] text-warn">{view.infoMissing} information{view.infoMissing > 1 ? "s" : ""} obligatoire{view.infoMissing > 1 ? "s" : ""} à compléter (*).</p>}
    </section>
  );
}

export function ClientPortal({ token, initial }: { token: string; initial: ClientView }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const view = initial;
  const refresh = useCallback(() => startTransition(() => router.refresh()), [router]);
  const p = view.progress;
  const complete = view.status !== "incomplete" && view.status !== "closed";
  const needAnswers = view.unanswered.length > 0;

  const answer = async (key: string, value: "yes" | "no") => {
    setMsg("");
    try {
      await postJson(`/api/portal/${token}/answers`, { answers: { [key]: value } });
      refresh();
    } catch (e) {
      setMsg((e as Error).message);
    }
  };

  const submit = async () => {
    setSubmitting(true);
    setMsg("");
    try {
      await postJson(`/api/portal/${token}/submit`);
      refresh();
    } catch (e) {
      setMsg((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const remaining = p.missing + p.toReplace;

  return (
    <div>
      <p className="eyebrow">Espace documents</p>
      <h1 className="display mt-3 text-display-md text-night">
        Votre dossier <em>{view.title}</em>
      </h1>
      <p className="mt-4 text-[1.02rem] leading-7 text-ink-soft">
        Bonjour{view.firstName ? ` ${view.firstName}` : ""},<br />
        Pour permettre à Ruby Assur&apos; d&apos;étudier votre demande, merci de transmettre les documents indiqués ci-dessous.
      </p>
      {view.instructions && <p className="mt-4 rounded-lg bg-white p-4 text-[0.95rem] leading-6 text-ink-soft shadow-card">{view.instructions}</p>}

      <div className="mt-6 rounded-xl bg-white p-5 shadow-card sm:p-6">
        <Progress done={p.requiredDone} total={p.requiredTotal} label={p.requiredTotal > 1 ? "documents obligatoires reçus" : "document obligatoire reçu"} />
        <p className="mt-3 text-[0.9rem] text-ink-soft" aria-live="polite">
          {view.status === "validated"
            ? "Vos documents ont été examinés et validés. Merci !"
            : view.submitted
              ? "Vos documents ont bien été transmis à Ruby Assur'. Julien pourra maintenant examiner votre dossier."
              : remaining > 0
                ? `Il reste ${remaining} document${remaining > 1 ? "s" : ""} à fournir ou à remplacer.`
                : view.infoMissing > 0
                  ? `Il reste ${view.infoMissing} information${view.infoMissing > 1 ? "s" : ""} obligatoire${view.infoMissing > 1 ? "s" : ""} à compléter.`
                  : needAnswers
                    ? "Répondez aux questions ci-dessous pour voir la liste des documents à fournir."
                    : "Tous les documents obligatoires sont là : vous pouvez confirmer l'envoi."}
        </p>
      </div>

      {view.fields.length > 0 && <InfoSection token={token} view={view} />}

      {view.questions.length > 0 && (
        <section className="mt-6 rounded-xl bg-white p-5 shadow-card sm:p-6" aria-labelledby="qs">
          <h2 id="qs" className="display text-[1.25rem] text-night">Quelques précisions</h2>
          <div className="mt-3 space-y-4">
            {view.questions.map((q) =>
              q.type === "checkbox" ? (
                <label key={q.key} className="flex cursor-pointer items-start gap-3 text-[1rem] leading-6 text-night">
                  <input type="checkbox" checked={view.answers[q.key] === "yes"} onChange={(e) => answer(q.key, e.target.checked ? "yes" : "no")} className="mt-1 h-5 w-5 shrink-0 accent-[#0A1A35]" />
                  {q.label}
                </label>
              ) : (
                <fieldset key={q.key}>
                  <legend className="text-[0.98rem] font-medium text-night">{q.label}</legend>
                  <div className="mt-2 flex gap-2">
                    {(["yes", "no"] as const).map((v) => (
                      <label key={v} className={`cursor-pointer rounded-full border px-5 py-2 text-[0.92rem] font-semibold transition ${view.answers[q.key] === v ? "border-night bg-night text-white" : "border-night/25 text-night hover:border-night"}`}>
                        <input type="radio" name={q.key} value={v} checked={view.answers[q.key] === v} onChange={() => answer(q.key, v)} className="sr-only" />
                        {v === "yes" ? "Oui" : "Non"}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ),
            )}
          </div>
        </section>
      )}

      <h2 className="sr-only">Documents à transmettre</h2>
      <ol className="mt-6 space-y-4">
        {view.items.map((it, i) => (
          <ItemCard key={it.id} item={it} index={i} token={token} onChanged={refresh} disabled={false} />
        ))}
      </ol>

      <section className="mt-8 rounded-xl bg-night p-6 text-white sm:p-8" aria-labelledby="fin">
        {view.submitted && complete ? (
          <div role="status">
            <CheckCircle2 className="h-8 w-8 text-champagne" aria-hidden="true" />
            <h2 id="fin" className="display mt-3 text-display-sm text-white">Vos documents ont bien été transmis.</h2>
            <p className="mt-2 text-white/75">Ruby Assur&apos; va maintenant examiner votre dossier. Vous pouvez encore ajouter ou remplacer un document tant que ce lien est actif.</p>
          </div>
        ) : (
          <>
            <h2 id="fin" className="display text-display-sm text-white">Terminer</h2>
            <p className="mt-2 text-white/70">
              {view.canSubmit
                ? "Tout ce qui est demandé est là. Confirmez pour prévenir Ruby Assur'."
                : remaining > 0 || view.infoMissing > 0
                  ? "Vous pourrez confirmer l'envoi une fois les documents et informations obligatoires fournis."
                  : "Répondez aux précisions ci-dessus pour continuer."}
            </p>
            <button type="button" onClick={submit} disabled={!view.canSubmit || submitting} className="btn-gold mt-5 w-full sm:w-auto">
              {submitting ? "Envoi…" : "Confirmer l'envoi de mes documents"}
            </button>
          </>
        )}
        {msg && <p role="alert" className="mt-3 text-[0.9rem] text-danger-soft">{msg}</p>}
      </section>

      <p className="mt-6 text-[0.8rem] text-ink-faint">Ce lien est personnel : ne le partagez pas. {view.expiresAt ? `Il reste valable jusqu'au ${fmtDate(view.expiresAt)}.` : ""}</p>
    </div>
  );
}
