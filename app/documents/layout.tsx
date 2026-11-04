import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Lock } from "lucide-react";
import { Logo } from "@/components/Logo";
import { portalEnabled } from "@/lib/portal/config";

// Page privée : jamais indexée, aucun suivi publicitaire, le lien n'est pas transmis dans l'en-tête Referer.
export const metadata: Metadata = {
  title: { default: "Vos documents", template: "%s | Ruby Assur'" },
  robots: { index: false, follow: false, nocache: true },
  referrer: "no-referrer",
};
export const dynamic = "force-dynamic";

const phone = process.env.NEXT_PUBLIC_PHONE ?? "0671551931";
const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@rubyassur.fr";
const fmtPhone = (p: string) => p.replace(/(\d{2})(?=\d)/g, "$1 ").trim();

export default function DocumentsLayout({ children }: { children: React.ReactNode }) {
  if (!portalEnabled()) notFound();
  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-gutter py-4">
          <Logo />
          <span className="inline-flex items-center gap-1.5 text-[0.8rem] font-medium text-ink-muted">
            <Lock className="h-3.5 w-3.5 text-champagne-deep" aria-hidden="true" /> Espace sécurisé
          </span>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-gutter py-8 sm:py-12">{children}</main>
      <footer className="border-t border-line bg-paper">
        <div className="mx-auto w-full max-w-3xl space-y-2 px-gutter py-6 text-[0.82rem] leading-6 text-ink-muted">
          <p>
            Vos documents servent uniquement à étudier votre demande d&apos;assurance. Ils sont transmis via une connexion sécurisée et ne sont pas accessibles publiquement.
          </p>
          <p>
            Une question ? Ruby Assur&apos; — <a className="font-semibold text-night underline" href={`tel:${phone}`}>{fmtPhone(phone)}</a> · <a className="font-semibold text-night underline" href={`mailto:${email}`}>{email}</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
