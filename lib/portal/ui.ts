import { STATUS_LABEL, ITEM_STATE_LABEL } from "./rules";
import type { ItemState, RequestStatus } from "./types";

export const fmtDate = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) : "—";
export const fmtDateTime = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—";
export const fmtBytes = (n: number) => (n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} Ko` : `${(n / 1024 / 1024).toFixed(1).replace(".", ",")} Mo`);

export const EVENT_LABEL: Record<string, string> = {
  request_created: "Demande créée",
  link_generated: "Lien sécurisé généré",
  link_regenerated: "Lien régénéré (l'ancien est désactivé)",
  link_revoked: "Lien révoqué",
  link_extended: "Validité du lien prolongée",
  file_uploaded: "Document déposé par le client",
  file_replaced: "Document remplacé par le client",
  file_deleted: "Document retiré par le client",
  item_validated: "Document validé",
  item_to_replace: "Remplacement demandé",
  request_complete: "Pièces demandées reçues",
  info_saved: "Informations complétées par le client",
  request_submitted: "Envoi confirmé par le client — dossier à examiner",
  reminder_logged: "Relance préparée",
  request_closed: "Dossier clôturé",
  request_reopened: "Dossier rouvert",
  item_added: "Pièce ajoutée à la demande",
  item_removed: "Pièce retirée de la demande",
  answers_saved: "Réponses du client enregistrées",
  file_downloaded: "Document consulté",
};

export const ACTOR_LABEL: Record<string, string> = { julien: "Vous", client: "Client", system: "Système" };

export const STATUS_TONE: Record<RequestStatus, "danger" | "info" | "warn" | "ok" | "neutral"> = {
  incomplete: "warn",
  complete: "info",
  to_review: "info",
  validated: "ok",
  closed: "neutral",
};
export const ITEM_TONE: Record<ItemState, "danger" | "info" | "warn" | "ok" | "neutral"> = {
  to_provide: "neutral",
  received: "info",
  to_replace: "danger",
  validated: "ok",
};
export { STATUS_LABEL, ITEM_STATE_LABEL };
