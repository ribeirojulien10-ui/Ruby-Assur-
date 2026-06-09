import type { Metadata } from "next";
import Image from "next/image";
import { BadgeCheck, MapPin, ShieldCheck, Phone, Mail } from "lucide-react";
import { brand, legalInfo } from "@/lib/site";

export const metadata: Metadata = {
  title: "À propos",
  description: "Découvrez Ruby Assur', courtier en assurances indépendant dans l'Aisne. ORIAS 24007878.",
};

const phone = process.env.NEXT_PUBLIC_PHONE ?? "0671551931";
const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "ruby.assur@gmail.com";

export default function AboutPage() {
  return (
    <>
      {/* 1 — bleu */}
      <section className="bg-navy py-16 text-white">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/15">
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
            <p className="eyebrow text-gold">À propos</p>
            <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">
              {brand}, le courtage avec proximité et pédagogie
            </h1>
            <p className="mt-5 text-lg leading-8 text-white/75">
              Ruby Assur' est une société de courtage et d'intermédiation en assurances indépendante, dans l'Aisne. L'objectif est
              simple : vous aider à comprendre vos besoins, poser les bonnes questions et avancer avec un conseil clair et personnalisé.
            </p>
          </div>
        </div>
      </section>

      {/* 2 — blanc */}
      <section className="bg-white py-16">
        <div className="section-shell grid gap-5 md:grid-cols-3">
          <article className="rounded-2xl border border-off-gray bg-off-white p-6">
            <MapPin className="h-6 w-6 text-gold" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-semibold text-navy">Ancrage local</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Un courtier ancré dans l'Aisne, qui accompagne particuliers et professionnels partout en France.
            </p>
          </article>
          <article className="rounded-2xl border border-off-gray bg-off-white p-6">
            <BadgeCheck className="h-6 w-6 text-gold" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-semibold text-navy">Conseil indépendant</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Une approche centrée sur l'analyse de votre situation avant toute orientation.
            </p>
          </article>
          <article className="rounded-2xl border border-off-gray bg-off-white p-6">
            <ShieldCheck className="h-6 w-6 text-gold" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-semibold text-navy">Cadre professionnel</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Courtier en assurance inscrit à l'ORIAS sous le numéro {legalInfo.orias}.
            </p>
          </article>
        </div>
      </section>

      {/* 3 — bleu */}
      <section className="bg-navy py-16 text-white">
        <div className="section-shell max-w-4xl">
          <p className="eyebrow text-gold">Informations de l'entreprise</p>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              ["Nom", legalInfo.name],
              ["Forme juridique", legalInfo.legalForm],
              ["RCS", legalInfo.rcs],
              ["SIREN", legalInfo.siren],
              ["SIRET", legalInfo.siret],
              ["ORIAS", legalInfo.orias],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-white/15 bg-white/8 p-4">
                <dt className="text-sm font-semibold text-gold">{label}</dt>
                <dd className="mt-1 text-sm text-white/80">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 4 — blanc */}
      <section className="bg-white py-16">
        <div className="section-shell max-w-2xl">
          <p className="eyebrow">Nous contacter</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-navy">On est joignables</h2>
          <p className="mt-4 text-slate-600">Par téléphone, email ou formulaire — Ruby Assur' vous répond en moins de 24h.</p>
          <div className="mt-8 space-y-4">
            <a href={`tel:${phone}`} className="flex items-center gap-3 rounded-xl border border-off-gray bg-off-white p-4 text-sm font-medium text-navy hover:border-gold/40 transition">
              <Phone className="h-5 w-5 text-gold" />
              {phone.replace(/(\d{2})(?=\d)/g, "$1 ").trim()}
            </a>
            <a href={`mailto:${email}`} className="flex items-center gap-3 rounded-xl border border-off-gray bg-off-white p-4 text-sm font-medium text-navy hover:border-gold/40 transition">
              <Mail className="h-5 w-5 text-gold" />
              {email}
            </a>
          </div>
        </div>
      </section>

    </>
  );
}
