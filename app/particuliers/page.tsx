import type { Metadata } from "next";
import Link from "next/link";
import { getProductsByAudience } from "@/lib/products";
import { CheckCircle, Clock, PhoneCall, ShieldCheck, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Assurances Particuliers",
  description: "Ruby Assur' vous accompagne pour toutes vos assurances particuliers : auto, habitation, mutuelle santé, assurance emprunteur. Devis gratuit.",
};

const products = getProductsByAudience("particulier");

export default function ParticuliersPage() {
  return (
    <>
      {/* 1 — navy */}
      <section className="bg-navy py-20 text-white">
        <div className="container-shell">
          <p className="eyebrow text-gold">Particuliers</p>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Vos assurances personnelles</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/75">
            Auto, moto, habitation, santé, animaux, emprunteur… Tous profils acceptés, même les situations complexes. Ruby Assur' compare et trouve la solution adaptée.
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

      {/* 3 — navy : pourquoi passer par Ruby Assur' */}
      <section className="section bg-navy text-white">
        <div className="container-shell">
          <p className="eyebrow text-gold">Pourquoi Ruby Assur' ?</p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Un courtier à votre service, pas à celui des assureurs</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: ShieldCheck, title: "Indépendant", desc: "Aucune compagnie imposée. On compare librement pour vous." },
              { icon: Clock, title: "Rapide", desc: "Retour sous 24h après réception de votre demande." },
              { icon: Users, title: "Humain", desc: "Un vrai interlocuteur joignable, pas un formulaire sans suite." },
              { icon: PhoneCall, title: "Gratuit", desc: "Le recours à un courtier ne vous coûte rien." },
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

      {/* 4 — blanc : CTA */}
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
