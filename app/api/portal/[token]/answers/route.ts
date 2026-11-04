import { saveAnswers } from "@/lib/portal/client";
import { defaultContext } from "@/lib/portal/context";
import { failure, gate, json, limit } from "@/lib/portal/http";

export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const g = gate();
  if (g) return g;
  const limited = limit(req, "answers", 40);
  if (limited) return limited;
  try {
    const { token } = await params;
    const body = (await req.json().catch(() => null)) as { answers?: Record<string, string> } | null;
    if (!body?.answers || typeof body.answers !== "object") return json({ error: "Demande invalide.", code: "invalid_input" }, 400);
    saveAnswers(defaultContext(), token, body.answers);
    return json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}
