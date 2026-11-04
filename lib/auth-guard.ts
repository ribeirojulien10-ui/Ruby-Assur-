import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { authReady, getAuth } from "@/lib/auth";
import { portalEnabled } from "@/lib/portal/config";
import type { AdminSession } from "@/lib/portal/types";

function allowed(email: string): boolean {
  const list = (process.env.PORTAL_ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  // Sans liste blanche configurée, personne n'est autorisé (refus par défaut).
  return list.length > 0 && list.includes(email.toLowerCase());
}

/** Session administrateur ou null — pour les routes API (réponse 401, pas de redirection). */
export async function getAdminSession(): Promise<AdminSession | null> {
  if (!portalEnabled()) return null;
  await authReady();
  const session = await getAuth().api.getSession({ headers: await headers() });
  if (!session?.user?.email || !allowed(session.user.email)) return null;
  return { userId: session.user.id, email: session.user.email };
}

/** Pour les pages et les actions serveur : redirige vers la connexion si non connecté. */
export async function requireAdmin(): Promise<AdminSession> {
  if (!portalEnabled()) notFound();
  const admin = await getAdminSession();
  if (!admin) redirect("/espace-pro/connexion");
  return admin;
}
