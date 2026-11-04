import { saveInfo } from "@/lib/portal/client";
import { defaultContext } from "@/lib/portal/context";
import { failure, gate, json, limit } from "@/lib/portal/http";

export const dynamic = "force-dynamic";

/** Enregistre les informations saisies par le client (seuls les champs définis par le modèle sont acceptés). */
export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const g = gate();
  if (g) return g;
  const limited = limit(req, "info", 60);
  if (limited) return limited;
  try {
    const { token } = await params;
    const body = (await req.json().catch(() => null)) as { values?: Record<string, unknown> } | null;
    if (!body?.values || typeof body.values !== "object") return json({ error: "Demande invalide.", code: "invalid_input" }, 400);
    saveInfo(defaultContext(), token, body.values);
    return json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}
