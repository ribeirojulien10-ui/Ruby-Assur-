"use client";

import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Plus, Save, Trash2 } from "lucide-react";
import { deleteTemplateAction, saveTemplateAction } from "@/app/espace-pro/actions";
import { slugifyKey } from "@/lib/portal/rules";
import type { InfoField } from "@/lib/portal/types";
import { FieldsEditor } from "./FieldsEditor";
import type { TemplateView } from "@/lib/portal/admin";

interface Row { key: string; label: string; instructions: string; required: boolean; formats: string[]; conditionQuestion: string; conditionEquals: "yes" | "no" }
const uid = () => crypto.randomUUID();

export function TemplateEditor({ template, insurances }: { template: TemplateView | null; insurances: { slug: string; name: string }[] }) {
  const [name, setName] = useState(template?.name ?? "");
  const [slug, setSlug] = useState(template?.insuranceSlug ?? insurances[0].slug);
  const [description, setDescription] = useState(template?.description ?? "");
  const [instructions, setInstructions] = useState(template?.instructions ?? "");
  const [questions, setQuestions] = useState<{ key: string; label: string; type?: "yesno" | "checkbox" }[]>(template?.questions ?? []);
  const [fields, setFields] = useState<InfoField[]>(template?.fields ?? []);
  const [rows, setRows] = useState<Row[]>(
    (template?.items ?? []).map((i, n) => ({ key: `${template?.id ?? "new"}-${n}`, label: i.label, instructions: i.instructions ?? "", required: i.required, formats: i.formats ?? [], conditionQuestion: i.conditionQuestion ?? "", conditionEquals: (i.conditionEquals ?? "yes") as "yes" | "no" })),
  );
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();
  const patch = (k: string, p: Partial<Row>) => setRows((r) => r.map((x) => (x.key === k ? { ...x, ...p } : x)));
  const move = (i: number, d: -1 | 1) => setRows((r) => { const n = [...r]; const j = i + d; if (j < 0 || j >= n.length) return r; [n[i], n[j]] = [n[j], n[i]]; return n; });

  const save = () =>
    start(async () => {
      const r = await saveTemplateAction({
        id: template?.id,
        insuranceSlug: slug,
        name,
        description,
        instructions,
        questions,
        fields,
        items: rows.map((x) => ({ label: x.label, instructions: x.instructions, required: x.required, formats: x.formats.length ? x.formats : undefined, conditionQuestion: x.conditionQuestion || null, conditionEquals: x.conditionQuestion ? x.conditionEquals : null })),
      });
      setMsg(r.ok ? { ok: true, text: "Modèle enregistré." } : { ok: false, text: r.error });
    });

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="mb-1.5 block text-[0.85rem] font-semibold text-night" htmlFor={`n-${template?.id ?? "new"}`}>Nom du modèle</label><input id={`n-${template?.id ?? "new"}`} value={name} onChange={(e) => setName(e.target.value)} className="field" /></div>
        <div><label className="mb-1.5 block text-[0.85rem] font-semibold text-night" htmlFor={`s-${template?.id ?? "new"}`}>Assurance</label>
          <select id={`s-${template?.id ?? "new"}`} value={slug} onChange={(e) => setSlug(e.target.value)} className="field">{insurances.map((i) => <option key={i.slug} value={i.slug}>{i.name}</option>)}</select></div>
        <div className="sm:col-span-2"><label className="mb-1.5 block text-[0.85rem] font-semibold text-night" htmlFor={`d-${template?.id ?? "new"}`}>Description (interne)</label><input id={`d-${template?.id ?? "new"}`} value={description} onChange={(e) => setDescription(e.target.value)} className="field" /></div>
        <div className="sm:col-span-2"><label className="mb-1.5 block text-[0.85rem] font-semibold text-night" htmlFor={`i-${template?.id ?? "new"}`}>Message affiché au client (précisions)</label><textarea id={`i-${template?.id ?? "new"}`} rows={2} value={instructions} onChange={(e) => setInstructions(e.target.value)} className="field" /></div>
      </div>

      <div>
        <p className="text-[0.85rem] font-semibold text-night">Documents</p>
        <ul className="mt-2 space-y-2">
          {rows.map((r, i) => (
            <li key={r.key} className="rounded-lg border border-line p-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex flex-col">
                  <button type="button" aria-label="Monter" onClick={() => move(i, -1)} className="grid h-6 w-6 place-items-center text-ink-muted hover:text-night"><ArrowUp className="h-4 w-4" /></button>
                  <button type="button" aria-label="Descendre" onClick={() => move(i, 1)} className="grid h-6 w-6 place-items-center text-ink-muted hover:text-night"><ArrowDown className="h-4 w-4" /></button>
                </div>
                <input value={r.label} onChange={(e) => patch(r.key, { label: e.target.value })} aria-label="Nom du document" placeholder="Nom du document" className="field !w-auto min-w-[12rem] flex-1 !py-2" />
                <input value={r.instructions} onChange={(e) => patch(r.key, { instructions: e.target.value })} aria-label="Précision" placeholder="Précision (facultatif)" className="field !w-auto min-w-[10rem] flex-1 !py-2" />
                <label className="flex items-center gap-2 whitespace-nowrap text-[0.85rem] text-ink-soft"><input type="checkbox" checked={r.required} onChange={(e) => patch(r.key, { required: e.target.checked })} className="h-4 w-4 accent-night" /> Obligatoire</label>
                <button type="button" aria-label="Retirer ce document" onClick={() => setRows((x) => x.filter((y) => y.key !== r.key))} className="grid h-8 w-8 place-items-center rounded-full text-ink-muted hover:bg-danger-soft hover:text-danger"><Trash2 className="h-4 w-4" /></button>
              </div>
              {questions.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-2 pl-8 text-[0.82rem] text-ink-muted">
                  Demander seulement si
                  <select value={r.conditionQuestion} onChange={(e) => patch(r.key, { conditionQuestion: e.target.value })} className="field !w-auto !py-1 text-[0.82rem]" aria-label="Condition"><option value="">— toujours —</option>{questions.map((q) => <option key={q.key} value={q.key}>{q.label}</option>)}</select>
                  {r.conditionQuestion && <select value={r.conditionEquals} onChange={(e) => patch(r.key, { conditionEquals: e.target.value as "yes" | "no" })} className="field !w-auto !py-1 text-[0.82rem]" aria-label="Réponse">{questions.find((q) => q.key === r.conditionQuestion)?.type === "checkbox" ? (<><option value="yes">case cochée</option><option value="no">case non cochée</option></>) : (<><option value="yes">oui</option><option value="no">non</option></>)}</select>}
                </div>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" className="btn-outline btn-sm" onClick={() => setRows((x) => [...x, { key: uid(), label: "", instructions: "", required: true, formats: [], conditionQuestion: "", conditionEquals: "yes" }])}><Plus className="h-4 w-4" aria-hidden="true" /> Ajouter un document</button>
          <button type="button" className="btn-outline btn-sm" onClick={() => { const l = window.prompt("Question oui/non posée au client :"); if (l?.trim()) setQuestions((q) => [...q, { key: slugifyKey(l), label: l.trim() }]); }}><Plus className="h-4 w-4" aria-hidden="true" /> Question conditionnelle</button>
        </div>
        {questions.length > 0 && <ul className="mt-2 text-[0.82rem] text-ink-muted">{questions.map((q) => <li key={q.key}>« {q.label} » <button type="button" className="text-danger underline" onClick={() => { setQuestions((x) => x.filter((y) => y.key !== q.key)); setRows((x) => x.map((r) => (r.conditionQuestion === q.key ? { ...r, conditionQuestion: "" } : r))); }}>supprimer</button></li>)}</ul>}
      </div>

      <div>
        <p className="text-[0.85rem] font-semibold text-night">Informations que le client peut saisir</p>
        <div className="mt-2"><FieldsEditor fields={fields} onChange={setFields} questions={questions} /></div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="btn-primary btn-sm" disabled={pending || !name.trim() || (rows.length === 0 && fields.length === 0)} onClick={save}><Save className="h-4 w-4" aria-hidden="true" /> Enregistrer</button>
        {template && !template.isDefault && (
          <button type="button" className="btn-outline btn-sm !text-danger" disabled={pending} onClick={() => { if (window.confirm("Supprimer ce modèle ? Les demandes déjà créées ne sont pas affectées.")) start(async () => { const r = await deleteTemplateAction(template.id); if (!r.ok) setMsg({ ok: false, text: r.error }); }); }}>Supprimer le modèle</button>
        )}
        {template?.isDefault && <span className="text-[0.8rem] text-ink-muted">Modèle initial : modifiable, non supprimable.</span>}
        {msg && <p role={msg.ok ? "status" : "alert"} className={`text-[0.85rem] ${msg.ok ? "text-ok" : "text-danger"}`}>{msg.text}</p>}
      </div>
    </div>
  );
}
