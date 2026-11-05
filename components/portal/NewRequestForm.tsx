"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { ArrowRight, Mail, MessageCircle, Plus, Trash2 } from "lucide-react";
import { createRequestAction } from "@/app/espace-pro/actions";
import { DEFAULT_LINK_TTL_DAYS, LINK_TTL_CHOICES } from "@/lib/portal/constants";
import { mailtoLink, whatsappLink } from "@/lib/portal/messages";
import { slugifyKey } from "@/lib/portal/rules";
import type { TemplateView } from "@/lib/portal/admin";
import { CopyButton } from "./CopyButton";
import { FieldsEditor } from "./FieldsEditor";
import type { InfoField } from "@/lib/portal/types";

interface Row {
  key: string;
  label: string;
  instructions: string;
  required: boolean;
  formats: string[];
  conditionQuestion: string;
  conditionEquals: "yes" | "no";
}
interface Q { key: string; label: string; type?: "yesno" | "checkbox" }

const uid = () => crypto.randomUUID();
// Clés déterministes au rendu initial (un identifiant aléatoire provoquerait une erreur d'hydratation) ;
// les lignes ajoutées ensuite par l'utilisateur reçoivent un identifiant unique.
const toRows = (t?: TemplateView): Row[] =>
  (t?.items ?? []).map((i, n) => ({
    key: `${t?.id ?? "t"}-${n}`,
    label: i.label,
    instructions: i.instructions ?? "",
    required: i.required,
    formats: i.formats ?? [],
    conditionQuestion: i.conditionQuestion ?? "",
    conditionEquals: (i.conditionEquals ?? "yes") as "yes" | "no",
  }));

