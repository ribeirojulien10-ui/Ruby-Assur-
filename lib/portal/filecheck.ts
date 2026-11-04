import { extOf } from "./ids";

/**
 * Contrôles sur le CONTENU réel du fichier (signature "magic bytes"), pas seulement sur son nom.
 * Un fichier renommé (ex. un .exe en .pdf) est rejeté.
 */
export type DetectedType = "pdf" | "jpeg" | "png" | "webp" | "heic" | "unknown";

export function detectType(head: Buffer): DetectedType {
  if (head.length >= 5 && head.subarray(0, 5).toString("latin1") === "%PDF-") return "pdf";
  if (head.length >= 3 && head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) return "jpeg";
  if (head.length >= 8 && head.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (head.length >= 12 && head.subarray(0, 4).toString("latin1") === "RIFF" && head.subarray(8, 12).toString("latin1") === "WEBP")
    return "webp";
  if (head.length >= 12 && head.subarray(4, 8).toString("latin1") === "ftyp") {
    const brand = head.subarray(8, 12).toString("latin1");
    if (["heic", "heix", "hevc", "hevx", "mif1", "msf1", "heim", "heis"].includes(brand)) return "heic";
  }
  return "unknown";
}

const EXT_TO_TYPE: Record<string, DetectedType> = {
  pdf: "pdf",
  jpg: "jpeg",
  jpeg: "jpeg",
  png: "png",
  webp: "webp",
  heic: "heic",
};

/** Le type réel détecté doit correspondre à l'extension annoncée. */
export function extensionMatches(fileName: string, detected: DetectedType): boolean {
  const expected = EXT_TO_TYPE[extOf(fileName)];
  return !!expected && expected === detected;
}

export interface ScanResult {
  status: "clean" | "infected" | "error";
  reason?: string;
}

const EICAR = "X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*";

/**
 * ⚠️ Analyse BASIQUE locale (démonstration) : exécutables déguisés, chaîne de test EICAR,
 * PDF contenant des actions de lancement. Ce n'est PAS un antivirus.
 * En production, brancher un vrai moteur antimalware (ex. ClamAV) avant de passer le fichier à "clean".
 */
export function basicScan(content: Buffer): ScanResult {
  const head = content.subarray(0, 4);
  if (head.subarray(0, 2).toString("latin1") === "MZ") return { status: "infected", reason: "exécutable Windows" };
  if (head.equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46]))) return { status: "infected", reason: "exécutable Linux" };
  if (head.subarray(0, 2).toString("latin1") === "#!") return { status: "infected", reason: "script" };
  const text = content.toString("latin1");
  if (text.includes(EICAR)) return { status: "infected", reason: "signature de test antivirus" };
  if (/\/Launch\b|\/JavaScript\b|\/JS\b/.test(text) && text.startsWith("%PDF-"))
    return { status: "infected", reason: "PDF contenant des actions actives" };
  return { status: "clean" };
}
