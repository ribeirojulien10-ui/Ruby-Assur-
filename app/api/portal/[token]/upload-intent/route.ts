import { cleanupExpiredUploads, createUploadIntent } from "@/lib/portal/client";
import { defaultContext } from "@/lib/portal/context";
import { failure, gate, json, limit } from "@/lib/portal/http";

export const dynamic = "force-dynamic";

/** Étape 1 du téléversement : le serveur vérifie tout et délivre une autorisation temporaire à usage unique. */
export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const g = gate();
  if (g) return g;
  const limited = limit(req, "intent", 40);
  if (limited) return limited;
  try {
    const { token } = await params;
    const body = (await req.json().catch(() => null)) as { itemId?: string; fileName?: string; size?: number } | null;
    if (!body || typeof body.itemId !== "string" || typeof body.fileName !== "string" || typeof body.size !== "number")
      return json({ error: "Demande invalide.", code: "invalid_input" }, 400);
    const ctx = defaultContext();
    void cleanupExpiredUploads(ctx);
    const intent = createUploadIntent(ctx, token, { itemId: body.itemId, fileName: body.fileName, size: body.size });
    return json({
      uploadId: intent.uploadId,
      // En production (Supabase), ce serait l'URL signée du stockage privé : le fichier n'ayant pas à transiter par Vercel.
      uploadUrl: `/api/portal/uploads/${intent.uploadToken}`,
      expiresAt: intent.expiresAt,
    });
  } catch (e) {
    return failure(e);
  }
}
