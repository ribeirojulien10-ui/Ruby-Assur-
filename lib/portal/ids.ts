import { createHash, randomBytes, randomUUID } from "node:crypto";

export const newId = (): string => randomUUID();

/** Jeton de lien : 256 bits d'entropie, encodé en base64url (43 caractères). Impossible à deviner. */
export const newToken = (): string => randomBytes(32).toString("base64url");

/** On ne stocke JAMAIS le jeton en clair : seulement son empreinte SHA-256. */
export const hashToken = (token: string): string => createHash("sha256").update(token).digest("hex");

export const looksLikeToken = (t: string): boolean => /^[A-Za-z0-9_-]{43}$/.test(t);

/** Nettoie un nom de fichier fourni par le client (pas de chemin, pas de caractères de contrôle). */
export function safeFileName(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? "document";
  const cleaned = base
    .normalize("NFKC")
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f\u007f<>:"|?*]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
  return cleaned || "document";
}

export const extOf = (name: string): string => (name.split(".").pop() ?? "").toLowerCase();
