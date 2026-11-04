import path from "node:path";
import { DEFAULT_LINK_TTL_DAYS, LINK_TTL_CHOICES } from "./constants";

export { ALL_FORMATS, DEFAULT_FORMATS, REJECT_REASONS, type FileFormat, type RejectReason } from "./constants";

/**
 * Configuration du portail documentaire.
 *
 * Le portail est DÉSACTIVÉ par défaut : tant que PORTAL_ENABLED n'est pas "true",
 * toutes ses routes répondent 404. Le reste du site n'en dépend jamais.
 */
export const portalEnabled = (): boolean => process.env.PORTAL_ENABLED === "true";

/** Dossier de données locales (base SQLite + fichiers). Hors de /public, ignoré par Git. */
export const dataDir = (): string => process.env.PORTAL_DATA_DIR ?? path.join(process.cwd(), ".data");

const mb = (n: number) => n * 1024 * 1024;

export const LIMITS = {
  /** Taille maximale d'un fichier (configurable). Le téléversement direct n'est pas limité par les 4,5 Mo de Vercel. */
  maxFileBytes: mb(Number(process.env.PORTAL_MAX_FILE_MB ?? 15)),
  /** Nombre maximal de fichiers par pièce demandée (ex. recto + verso). */
  maxFilesPerItem: 4,
  /** Taille cumulée maximale des fichiers d'un dossier. */
  maxRequestBytes: mb(Number(process.env.PORTAL_MAX_REQUEST_MB ?? 100)),
  /** Durée de validité d'une autorisation de téléversement. */
  uploadIntentTtlMs: 15 * 60 * 1000,
  /** Durée de validité par défaut d'un lien client (à valider par Julien). */
  defaultLinkTtlDays: DEFAULT_LINK_TTL_DAYS,
  /** Durées proposées dans l'interface. */
  linkTtlChoices: LINK_TTL_CHOICES,
} as const;
