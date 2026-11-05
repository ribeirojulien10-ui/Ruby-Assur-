"use client";

import { Plus, Trash2 } from "lucide-react";
import { slugifyKey } from "@/lib/portal/rules";
import type { InfoField } from "@/lib/portal/types";

const TYPES: { value: InfoField["type"]; label: string }[] = [
  { value: "text", label: "Texte court" },
  { value: "textarea", label: "Texte long" },
  { value: "number", label: "Nombre" },
  { value: "date", label: "Date" },
  { value: "choice", label: "Choix" },
  { value: "persons", label: "Personnes (nom + naissance)" },
  { value: "tel", label: "Téléphone" },
  { value: "email", label: "E-mail" },
];

/** Éditeur des informations que le client peut saisir (aucun code à modifier). */
export function FieldsEditor({ fields, onChange, questions = [] }: { fields: InfoField[]; onChange: (f: InfoField[]) => void; questions?: { key: string; label: string; type?: "yesno" | "checkbox" }[] }) {
  const patch = (i: number, p: Partial<InfoField>) => onChange(fields.map((f, j) => (j === i ? { ...f, ...p } : f)));
  return (
    <div>
      <ul className="space-y-2">
        {fields.map((f, i) => (
          <li key={f.key + i} className="rounded-lg border border-line p-3">
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={f.label}
                onChange={(e) => patch(i, { label: e.target.value, key: f.key.startsWith("nouveau-") || !f.key ? slugifyKey(e.target.value) || f.key : f.key })}
                aria-label="Intitulé de l'information"
                placeholder="Intitulé (ex. Surface habitable)"
                className="field !w-auto min-w-[12rem] flex-1 !py-2"
              />
              <select value={f.type} onChange={(e) => patch(i, { type: e.target.value as InfoField["type"] })} aria-label="Type de réponse" className="field !w-auto !py-2 text-[0.88rem]">
                {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              {(f.type === "number") && (
                <input value={f.unit ?? ""} onChange={(e) => patch(i, { unit: e.target.value })} aria-label="Unité" placeholder="Unité (m²…)" className="field !w-24 !py-2 text-[0.88rem]" />
              )}
              <label className="flex items-center gap-2 whitespace-nowrap text-[0.85rem] text-ink-soft">
                <input type="checkbox" checked={!!f.required} onChange={(e) => patch(i, { required: e.target.checked })} className="h-4 w-4 accent-night" /> Obligatoire
              </label>
              <button type="button" aria-label="Retirer cette information" onClick={() => onChange(fields.filter((_, j) => j !== i))} className="grid h-9 w-9 place-items-center rounded-full text-ink-muted hover:bg-danger-soft hover:text-danger">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            {f.type === "persons" && (
              <div className="mt-2 flex flex-wrap items-center gap-4 text-[0.85rem] text-ink-soft">
                <label className="flex items-center gap-2"><input type="checkbox" checked={!!f.birthRequired} onChange={(e) => patch(i, { birthRequired: e.target.checked })} className="h-4 w-4 accent-night" /> Date de naissance obligatoire</label>
                <label className="flex items-center gap-2">Maximum
                  <input type="number" min={1} max={8} value={f.max ?? 8} onChange={(e) => patch(i, { max: Number(e.target.value) || 8 })} className="field !w-20 !py-1.5 text-[0.85rem]" />
                </label>
              </div>
            )}
            {questions.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[0.82rem] text-ink-muted">
                Afficher seulement si
                <select value={f.condition?.question ?? ""} onChange={(e) => patch(i, { condition: e.target.value ? { question: e.target.value, equals: f.condition?.equals ?? "yes" } : undefined })} className="field !w-auto !py-1 text-[0.82rem]" aria-label="Condition d'affichage">
                  <option value="">— toujours —</option>
                  {questions.map((q) => <option key={q.key} value={q.key}>{q.label}</option>)}
                </select>
                {f.condition && (
                  <select value={f.condition.equals} onChange={(e) => patch(i, { condition: { question: f.condition!.question, equals: e.target.value as "yes" | "no" } })} className="field !w-auto !py-1 text-[0.82rem]" aria-label="Valeur attendue">
                    {questions.find((q) => q.key === f.condition!.question)?.type === "checkbox"
                      ? (<><option value="yes">case cochée</option><option value="no">case non cochée</option></>)
                      : (<><option value="yes">oui</option><option value="no">non</option></>)}
                  </select>
                )}
              </div>
            )}
            {f.type === "choice" && (
              <input
                value={(f.options ?? []).join(", ")}
                onChange={(e) => patch(i, { options: e.target.value.split(",").map((o) => o.trimStart()) })}
                aria-label="Choix possibles, séparés par des virgules"
                placeholder="Choix possibles, séparés par une virgule (ex. Maison, Appartement)"
                className="field mt-2 !py-2 text-[0.88rem]"
              />
            )}
          </li>
        ))}
      </ul>
      <button type="button" className="btn-outline btn-sm mt-3" onClick={() => onChange([...fields, { key: `nouveau-${fields.length + 1}`, label: "", type: "text" }])}>
        <Plus className="h-4 w-4" aria-hidden="true" /> Ajouter une information à saisir
      </button>
    </div>
  );
}
