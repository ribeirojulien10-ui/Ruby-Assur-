"use client";

import { useState, useTransition } from "react";
import { Link2, Mail, MessageCircle, RefreshCcw, ShieldOff, TimerReset } from "lucide-react";
import { extendLinkAction, regenerateLinkAction, revokeLinkAction } from "@/app/espace-pro/actions";
import { LIMITS } from "@/lib/portal/config";
import { mailtoLink, whatsappLink } from "@/lib/portal/messages";
import { fmtDate } from "@/lib/portal/ui";
import { CopyButton } from "./CopyButton";
import { LinkBadge } from "./StatusBadge";

export function LinkPanel({
  requestId,
  state,
  expiresAt,
  link,
  closed,
  client,
  insuranceName,
}: {
  requestId: string;
  state: "active" | "expired" | "revoked" | "none";
  expiresAt: string | null;
  link: string | null;
  closed: boolean;
  client: { fullName: string; email: string | null; phone: string | null };
  insuranceName: string;
}) {
  const [current, setCurrent] = useState(link);
  const [days, setDays] = useState<number>(LIMITS.defaultLinkTtlDays);
  const [msg, setMsg] = useState("");
  const [confirm, setConfirm] = useState<"regen" | "revoke" | null>(null);
  const [pending, start] = useTransition();

  const first = client.fullName.trim().split(/\s+/)[0];
  const text = current
    ? `Bonjour${first ? ` ${first}` : ""},\n\nPour étudier votre demande (${insuranceName}), merci de transmettre vos documents via ce lien sécurisé :\n${current}\n\nMerci,\nL'équipe Ruby Assur'`
    : "";

  const run = (fn: () => Promise<{ ok: boolean; error?: string; link?: string }>, after?: (l?: string) => void) =>
    start(async () => {
      setMsg("");
      const r = await fn();
      if (!r.ok) setMsg(r.error ?? "Erreur");
      else after?.(r.link);
      setConfirm(null);
    });

  return (
    <section className="rounded-xl bg-white p-6 shadow-card" aria-labelledby="lien">
      <div className="flex items-start justify-between gap-3">
        <h2 id="lien" className="display flex items-center gap-2 text-[1.3rem] text-night"><Link2 className="h-5 w-5 text-champagne-deep" aria-hidden="true" /> Lien sécurisé</h2>
        <LinkBadge state={state} />
      </div>
      {state === "active" && <p className="mt-1 text-[0.85rem] text-ink-muted">Expire le {fmtDate(expiresAt)}</p>}
      {state === "expired" && <p className="mt-1 text-[0.85rem] text-warn">Expiré le {fmtDate(expiresAt)} : prolongez-le ou régénérez-le.</p>}
      {state === "revoked" && <p className="mt-1 text-[0.85rem] text-danger">Révoqué : le client ne peut plus l&apos;utiliser. Régénérez-le pour en créer un nouveau.</p>}

      {current && state === "active" && (
        <div className="mt-4 space-y-3">
          <input readOnly value={current} aria-label="Lien client" onFocus={(e) => e.currentTarget.select()} className="field font-mono text-[0.75rem]" />
          <div className="flex flex-wrap gap-2">
            <CopyButton text={current} label="Copier le lien" />
            {client.phone && <a href={whatsappLink(client.phone, text)} target="_blank" rel="noopener noreferrer" className="btn-outline btn-sm"><MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp</a>}
            {client.email && <a href={mailtoLink(client.email, "Vos documents — Ruby Assur'", text)} className="btn-outline btn-sm"><Mail className="h-4 w-4" aria-hidden="true" /> E-mail</a>}
          </div>
        </div>
      )}

      {!closed && (
        <div className="mt-5 space-y-3 border-t border-line pt-4">
          {state !== "revoked" && state !== "none" && (
            <div className="flex flex-wrap items-center gap-2">
              <label className="sr-only" htmlFor="ext">Durée de prolongation</label>
              <select id="ext" value={days} onChange={(e) => setDays(Number(e.target.value))} className="field !w-auto !py-2 text-[0.88rem]">
                {LIMITS.linkTtlChoices.map((d) => <option key={d} value={d}>{d} jours</option>)}
              </select>
              <button type="button" disabled={pending} className="btn-outline btn-sm" onClick={() => run(() => extendLinkAction(requestId, days))}>
                <TimerReset className="h-4 w-4" aria-hidden="true" /> Prolonger
              </button>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {confirm === "regen" ? (
              <span className="flex flex-wrap items-center gap-2 rounded-md bg-warn-soft px-3 py-2 text-[0.85rem] text-warn">
                L&apos;ancien lien cessera de fonctionner.
                <button type="button" className="font-semibold underline" disabled={pending} onClick={() => run(() => regenerateLinkAction(requestId, days), (l) => setCurrent(l ?? null))}>Confirmer</button>
                <button type="button" className="underline" onClick={() => setConfirm(null)}>Annuler</button>
              </span>
            ) : (
              <button type="button" className="btn-outline btn-sm" onClick={() => setConfirm("regen")}><RefreshCcw className="h-4 w-4" aria-hidden="true" /> Régénérer</button>
            )}
            {state === "active" && (confirm === "revoke" ? (
              <span className="flex flex-wrap items-center gap-2 rounded-md bg-danger-soft px-3 py-2 text-[0.85rem] text-danger">
                Le client ne pourra plus accéder au dossier.
                <button type="button" className="font-semibold underline" disabled={pending} onClick={() => run(() => revokeLinkAction(requestId), () => setCurrent(null))}>Révoquer</button>
                <button type="button" className="underline" onClick={() => setConfirm(null)}>Annuler</button>
              </span>
            ) : (
              <button type="button" className="btn-outline btn-sm" onClick={() => setConfirm("revoke")}><ShieldOff className="h-4 w-4" aria-hidden="true" /> Révoquer</button>
            ))}
          </div>
        </div>
      )}
      {msg && <p role="alert" className="mt-3 text-[0.85rem] text-danger">{msg}</p>}
    </section>
  );
}
