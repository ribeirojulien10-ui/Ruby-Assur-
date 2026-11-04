import { submitRequest } from "@/lib/portal/client";
import { defaultContext } from "@/lib/portal/context";
import { failure, gate, json, limit } from "@/lib/portal/http";

export const dynamic = "force-dynamic";

/** Le client confirme son envoi. Cela ne valide aucun document : seul Julien valide la conformité. */
export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const g = gate();
  if (g) return g;
  const limited = limit(req, "submit", 20);
  if (limited) return limited;
  try {
    const { token } = await params;
    const status = submitRequest(defaultContext(), token);
    return json({ ok: true, status });
  } catch (e) {
    return failure(e);
  }
}
