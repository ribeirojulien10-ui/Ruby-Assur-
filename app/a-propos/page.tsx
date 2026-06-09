import type { Metadata } from "next";
import Image from "next/image";
import { BadgeCheck, MapPin, ShieldCheck } from "lucide-react";
import { brand, legalInfo } from "@/lib/site";

export const metadata: Metadata = {
  title: "À propos",
  description: "Découvrez Ruby Assur', courtier en assurances indépendant dans l'Aisne. ORIAS 24007878.",
};

export default function AboutPage() {
  return (
    <>
      {/* Présentation — blanc */}
      <section className="bg-white py-16">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-ruby-line bg-ruby-frost">
            <Image
              src="/images/hero-ruby-assur.png"
              alt="Espace de conseil Ruby Assur'"
              fill
              className="object-cover object-[55%_45%]"
              sizes="(max-width: 1024px) 100vw, 480px"
              priority
            />
          </div>
          <div>
            <p className="eyebrow">À propos</p>
            <h1 className="mt-3 text-4xl font-semibold text-ruby-navy sm:text-5xl">
              {brand}, le courtage avec proximité et pédagogie
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-700">
              Ruby Assur' est une société de courtage et d'intermédiation en assurances indépendante, dans l'Aisne. L'objectif est
              simple : vous aider à comprendre vos besoins, poser les bonnes questions et avancer avec un conseil clair et personnalisé.
            </p>
          </div>
        </div>
      </section>

      {/* 3 valeurs — navy */}
      <section className="bg-navy py-16 text-white">
        <div className="section-shell grid gap-5 md:grid-cols-3">
          <article className="rounded-2xl border border-white/15 bg-white/8 p-6 backdrop-blur-sm">
            <MapPin className="h-6 w-6 text-gold" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-semibold">Ancrage local</h2>
            <p className="mt-3 text-sm leading-7 text-white/70">
              Un courtier ancré dans l'Aisne, qui accompagne particuliers et professionnels partout en France.
            </p>
          </article>
          <article className="rounded-2xl border border-white/15 bg-white/8 p-6 backdrop-blur-sm">
            <BadgeCheck className="h-6 w-6 text-gold" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-semibold">Conseil indépendant</h2>
            <p className="mt-3 text-sm leading-7 text-white/70">
              Une approche centrée sur l'analyse de votre situation avant toute orientation.
            </p>
          </article>
          <article className="rounded-2xl border border-white/15 bg-white/8 p-6 backdrop-blur-sm">
            <ShieldCheck className="h-6 w-6 text-gold" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-semibold">Cadre professionnel</h2>
            <p className="mt-3 text-sm leading-7 text-white/70">
              Courtier en assurance inscrit à l'ORIAS sous le numéro {legalInfo.orias}.
            </p>
          </article>
        </div>
      </section>

      {/* Infos entreprise — blanc */}
      <section className="bg-white py-16">
        <div className="section-shell max-w-4xl">
          <p className="eyebrow">Informations de l'entreprise</p>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              ["Nom", legalInfo.name],
              ["Forme juridique", legalInfo.legalForm],
              ["RCS", legalInfo.rcs],
              ["SIREN", legalInfo.siren],
              ["SIRET", legalInfo.siret],
              ["ORIAS", legalInfo.orias],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-off-gray bg-off-white p-4">
                <dt className="text-sm font-semibold text-navy">{label}</dt>
                <dd className="mt-1 text-sm text-slate-700">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
