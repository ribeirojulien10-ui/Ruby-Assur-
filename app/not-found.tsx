import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="bg-navy py-24 text-white">
      <div className="container-shell text-center">
        <p className="eyebrow">Erreur 404</p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
          Cette page n&apos;existe pas
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/75">
          Pas d&apos;inquiétude : le lien est peut-être ancien ou mal saisi. Revenez à l&apos;accueil
          ou demandez directement votre devis gratuit, Ruby Assur&apos; vous répond sous 24h.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-gold">
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-navy"
          >
            Demander un devis
          </Link>
        </div>
      </div>
    </section>
  );
}
