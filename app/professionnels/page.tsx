import type { Metadata } from "next";
import Link from "next/link";
import { getProductsByAudience } from "@/lib/products";
import { CheckCircle, Clock, PhoneCall, ShieldCheck, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Assurances Professionnels",
  description: "Ruby Assur' accompagne les professionnels : RC Pro, décennale, flotte VTC, multirisque pro, création d'entreprise. Devis gratuit.",
};

const products = getProductsByAudience("pro");

export default function ProfessionnelsPage() {
  return (
    <>
      {/* 1 — navy */}
      <section className="bg-navy py-20 text-white">
        <div className="container-shell">
          <p className="eyebrow text-gold">Professionnels</p>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Vos assurances professionnelles</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/75">
            RC Pro, décennale, flotte, multirisque : Ruby Assur' vous aide à protéger votre activité avec les bonnes garanties, aux meilleurs tarifs.
          </p>
        </div>
      </section>

      {/* 2 — blanc */}
      <section className="section bg-white">
        <div className="container-shell">
          <div className="grid gap-6 sm:grid-cols-2">
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

      {/* 3 — navy : avantages */}
      <section className="section bg-navy text-white">
        <div className="container-shell">
          <p className="eyebrow text-gold">Pourquoi Ruby Assur' ?</p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Un courtier qui connaît les besoins des pros</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: ShieldCheck, title: "Indépendant", desc: "Aucune compagnie imposée. On compare librement le marché pour vous." },
              { icon: Clock, title: "Réactif", desc: "Retour sous 24h. Pas de délai administratif inutile." },
              { icon: Users, title: "Dédié pro", desc: "Connaissance des spécificités des contrats professionnels." },
              { icon: PhoneCall, title: "Gratuit", desc: "Le courtier est rémunéré par les assureurs, pas par vous." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-white/15 bg-white/8 p-6">
                <Icon className="h-6 w-6 text-gold" />
                <p className="mt-4 font-semibold">{title}</p>
                <p className="mt-2 text-sm text-white/70">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — navy : CTA */}
      <section className="section bg-navy text-white text-center border-t border-white/10">
        <div className="container-shell">
          <p className="eyebrow text-gold">Devis gratuit</p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Besoin d'un conseil sur mesure ?</h2>
          <p className="mt-4 text-white/70">Activité, effectif, véhicules : chaque situation est différente. Ruby Assur' analyse et compare pour vous.</p>
          <Link href="/contact" className="btn-gold mt-8 inline-block">Demander un devis gratuit</Link>
        </div>
      </section>
    </>
  );
}
