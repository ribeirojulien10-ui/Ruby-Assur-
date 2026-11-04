/** Constantes SANS dépendance serveur : utilisables dans les composants affichés dans le navigateur. */

export const LINK_TTL_CHOICES = [7, 14, 30, 60] as const;
/** Durée de validité par défaut d'un lien client (à valider par Julien). */
export const DEFAULT_LINK_TTL_DAYS = 14;

export const REJECT_REASONS = {
  illisible: "Document illisible",
  incomplet: "Document incomplet",
  mauvais_document: "Mauvais document",
  expire: "Document expiré",
  autre: "Autre raison",
} as const;
export type RejectReason = keyof typeof REJECT_REASONS;

/** Formats acceptés (vérifiés sur le contenu réel du fichier, pas seulement l'extension). */
export const ALL_FORMATS = ["pdf", "jpg", "jpeg", "png", "webp", "heic"] as const;
export type FileFormat = (typeof ALL_FORMATS)[number];
export const DEFAULT_FORMATS: FileFormat[] = ["pdf", "jpg", "jpeg", "png", "heic"];
