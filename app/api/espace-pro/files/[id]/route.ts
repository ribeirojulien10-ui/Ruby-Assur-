import { getAdminSession } from "@/lib/auth-guard";
import { defaultContext } from "@/lib/portal/context";
import { openFileForAdmin } from "@/lib/portal/admin";
import { failure, gate, json, PRIVATE_HEADERS } from "@/lib/portal/http";

export const dynamic = "force-dynamic";

const MIME: Record<string, string> = {
  pdf: "application/pdf",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  heic: "application/octet-stream",
};
const INLINE_OK = new Set(["pdf", "jpeg", "png", "webp"]);

/**
 * Consultation / téléchargement d'un document : réservé à Julien (session vérifiée côté serveur).
 * Le fichier est diffusé en flux depuis le stockage PRIVÉ ; aucune URL publique n'existe.
 * Aperçu intégré uniquement pour PDF et images, dans un « bac à sable » (CSP) sans script.
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = gate();
  if (g) return g;
  try {
    const admin = await getAdminSession();
    if (!admin) return json({ error: "Authentification requise.", code: "unauthorized" }, 401);
    const { id } = await params;
    const file = await openFileForAdmin(defaultContext(), admin, id);
    const inline = new URL(req.url).searchParams.get("disposition") === "inline" && INLINE_OK.has(file.type);
    const safeName = encodeURIComponent(file.name).replace(/['()]/g, escape);
    return new Response(file.stream, {
      headers: {
        ...PRIVATE_HEADERS,
        "Content-Type": MIME[file.type] ?? "application/octet-stream",
        "Content-Length": String(file.size),
        "Content-Disposition": `${inline ? "inline" : "attachment"}; filename*=UTF-8''${safeName}`,
        "Content-Security-Policy": "sandbox; default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'",
      },
    });
  } catch (e) {
    return failure(e);
  }
}
