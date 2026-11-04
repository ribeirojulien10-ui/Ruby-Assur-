import Link from "next/link";
import { LogOut, Plus } from "lucide-react";
import { logoutAction } from "@/app/espace-pro/actions";
import { Logo } from "@/components/Logo";

const nav = [
  { href: "/espace-pro", label: "Tableau de bord" },
  { href: "/espace-pro/dossiers", label: "Dossiers" },
  { href: "/espace-pro/modeles", label: "Modèles" },
];

export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-40 border-b border-line bg-paper/92 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-page flex-wrap items-center justify-between gap-x-6 gap-y-2 px-gutter py-3">
          <div className="flex items-center gap-4">
            <Link href="/espace-pro" aria-label="Espace professionnel — accueil"><Logo /></Link>
            <span className="hidden rounded-full bg-night px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-champagne sm:inline">Espace pro</span>
          </div>
          <nav aria-label="Espace professionnel" className="order-3 -mx-1 flex w-full items-center gap-1 overflow-x-auto md:order-none md:w-auto">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="whitespace-nowrap rounded-full px-4 py-2 text-[0.92rem] font-medium text-ink-soft transition hover:bg-night/5 hover:text-night">
                {n.label}
              </Link>
            ))}
            <Link href="/espace-pro/dossiers/nouveau" className="btn-primary btn-sm ml-2 whitespace-nowrap">
              <Plus className="h-4 w-4" aria-hidden="true" /> Nouvelle demande
            </Link>
          </nav>
          <form action={logoutAction} className="flex items-center gap-3">
            <span className="hidden text-[0.82rem] text-ink-muted lg:inline">{email}</span>
            <button className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[0.88rem] font-medium text-ink-soft transition hover:bg-night/5 hover:text-night">
              <LogOut className="h-4 w-4" aria-hidden="true" /> Déconnexion
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto w-full max-w-page px-gutter py-8 sm:py-10">{children}</main>
    </div>
  );
}
