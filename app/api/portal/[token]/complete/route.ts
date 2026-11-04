import { completeUpload } from "@/lib/portal/client";
import { defaultContext } from "@/lib/portal/context";
import { failure, gate, json, limit } from "@/lib/portal/http";
import { deliverOutbox } from "@/lib/portal/notify";

export const dynamic = "force-dynamic";

/** Étape 3 : contrôle du contenu réel + analyse, puis enregistrement définitif. */
export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const g = gate();
  if (g) return g;
  const limited = limit(req, "complete", 60);
  if (limited) return limited;
  try {
    const { token } = await params;
    const body = (await req.json().catch(() => null)) as { uploadId?: string } | null;
    if (!body || typeof body.uploadId !== "string") return json({ error: "Demande invalide.", code: "invalid_input" }, 400);
    const ctx = defaultContext();
    const result = await completeUpload(ctx, token, body.uploadId);
    // Notification à Julien (désactivée par défaut) : au mieux, sans bloquer ni échouer la réponse.
    if (result.completed) void deliverOutbox(ctx).catch(() => undefined);
    return json({ ok: true, replacement: result.replacement });
  } catch (e) {
    return failure(e);
  }
}
