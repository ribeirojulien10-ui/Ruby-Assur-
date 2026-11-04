"use client";

import { useState, useTransition } from "react";
import { Mail, MessageCircle, Send } from "lucide-react";
import { logReminderAction } from "@/app/espace-pro/actions";
import { mailtoLink, whatsappLink } from "@/lib/portal/messages";
import { CopyButton } from "./CopyButton";

/** Relance MANUELLE assistée : le message est préparé, Julien le relit, le copie et l'envoie lui-même. Rien n'est envoyé automatiquement. */
export function ReminderPanel({
  requestId,
  subject,
  initialText,
  nothingToAsk,
  hasLink,
  email,
  phone,
  history,
}: {
  requestId: string;
  subject: string;
  initialText: string;
  nothingToAsk: boolean;
  hasLink: boolean;
  email: string | null;
  phone: string | null;
  history: { id: string; channel: string; missing_count: number; created_at: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(initialText);
  const [, start] = useTransition();
  const log = (c: "copie" | "email" | "whatsapp") => start(async () => { await logReminderAction(requestId, c); });

  return (
    <section className="rounded-xl bg-white p-6 shadow-card" aria-labelledby="relance">
      <h2 id="relance" className="display flex items-center gap-2 text-[1.3rem] text-night"><Send className="h-5 w-5 text-champagne-deep" aria-hidden="true" /> Relance</h2>
      {nothingToAsk ? (
        <p className="mt-2 text-[0.9rem] text-ink-muted">Rien à relancer : toutes les pièces demandées sont reçues.</p>
      ) : (
        <>
          <p className="mt-2 text-[0.9rem] text-ink-muted">Prépare un message ne mentionnant que les documents manquants ou à remplacer.</p>
          {!open ? (
            <button type="button" className="btn-primary btn-sm mt-4" onClick={() => setOpen(true)}>Relancer pour les documents manquants</button>
          ) : (
            <div className="mt-4 space-y-3">
              {!hasLink && <p className="rounded-md bg-warn-soft px-3 py-2 text-[0.82rem] text-warn">Le lien n&apos;est plus actif : régénérez-le avant d&apos;envoyer ce message.</p>}
              <label htmlFor="msg" className="sr-only">Message de relance</label>
              <textarea id="msg" rows={11} value={text} onChange={(e) => setText(e.target.value)} className="field font-body text-[0.88rem] leading-6" />
              <div className="flex flex-wrap gap-2">
                <CopyButton text={text} label="Copier le message" onCopied={() => log("copie")} />
                {email && <a href={mailtoLink(email, subject, text)} onClick={() => log("email")} className="btn-outline btn-sm"><Mail className="h-4 w-4" aria-hidden="true" /> Préparer l&apos;e-mail</a>}
                {phone && <a href={whatsappLink(phone, text)} target="_blank" rel="noopener noreferrer" onClick={() => log("whatsapp")} className="btn-outline btn-sm"><MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp</a>}
              </div>
            </div>
          )}
        </>
      )}
      {history.length > 0 && (
        <div className="mt-5 border-t border-line pt-4">
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-ink-muted">Historique des relances</p>
          <ul className="mt-2 space-y-1 text-[0.85rem] text-ink-soft">
            {history.map((h) => <li key={h.id}>{new Date(h.created_at).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })} — {h.channel} ({h.missing_count} pièce{h.missing_count > 1 ? "s" : ""})</li>)}
          </ul>
        </div>
      )}
    </section>
  );
}