export function NewRequestForm({
  templates,
  clients,
  insurances,
}: {
  templates: TemplateView[];
  clients: { id: string; full_name: string; email: string | null; phone: string | null }[];
  insurances: { slug: string; name: string }[];
}) {
  const [clientMode, setClientMode] = useState<"existing" | "new">(clients.length ? "existing" : "new");
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [nc, setNc] = useState({ fullName: "", email: "", phone: "" });
  const [slug, setSlug] = useState(insurances[0]?.slug ?? "");
  const forSlug = useMemo(() => templates.filter((t) => t.insuranceSlug === slug), [templates, slug]);
  const [templateId, setTemplateId] = useState(forSlug[0]?.id ?? "");
  const tpl = templates.find((t) => t.id === templateId);
  const [rows, setRows] = useState<Row[]>(() => toRows(forSlug[0]));
  const [questions, setQuestions] = useState<Q[]>(forSlug[0]?.questions ?? []);
  const [fields, setFields] = useState<InfoField[]>(forSlug[0]?.fields ?? []);
  const [instructions, setInstructions] = useState(forSlug[0]?.instructions ?? "");
  const [ttl, setTtl] = useState<number>(DEFAULT_LINK_TTL_DAYS);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ id: string; link: string } | null>(null);
  const [pending, start] = useTransition();

  const applyTemplate = (t?: TemplateView) => {
    setTemplateId(t?.id ?? "");
    setRows(toRows(t));
    setQuestions(t?.questions ?? []);
    setFields(t?.fields ?? []);
    setInstructions(t?.instructions ?? "");
  };
  const changeInsurance = (s: string) => {
    setSlug(s);
    applyTemplate(templates.find((t) => t.insuranceSlug === s));
  };
  const patch = (key: string, p: Partial<Row>) => setRows((r) => r.map((x) => (x.key === key ? { ...x, ...p } : x)));

  const client = clientMode === "existing" ? clients.find((c) => c.id === clientId) : { full_name: nc.fullName, email: nc.email, phone: nc.phone };

  function submit() {
    setError("");
    start(async () => {
      const res = await createRequestAction({
        clientId: clientMode === "existing" ? clientId : undefined,
        newClient: clientMode === "new" ? nc : undefined,
        insuranceSlug: slug,
        title: tpl?.name, // le client voit le nom du modèle choisi (ex. « Moto », « PNO »)
        instructions,
        questions,
        fields,
        linkTtlDays: ttl,
        items: rows.map((r) => ({
          label: r.label,
          instructions: r.instructions,
          required: r.required,
          formats: r.formats.length ? r.formats : undefined,
          conditionQuestion: r.conditionQuestion || null,
          conditionEquals: r.conditionQuestion ? r.conditionEquals : null,
        })),
      });
      if (res.ok) setResult({ id: res.id, link: res.link });
      else setError(res.error);
    });
  }

  // ───── Écran « lien généré » ─────
  if (result) {
    const first = (client?.full_name ?? "").trim().split(/\s+/)[0];
    const insuranceName = insurances.find((i) => i.slug === slug)?.name ?? "assurance";
    const text = `Bonjour${first ? ` ${first}` : ""},\n\nPour étudier votre demande (${insuranceName}), merci de transmettre vos documents via ce lien sécurisé :\n${result.link}\n\nMerci,\nL'équipe Ruby Assur'`;
    return (
      <div className="rounded-xl bg-white p-6 shadow-card sm:p-8" role="status">
        <p className="eyebrow">Demande créée</p>
        <h2 className="display mt-3 text-display-sm text-night">Le lien sécurisé est prêt.</h2>
        <p className="mt-2 text-[0.95rem] text-ink-muted">Valable {ttl} jours. Vous pourrez le recopier, le prolonger, le régénérer ou le révoquer depuis la fiche du dossier.</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input readOnly value={result.link} aria-label="Lien client" onFocus={(e) => e.currentTarget.select()} className="field flex-1 font-mono text-[0.8rem]" />
          <CopyButton text={result.link} label="Copier le lien" className="justify-center" />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {client?.phone && (
            <a href={whatsappLink(client.phone, text)} target="_blank" rel="noopener noreferrer" className="btn-outline btn-sm"><MessageCircle className="h-4 w-4" aria-hidden="true" /> Envoyer par WhatsApp</a>
          )}
          {client?.email && (
            <a href={mailtoLink(client.email, "Vos documents — Ruby Assur'", text)} className="btn-outline btn-sm"><Mail className="h-4 w-4" aria-hidden="true" /> Préparer un e-mail</a>
          )}
          <CopyButton text={text} label="Copier le message" />
        </div>
        <p className="mt-4 text-[0.82rem] text-ink-faint">Rien n&apos;est envoyé automatiquement : vous choisissez le canal.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/espace-pro/dossiers/${result.id}`} className="btn-primary">Ouvrir le dossier <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          <Link href="/espace-pro/dossiers/nouveau" onClick={() => location.assign("/espace-pro/dossiers/nouveau")} className="btn-outline">Créer une autre demande</Link>
        </div>
      </div>
    );
  }

  const card = "rounded-xl bg-white p-6 shadow-card sm:p-8";
  const lab = "mb-1.5 block text-[0.85rem] font-semibold text-night";

  return (
    <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="space-y-6">
      {/* 1. Client */}
      <section className={card} aria-labelledby="s1">
        <h2 id="s1" className="display text-display-sm text-night"><span className="mr-2 text-champagne-deep">1.</span>Le client</h2>
        <div className="mt-4 flex gap-2" role="radiogroup" aria-label="Type de client">
          {clients.length > 0 && <button type="button" role="radio" aria-checked={clientMode === "existing"} onClick={() => setClientMode("existing")} className={`rounded-full px-4 py-2 text-sm font-semibold ${clientMode === "existing" ? "bg-night text-white" : "bg-night/5 text-ink-soft"}`}>Client existant</button>}
          <button type="button" role="radio" aria-checked={clientMode === "new"} onClick={() => setClientMode("new")} className={`rounded-full px-4 py-2 text-sm font-semibold ${clientMode === "new" ? "bg-night text-white" : "bg-night/5 text-ink-soft"}`}>Nouveau client</button>
        </div>
        {clientMode === "existing" ? (
          <div className="mt-4">
            <label className={lab} htmlFor="client">Client</label>
            <select id="client" value={clientId} onChange={(e) => setClientId(e.target.value)} className="field">
              {clients.map((c) => <option key={c.id} value={c.id}>{c.full_name}{c.email ? ` — ${c.email}` : ""}</option>)}
            </select>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-1"><label className={lab} htmlFor="nom">Nom complet *</label><input id="nom" required value={nc.fullName} onChange={(e) => setNc({ ...nc, fullName: e.target.value })} className="field" /></div>
            <div><label className={lab} htmlFor="mail">E-mail</label><input id="mail" type="email" value={nc.email} onChange={(e) => setNc({ ...nc, email: e.target.value })} className="field" /></div>
            <div><label className={lab} htmlFor="tel">Téléphone</label><input id="tel" type="tel" value={nc.phone} onChange={(e) => setNc({ ...nc, phone: e.target.value })} className="field" /></div>
          </div>
        )}
      </section>

      {/* 2. Assurance */}
      <section className={card} aria-labelledby="s2">
        <h2 id="s2" className="display text-display-sm text-night"><span className="mr-2 text-champagne-deep">2.</span>Le type d&apos;assurance</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={lab} htmlFor="ins">Assurance</label>
            <select id="ins" value={slug} onChange={(e) => changeInsurance(e.target.value)} className="field">
              {insurances.map((i) => <option key={i.slug} value={i.slug}>{i.name}</option>)}
            </select>
          </div>
          <div>
            <label className={lab} htmlFor="tpl">Modèle de documents</label>
            <select id="tpl" value={templateId} onChange={(e) => applyTemplate(templates.find((t) => t.id === e.target.value))} className="field">
              {forSlug.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              <option value="">Demande vide (je choisis tout)</option>
            </select>
          </div>
        </div>
        {tpl?.isDefault && <p className="mt-3 text-[0.82rem] text-warn">Modèle initial proposé à partir des pièces listées sur le site : à valider et ajuster selon vos assureurs.</p>}
      </section>

      {/* 3. Documents */}
      <section className={card} aria-labelledby="s3">
        <h2 id="s3" className="display text-display-sm text-night"><span className="mr-2 text-champagne-deep">3.</span>Les documents demandés</h2>
        <p className="mt-1 text-[0.9rem] text-ink-muted">Modifiez librement la liste avant l&apos;envoi : ajoutez, retirez, rendez une pièce obligatoire ou facultative.</p>
        <ul className="mt-5 space-y-3">
          {rows.map((r, i) => (
            <li key={r.key} className="rounded-lg border border-line p-4">
              <div className="flex flex-wrap items-start gap-3">
                <span className="display w-7 pt-2 text-[1.2rem] text-champagne-deep" aria-hidden="true">{i + 1}</span>
                <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-[1.2fr_1fr]">
                  <div><label className="sr-only" htmlFor={`l-${r.key}`}>Nom du document</label><input id={`l-${r.key}`} required value={r.label} onChange={(e) => patch(r.key, { label: e.target.value })} placeholder="Nom du document" className="field" /></div>
                  <div><label className="sr-only" htmlFor={`i-${r.key}`}>Précision pour le client</label><input id={`i-${r.key}`} value={r.instructions} onChange={(e) => patch(r.key, { instructions: e.target.value })} placeholder="Précision pour le client (facultatif)" className="field" /></div>
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <label className="flex items-center gap-2 whitespace-nowrap text-[0.88rem] font-medium text-ink-soft">
                    <input type="checkbox" checked={r.required} onChange={(e) => patch(r.key, { required: e.target.checked })} className="h-4 w-4 accent-night" /> Obligatoire
                  </label>
                  <button type="button" onClick={() => setRows((x) => x.filter((y) => y.key !== r.key))} aria-label={`Retirer « ${r.label || "ce document"} »`} className="grid h-9 w-9 place-items-center rounded-full text-ink-muted transition hover:bg-danger-soft hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              {questions.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-2 pl-10 text-[0.85rem] text-ink-muted">
                  Demander seulement si
                  <select value={r.conditionQuestion} onChange={(e) => patch(r.key, { conditionQuestion: e.target.value })} className="field !w-auto !py-1.5 text-[0.85rem]" aria-label="Question conditionnelle">
                    <option value="">— toujours demandé —</option>
                    {questions.map((q) => <option key={q.key} value={q.key}>{q.label}</option>)}
                  </select>
                  {r.conditionQuestion && (
                    <select value={r.conditionEquals} onChange={(e) => patch(r.key, { conditionEquals: e.target.value as "yes" | "no" })} className="field !w-auto !py-1.5 text-[0.85rem]" aria-label="Réponse attendue">
                      {questions.find((q) => q.key === r.conditionQuestion)?.type === "checkbox"
                        ? (<><option value="yes">si la case est cochée</option><option value="no">si la case n&apos;est pas cochée</option></>)
                        : (<><option value="yes">réponse : oui</option><option value="no">réponse : non</option></>)}
                    </select>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" className="btn-outline btn-sm" onClick={() => setRows((x) => [...x, { key: uid(), label: "", instructions: "", required: true, formats: [], conditionQuestion: "", conditionEquals: "yes" }])}>
            <Plus className="h-4 w-4" aria-hidden="true" /> Ajouter un document
          </button>
          <button type="button" className="btn-outline btn-sm" onClick={() => { const label = window.prompt("Question oui/non posée au client (ex. : Êtes-vous déjà assuré pour ce véhicule ?)"); if (label?.trim()) setQuestions((q) => [...q, { key: slugifyKey(label), label: label.trim() }]); }}>
            <Plus className="h-4 w-4" aria-hidden="true" /> Ajouter une question conditionnelle
          </button>
        </div>
        {questions.length > 0 && (
          <ul className="mt-3 space-y-1 text-[0.85rem] text-ink-muted">
            {questions.map((q) => <li key={q.key} className="flex items-center gap-2">« {q.label} » <button type="button" className="text-danger underline" onClick={() => { setQuestions((x) => x.filter((y) => y.key !== q.key)); setRows((x) => x.map((r) => (r.conditionQuestion === q.key ? { ...r, conditionQuestion: "" } : r))); }}>supprimer</button></li>)}
          </ul>
        )}
      </section>

      {/* Informations saisies par le client */}
      <section className={card} aria-labelledby="s3b">
        <h2 id="s3b" className="display text-display-sm text-night"><span className="mr-2 text-champagne-deep">3 bis.</span>Informations à saisir par le client</h2>
        <p className="mt-1 text-[0.9rem] text-ink-muted">En plus des documents, le client peut renseigner ces informations (adresse, surface, profession…). Facultatif.</p>
        <div className="mt-4"><FieldsEditor fields={fields} onChange={setFields} questions={questions} /></div>
      </section>

      {/* 4. Options */}
      <section className={card} aria-labelledby="s4">
        <h2 id="s4" className="display text-display-sm text-night"><span className="mr-2 text-champagne-deep">4.</span>Précisions et durée du lien</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_14rem]">
          <div>
            <label className={lab} htmlFor="instr">Message affiché au client (facultatif)</label>
            <textarea id="instr" rows={3} value={instructions} onChange={(e) => setInstructions(e.target.value)} className="field" placeholder="Ex. : informations utiles à avoir sous la main…" />
          </div>
          <div>
            <label className={lab} htmlFor="ttl">Le lien expire après</label>
            <select id="ttl" value={ttl} onChange={(e) => setTtl(Number(e.target.value))} className="field">
              {LINK_TTL_CHOICES.map((d) => <option key={d} value={d}>{d} jours</option>)}
            </select>
          </div>
        </div>
      </section>

      {error && <p role="alert" className="rounded-md bg-danger-soft px-4 py-3 text-[0.92rem] text-danger">{error}</p>}
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending || (rows.length === 0 && fields.length === 0)} className="btn-primary">{pending ? "Création…" : "Créer la demande et générer le lien"}</button>
        <p className="text-[0.85rem] text-ink-muted">{rows.filter((r) => r.required).length} pièce(s) obligatoire(s) sur {rows.length}</p>
      </div>
    </form>
  );
}
