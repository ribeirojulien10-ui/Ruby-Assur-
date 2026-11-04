import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, Eye, FileText, Mail, Phone } from "lucide-react";
import { AddItemForm } from "@/components/portal/AddItemForm";
import { LinkPanel } from "@/components/portal/LinkPanel";
import { Progress } from "@/components/portal/Progress";
import { ReminderPanel } from "@/components/portal/ReminderPanel";
import { RequestActions } from "@/components/portal/RequestActions";
import { ReviewControls } from "@/components/portal/ReviewControls";
import { ItemBadge, StatusBadge } from "@/components/portal/StatusBadge";
import { requireAdmin } from "@/lib/auth-guard";
import { getActiveLink, getRequestDetail, prepareReminder } from "@/lib/portal/admin";
import { parsePersons } from "@/lib/portal/rules";
import { REJECT_REASONS } from "@/lib/portal/config";
import { defaultContext } from "@/lib/portal/context";
import { ACTOR_LABEL, EVENT_LABEL, fmtBytes, fmtDateTime } from "@/lib/portal/ui";
import { PortalError } from "@/lib/portal/types";

export const metadata: Metadata = { title: "Dossier" };

export default async function DossierPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  const { id } = await params;
  const ctx = defaultContext();
  let d;
  try {
    d = getRequestDetail(ctx, admin, id);
  } catch (e) {
    if (e instanceof PortalError && e.code === "not_found") notFound();
    throw e;
  }
  const closed = d.status === "closed";
  const link = getActiveLink(ctx, admin, id);
  const reminder = prepareReminder(ctx, admin, id);
  const applicable = d.items.filter((i) => i.applicable);
  const hidden = d.items.filter((i) => !i.applicable);
  const previewable = new Set(["pdf", "jpeg", "png", "webp"]);

  return (
    <>
      <Link href="/espace-pro/dossiers" className="link-arrow text-sm"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> Tous les dossiers</Link>

      <header className="mt-5 flex flex-wrap items-start justify-between gap-5">
        <div>
          {d.request.is_demo ? <p className="mb-2 inline-block rounded-full bg-warn-soft px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-warn">Démonstration — données fictives</p> : null}
          <h1 className="display text-display-md text-night">{d.client.full_name}</h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.95rem] text-ink-muted">
            <span className="font-semibold text-night">{d.insuranceName}</span>
            {d.client.email && <a href={`mailto:${d.client.email}`} className="inline-flex items-center gap-1.5 hover:text-night"><Mail className="h-4 w-4" aria-hidden="true" />{d.client.email}</a>}
            {d.client.phone && <a href={`tel:${d.client.phone}`} className="inline-flex items-center gap-1.5 hover:text-night"><Phone className="h-4 w-4" aria-hidden="true" />{d.client.phone}</a>}
          </p>
        </div>
        <StatusBadge status={d.status} />
      </header>

      <p role="note" className="mt-5 rounded-md bg-ivory px-4 py-2.5 text-[0.85rem] leading-6 text-ink-soft">
        <strong className="text-night">Consultation discrète :</strong> ouvrir ce dossier, prévisualiser ou télécharger un document ne prévient pas le client.
        Il voit seulement ce que vous décidez (document <em>validé</em> ou <em>à remplacer</em>) et les relances que vous lui envoyez.
      </p>

      <div className="mt-4 grid gap-4 rounded-xl bg-white p-6 shadow-card sm:grid-cols-[1fr_auto] sm:items-center">
        <Progress done={d.progress.requiredDone} total={d.progress.requiredTotal} />
        <ul className="flex flex-wrap gap-x-6 gap-y-1 text-[0.88rem] text-ink-soft">
          <li><strong className="text-night">{d.progress.missing.length}</strong> manquante{d.progress.missing.length > 1 ? "s" : ""}</li>
          <li><strong className="text-night">{d.progress.toReview.length}</strong> à examiner</li>
          <li><strong className="text-night">{d.progress.toReplace.length}</strong> à remplacer</li>
          <li><strong className="text-night">{d.progress.requiredValidated}</strong> validée{d.progress.requiredValidated > 1 ? "s" : ""}</li>
        </ul>
        {d.status === "complete" && <p className="text-[0.85rem] text-info sm:col-span-2">Les pièces demandées sont reçues, mais le client n&apos;a pas encore confirmé son envoi. Recevoir ne veut pas dire valider : examinez chaque document.</p>}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          {d.fields.length > 0 && (
            <section className="rounded-xl bg-white p-5 shadow-card sm:p-6" aria-labelledby="infos-client">
              <h2 id="infos-client" className="display text-display-sm text-night">Informations saisies par le client</h2>
              {d.infoMissing.length > 0 && (
                <p className="mt-2 rounded-md bg-warn-soft px-3 py-2 text-[0.85rem] text-warn">Obligatoire encore vide : {d.infoMissing.map((f) => f.label).join(", ")}.</p>
              )}
              <dl className="mt-4 grid gap-x-8 sm:grid-cols-2">
                {d.fields.map((f) => {
                  const v = d.info[f.key];
                  return (
                    <div key={f.key} className={`border-t border-line py-3 ${f.type === "persons" || f.type === "textarea" ? "sm:col-span-2" : ""}`}>
                      <dt className="text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-ink-muted">{f.label}{f.required ? " *" : ""}</dt>
                      <dd className={`mt-1 whitespace-pre-line text-[0.98rem] ${v ? "text-night" : "text-ink-faint"}`}>
                        {!v
                          ? "Non renseigné"
                          : f.type === "persons"
                            ? parsePersons(v).map((p) => `${p.name}${p.birth ? ` — né(e) le ${new Date(p.birth).toLocaleDateString("fr-FR")}` : ""}`).join("\n")
                            : `${v}${f.unit ? ` ${f.unit}` : ""}`}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </section>
          )}
          <h2 className="display text-display-sm text-night">Documents demandés</h2>

          {d.questions.length > 0 && (
            <p className="rounded-md bg-ivory px-4 py-3 text-[0.88rem] text-ink-soft">
              Réponses du client : {d.questions.map((q) => (q.type === "checkbox" ? `« ${q.label} » → ${d.answers[q.key] === "yes" ? "case cochée" : "non cochée"}` : `« ${q.label} » → ${d.answers[q.key] === "yes" ? "oui" : d.answers[q.key] === "no" ? "non" : "pas encore répondu"}`)).join(" ; ")}
            </p>
          )}

          <ol className="space-y-4">
            {applicable.map((it, i) => (
              <li key={it.id} className="rounded-xl bg-white p-5 shadow-card sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-4">
                    <span className="display pt-0.5 text-[1.5rem] leading-none text-champagne-deep" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="text-[1.05rem] font-semibold text-night">{it.label}</h3>
                      <p className="mt-0.5 text-[0.8rem] text-ink-muted">{it.required ? "Obligatoire" : "Facultatif"}{it.instructions ? ` — ${it.instructions}` : ""}</p>
                    </div>
                  </div>
                  <ItemBadge state={it.state} />
                </div>

                {it.state === "to_replace" && (
                  <p className="mt-3 rounded-md bg-danger-soft px-3 py-2 text-[0.86rem] text-danger">
                    Remplacement demandé : {REJECT_REASONS[(it.reject_reason as keyof typeof REJECT_REASONS) ?? "autre"] ?? "—"}{it.reject_note ? ` — ${it.reject_note}` : ""}
                  </p>
                )}

                {it.files.length > 0 ? (
                  <ul className="mt-4 divide-y divide-line rounded-lg border border-line">
                    {it.files.map((f) => (
                      <li key={f.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                        <span className="flex min-w-0 items-center gap-3">
                          <FileText className="h-4 w-4 shrink-0 text-champagne-deep" aria-hidden="true" />
                          <span className="min-w-0">
                            <span className="block truncate text-[0.92rem] font-medium text-night">{f.original_name}</span>
                            <span className="text-[0.78rem] text-ink-muted">{fmtBytes(f.size)} · {f.detected_type.toUpperCase()} · déposé le {fmtDateTime(f.created_at)}</span>
                          </span>
                        </span>
                        <span className="flex gap-2">
                          {previewable.has(f.detected_type) && (
                            <a href={`/api/espace-pro/files/${f.id}?disposition=inline`} target="_blank" rel="noopener noreferrer" className="btn-outline btn-sm"><Eye className="h-4 w-4" aria-hidden="true" /> Aperçu</a>
                          )}
                          <a href={`/api/espace-pro/files/${f.id}`} className="btn-outline btn-sm"><Download className="h-4 w-4" aria-hidden="true" /> Télécharger</a>
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-[0.88rem] text-ink-muted">{it.state === "to_replace" ? "En attente d'un nouveau fichier du client." : "Aucun fichier reçu pour l'instant."}</p>
                )}

                <ReviewControls requestId={id} itemId={it.id} state={it.state} required={!!it.required} hasFiles={it.files.length > 0} closed={closed} />
              </li>
            ))}
          </ol>

          {hidden.length > 0 && <p className="text-[0.85rem] text-ink-muted">{hidden.length} pièce(s) conditionnelle(s) non demandée(s) selon les réponses du client : {hidden.map((h) => h.label).join(", ")}.</p>}
          {!closed && <AddItemForm requestId={id} />}
        </div>

        <aside className="space-y-6 lg:col-span-4">
          <LinkPanel
            requestId={id}
            state={d.linkState}
            expiresAt={d.request.expires_at}
            link={link}
            closed={closed}
            client={{ fullName: d.client.full_name, email: d.client.email, phone: d.client.phone }}
            insuranceName={d.insuranceName}
          />
          <ReminderPanel
            requestId={id}
            subject={reminder.subject}
            initialText={reminder.text}
            nothingToAsk={reminder.nothingToAsk}
            hasLink={reminder.hasLink}
            email={d.client.email}
            phone={d.client.phone}
            history={d.reminders}
          />
          <section className="rounded-xl bg-white p-6 shadow-card" aria-labelledby="histo">
            <h2 id="histo" className="display text-[1.3rem] text-night">Historique</h2>
            <ol className="mt-4 space-y-4 border-l border-line pl-4">
              {d.events.map((e) => (
                <li key={e.id} className="relative">
                  <span aria-hidden="true" className="absolute -left-[1.38rem] top-1.5 h-2 w-2 rounded-full bg-champagne-deep" />
                  <p className="text-[0.9rem] font-medium text-night">{EVENT_LABEL[e.type] ?? e.type}</p>
                  <p className="text-[0.78rem] text-ink-muted">{ACTOR_LABEL[e.actor] ?? e.actor} · {fmtDateTime(e.created_at)}</p>
                </li>
              ))}
            </ol>
          </section>
          <RequestActions requestId={id} closed={closed} />
        </aside>
      </div>
    </>
  );
}
