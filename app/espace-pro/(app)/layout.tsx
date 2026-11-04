import { AdminShell } from "@/components/portal/AdminShell";
import { requireAdmin } from "@/lib/auth-guard";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  // Vérification de session côté serveur pour TOUTES les pages de l'espace ; chaque action la revérifie aussi.
  const admin = await requireAdmin();
  return <AdminShell email={admin.email}>{children}</AdminShell>;
}
