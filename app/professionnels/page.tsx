import type { Metadata } from "next";
import Link from "next/link";
import { getProductsByAudience } from "@/lib/products";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Assurances Professionnels",
  description: "Ruby Assur' accompagne les professionnels : RC Pro, décennale, flotte VTC, multirisque pro, création d'entreprise. Devis gratuit.",
};

const products = getProductsByAudience("pro");

export default function ProfessionnelsPage() {
  return (
    <>
      <section className="bg-navy py-20 text-white">
        <div className="container-shell">
          <p className="eyebrow text-gold">Professionnels</p>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Vos assurances professionnelles</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/75">
            RC Pro, décennale, flotte, multirisque : Ruby Assur' vous aide à protéger votre activité avec les bonnes garanties, aux meilleurs tarifs.
          </p>
        </div>
      </section>
      <section className="section bg-off-white">
        <div className="container-shell">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {products.map((p) => (
              <div key={p.slug} className="card flex flex-col">
                <p className="font-display text-xl font-bold text-navy">{p.name}</p>
                <p className="mt-2 text-sm text-gold font-medium">{p.tagline}</p>
                <ul className="mt-4 space-y-2 flex-1">
                  {p.benefits.slice(0, 3).map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold" />{b}
                    </li>
                  ))}
                </ul>
                <Link href={`/${p.slug}`} className="btn-primary mt-6 w-full text-center">
                  En savoir plus
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
