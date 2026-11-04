"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { addItemAction } from "@/app/espace-pro/actions";

export function AddItemForm({ requestId }: { requestId: string }) {
  const [label, setLabel] = useState("");
  const [instructions, setInstructions] = useState("");
  const [required, setRequired] = useState(true);
  const [msg, setMsg] = useState("");
  const [pending, start] = useTransition();
  return (
    <form
      className="rounded-lg border border-dashed border-night/25 p-4"
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          const r = await addItemAction(requestId, label, required, instructions);
          if (!r.ok) setMsg(r.error);
          else { setLabel(""); setInstructions(""); setMsg(""); }
        });
      }}
    >
      <p className="text-[0.9rem] font-semibold text-night">Demander un document supplémentaire</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-[1.2fr_1fr_auto_auto] sm:items-center">
        <input required value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Nom du document" aria-label="Nom du document" className="field !py-2.5" />
        <input value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Précision (facultatif)" aria-label="Précision" className="field !py-2.5" />
        <label className="flex items-center gap-2 whitespace-nowrap text-[0.85rem] text-ink-soft"><input type="checkbox" checked={required} onChange={(e) => setRequired(e.target.checked)} className="h-4 w-4 accent-night" /> Obligatoire</label>
        <button className="btn-outline btn-sm" disabled={pending}><Plus className="h-4 w-4" aria-hidden="true" /> Ajouter</button>
      </div>
      {msg && <p role="alert" className="mt-2 text-[0.85rem] text-danger">{msg}</p>}
    </form>
  );
}
