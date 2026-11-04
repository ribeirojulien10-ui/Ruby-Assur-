import { defaultContext } from "@/lib/portal/context";
import { receiveUpload } from "@/lib/portal/client";
import { failure, gate, json, limit } from "@/lib/portal/http";

export const dynamic = "force-dynamic";

/**
 * Étape 2 : réception du fichier (corps brut) en QUARANTAINE.
 * Remplace en local l'envoi direct vers un stockage privé (URL signée) prévu en production.
 * La taille est plafonnée à celle déclarée à l'étape 1 : un envoi plus gros est interrompu.
 */
export async function PUT(req: Request, { params }: { params: Promise<{ uploadToken: string }> }) {
  const g = gate();
  if (g) return g;
  const limited = limit(req, "upload", 60);
  if (limited) return limited;
  try {
    const { uploadToken } = await params;
    await receiveUpload(defaultContext(), uploadToken, req.body);
    return json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}
