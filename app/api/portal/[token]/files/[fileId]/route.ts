import { deleteClientFile } from "@/lib/portal/client";
import { defaultContext } from "@/lib/portal/context";
import { failure, gate, json, limit } from "@/lib/portal/http";

export const dynamic = "force-dynamic";

export async function DELETE(req: Request, { params }: { params: Promise<{ token: string; fileId: string }> }) {
  const g = gate();
  if (g) return g;
  const limited = limit(req, "delete", 40);
  if (limited) return limited;
  try {
    const { token, fileId } = await params;
    await deleteClientFile(defaultContext(), token, fileId);
    return json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}
