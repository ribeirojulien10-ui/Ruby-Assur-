"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Archive, ArchiveRestore, Trash2 } from "lucide-react";
import { closeRequestAction, deleteRequestAction, reopenRequestAction } from "@/app/espace-pro/actions";

export function RequestActions({ requestId, closed }: { requestId: string; closed: boolean }) {
  const router = useRouter();
  const [del, setDel] = useState(false);
  const [word, setWord] = useState("");
  const [msg, setMsg] = useState("");
  const [pending, start] = useTransition();
  return (
    <section className="rounded-xl border border-line p-6" aria-labelledby="zone">
      <h2 id="zone" className="display text-[1.3rem] text-night">Clôture et suppression</h2>
      <div className="mt-4 flex flex-wrap gap-3">
        {closed ? (
          <button className="btn-outline btn-sm" disabled={pending} onClick={() => start(async () => { const r = await reopenRequestAction(requestId); if (!r.ok) setMsg(r.error); })}><ArchiveRestore className="h-4 w-4" aria-hidden="true" /> Rouvrir le dossier</button>
        ) : (
          <button className="btn-primary btn-sm" disabled={pending} onClick={() => start(async () => { const r = await closeRequestAction(requestId); if (!r.ok) setMsg(r.error); })}><Archive className="h-4 w-4" aria-hidden="true" /> Clôturer le dossier</button>
        )}
        <button className="btn-outline btn-sm !border-danger/40 !text-danger hover:!bg-danger hover:!text-white" onClick={() => setDel(!del)} aria-expanded={del}><Trash2 className="h-4 w-4" aria-hidden="true" /> Supprimer définitivement</button>
      </div>
      {closed && <p className="mt-3 text-[0.85rem] text-ink-muted">Le lien du client ne fonctionne plus : le dossier est clôturé.</p>}
      {del && (
        <div className="mt-4 rounded-lg bg-danger-soft p-4 text-[0.88rem] text-danger">
          <p>Les fichiers et toutes les données du dossier seront effacés de façon irréversible. Seule une trace anonyme de la suppression est conservée.</p>
          <label htmlFor="conf" className="mt-3 block font-semibold">Tapez SUPPRIMER pour confirmer</label>
          <div className="mt-2 flex gap-2">
            <input id="conf" value={word} onChange={(e) => setWord(e.target.value)} className="field !py-2 !w-48" autoComplete="off" />
            <button disabled={word !== "SUPPRIMER" || pending} className="btn-primary btn-sm !bg-danger" onClick={() => start(async () => { const r = await deleteRequestAction(requestId); if (r.ok) router.push("/espace-pro/dossiers"); else setMsg(r.error); })}>Supprimer</button>
          </div>
        </div>
      )}
      {msg && <p role="alert" className="mt-3 text-[0.85rem] text-danger">{msg}</p>}
    </section>
  );
}
