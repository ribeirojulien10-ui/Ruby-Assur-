"use client";

import { useState, useTransition } from "react";
import { Check, RefreshCcw, Trash2 } from "lucide-react";
import { removeItemAction, reviewItemAction, setItemRequiredAction } from "@/app/espace-pro/actions";
import { REJECT_REASONS } from "@/lib/portal/config";
import type { ItemState } from "@/lib/portal/types";

export function ReviewControls({ requestId, itemId, state, required, hasFiles, closed }: { requestId: string; itemId: string; state: ItemState; required: boolean; hasFiles: boolean; closed: boolean }) {
  const [mode, setMode] = useState<"idle" | "replace">("idle");
  const [reason, setReason] = useState<keyof typeof REJECT_REASONS>("illisible");
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState("");
  const [pending, start] = useTransition();

  const go = (fn: () => Promise<{ ok: boolean; error?: string }>) =>
    start(async () => {
      setMsg("");
      const r = await fn();
      if (!r.ok) setMsg(r.error ?? "Erreur");
      else setMode("idle");
    });

  if (closed) return null;
  return (
    <div className="mt-4 border-t border-line pt-4">
      <div className="flex flex-wrap items-center gap-2">
        {hasFiles && state !== "to_replace" && state !== "validated" && (
          <button type="button" disabled={pending} className="btn-primary btn-sm" onClick={() => go(() => reviewItemAction(requestId, itemId, "validate"))}>
            <Check className="h-4 w-4" aria-hidden="true" /> Valider ce document
          </button>
        )}
        {hasFiles && state !== "to_replace" && (
          <button type="button" disabled={pending} className="btn-outline btn-sm" onClick={() => setMode(mode === "replace" ? "idle" : "replace")} aria-expanded={mode === "replace"}>
            <RefreshCcw className="h-4 w-4" aria-hidden="true" /> {state === "validated" ? "Remettre en question" : "À remplacer"}
          </button>
        )}
        <span className="flex-1" />
        <label className="flex items-center gap-2 text-[0.82rem] text-ink-muted">
          <input type="checkbox" checked={required} disabled={pending} onChange={(e) => go(() => setItemRequiredAction(requestId, itemId, e.target.checked))} className="h-4 w-4 accent-night" /> Obligatoire
        </label>
        <button type="button" disabled={pending} aria-label="Retirer cette pièce de la demande" title="Retirer cette pièce" onClick={() => { if (window.confirm("Retirer cette pièce de la demande ? Les fichiers déposés seront supprimés.")) go(() => removeItemAction(requestId, itemId)); }} className="grid h-8 w-8 place-items-center rounded-full text-ink-muted transition hover:bg-danger-soft hover:text-danger">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      {mode === "replace" && (
        <div className="mt-3 grid gap-3 rounded-lg bg-ivory p-4 sm:grid-cols-[14rem_1fr_auto] sm:items-end">
          <div>
            <label htmlFor={`r-${itemId}`} className="mb-1 block text-[0.8rem] font-semibold text-night">Motif</label>
            <select id={`r-${itemId}`} value={reason} onChange={(e) => setReason(e.target.value as keyof typeof REJECT_REASONS)} className="field !py-2 text-[0.88rem]">
              {Object.entries(REJECT_REASONS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor={`n-${itemId}`} className="mb-1 block text-[0.8rem] font-semibold text-night">Précision pour le client {reason === "autre" ? "*" : "(facultatif)"}</label>
            <input id={`n-${itemId}`} value={note} onChange={(e) => setNote(e.target.value)} maxLength={300} className="field !py-2 text-[0.88rem]" placeholder="Ex. : la photo est floue, merci de la reprendre." />
          </div>
          <button type="button" disabled={pending || (reason === "autre" && !note.trim())} className="btn-primary btn-sm" onClick={() => go(() => reviewItemAction(requestId, itemId, "replace", reason, note))}>Demander le remplacement</button>
        </div>
      )}
      {msg && <p role="alert" className="mt-2 text-[0.85rem] text-danger">{msg}</p>}
    </div>
  );
}
