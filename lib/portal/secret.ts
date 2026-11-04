import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

/**
 * Chiffrement (AES-256-GCM) des jetons de lien conservés pour permettre à Julien de les COPIER à nouveau.
 * La base ne contient jamais un lien utilisable en clair : seule la session administrateur peut le déchiffrer.
 * La clé vient de PORTAL_LINK_KEY (ou à défaut de BETTER_AUTH_SECRET) ; elle n'est jamais dans le code.
 */
function key(): Buffer {
  const secret = process.env.PORTAL_LINK_KEY ?? process.env.BETTER_AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("PORTAL_LINK_KEY (ou BETTER_AUTH_SECRET) manquant ou trop court (32 caractères minimum).");
  }
  return createHash("sha256").update(secret).digest();
}

export function encryptToken(token: string): string {
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", key(), iv);
  const enc = Buffer.concat([c.update(token, "utf8"), c.final()]);
  return [iv, c.getAuthTag(), enc].map((b) => b.toString("base64url")).join(".");
}

export function decryptToken(blob: string): string | null {
  try {
    const [iv, tag, enc] = blob.split(".").map((p) => Buffer.from(p, "base64url"));
    const d = createDecipheriv("aes-256-gcm", key(), iv);
    d.setAuthTag(tag);
    return Buffer.concat([d.update(enc), d.final()]).toString("utf8");
  } catch {
    return null;
  }
}
