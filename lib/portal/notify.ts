import { Resend } from "resend";
import { iso, type PortalContext } from "./context";
import { all, run } from "./db";

/**
 * Notifications pour Julien (jamais pour les clients). Contenu volontairement MINIMAL :
 *  - aucun nom de client, aucune pièce jointe, aucun lien d'accès direct à un document ;
 *  - seulement « un dossier est prêt » + l'adresse de l'espace pro (où il faut s'identifier).
 *
 * DÉSACTIVÉ par défaut : rien n'est envoyé tant que PORTAL_NOTIFY_ENABLED n'est pas "true".
 * En développement, les notifications restent dans la table `outbox` (visible dans l'espace pro).
 */
export type Sender = (msg: { to: string; subject: string; text: string }) => Promise<void>;

const resendSender: Sender = async ({ to, subject, text }) => {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY absent");
  const { error } = await new Resend(key).emails.send({
    from: "Ruby Assur' <contact@rubyassur.fr>",
    to,
    subject,
    text,
  });
  if (error) throw new Error(error.message);
};

export async function deliverOutbox(ctx: PortalContext, send: Sender = resendSender): Promise<{ sent: number; skipped: boolean }> {
  if (process.env.PORTAL_NOTIFY_ENABLED !== "true") return { sent: 0, skipped: true };
  const to = process.env.PORTAL_NOTIFY_TO;
  if (!to) return { sent: 0, skipped: true };
  const pending = all<{ id: string; kind: string; request_ref: string }>(
    ctx.db,
    "SELECT id, kind, request_ref FROM outbox WHERE sent_at IS NULL AND error IS NULL ORDER BY created_at",
  );
  let sent = 0;
  for (const n of pending) {
    try {
      await send({
        to,
        subject: "Ruby Assur' — un dossier est prêt à être examiné",
        text: `Un dossier est prêt à être examiné.\n\nOuvrez votre espace professionnel (connexion requise) :\n${ctx.baseUrl.replace(/\/$/, "")}/espace-pro/dossiers/${n.request_ref}\n`,
      });
      run(ctx.db, "UPDATE outbox SET sent_at = ? WHERE id = ?", iso(ctx), n.id);
      sent++;
    } catch (e) {
      run(ctx.db, "UPDATE outbox SET error = ? WHERE id = ?", String((e as Error).message).slice(0, 200), n.id);
    }
  }
  return { sent, skipped: false };
}
