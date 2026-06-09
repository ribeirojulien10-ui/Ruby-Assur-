import type { Metadata } from "next";
import Link from "next/link";
import { getProductsByAudience } from "@/lib/products";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Assurances Particuliers",
  description: "Ruby Assur' vous accompagne pour toutes vos assurances particuliers : auto, habitation, mutuelle santé, assurance emprunteur. Devis gratuit.",
};

const products = getProductsByAudience("particulier");

export default function ParticuliersPage() {
  return (
    <>
      <section className="bg-white py-20">
        <div className="container-shell">
          <p className="eyebrow">Particuliers</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-navy sm:text-5xl">Vos assurances personnelles</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            Auto, habitation, santé, emprunteur : Ruby Assur' compare les offres du marché pour vous proposer la couverture la plus adaptée à votre situation.
          </p>
        </div>
      </section>
      <section className="section bg-navy text-white">
        <div className="container-shell">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {products.map((p) => (
              <div key={p.slug} className="flex flex-col rounded-2xl border border-white/15 bg-white/8 p-6 backdrop-blur-sm">
                <p className="font-display text-xl font-bold text-white">{p.name}</p>
                <p className="mt-2 text-sm text-gold font-medium">{p.tagline}</p>
                <ul className="mt-4 space-y-2 flex-1">
                  {p.benefits.slice(0, 3).map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-white/75">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold" />{b}
                    </li>
                  ))}
                </ul>
                <Link href={`/${p.slug}`} className="mt-6 w-full text-center inline-flex items-center justify-center rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                  En savoir plus
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section bg-white text-center">
        <div className="container-shell">
          <p className="eyebrow">Devis gratuit</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-navy sm:text-4xl">Pas sûr de ce qu'il vous faut ?</h2>
          <p className="mt-4 text-slate-600">Décrivez votre situation en quelques lignes, Ruby Assur' vous oriente.</p>
          <Link href="/contact" className="btn-primary mt-8 inline-block">Demander un devis gratuit</Link>
        </div>
      </section>
    </>
  );
}
