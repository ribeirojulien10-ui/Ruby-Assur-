import type { Metadata } from "next";
import { BadgeCheck, MapPin, Phone, ShieldCheck, Mail } from "lucide-react";
import Image from "next/image";
import { CtaBand } from "@/components/CtaBand";
import { legalInfo } from "@/lib/site";

export const metadata: Metadata = {
  title: "À propos",
  description: "Découvrez Ruby Assur', courtier en assurances indépendant dans l'Aisne. ORIAS 24007878.",
  alternates: { canonical: "/a-propos" },
};

const phone = process.env.NEXT_PUBLIC_PHONE ?? "0671551931";
const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@rubyassur.fr";
const fmtPhone = (p: string) => p.replace(/(\d{2})(?=\d)/g, "$1 ").trim();

const values = [
  { icon: MapPin, title: "Ancrage local", text: "Un courtier ancré dans l'Aisne, qui accompagne particuliers et professionnels partout en France." },
  { icon: BadgeCheck, title: "Conseil indépendant", text: "Une approche centrée sur l'analyse de votre situation avant toute orientation." },
  { icon: ShieldCheck, title: "Cadre professionnel", text: `Courtier en assurance inscrit à l'ORIAS sous le numéro ${legalInfo.orias}.` },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ivory">
        <div className="mx-auto grid w-full max-w-page items-center gap-12 px-gutter pb-16 pt-12 lg:grid-cols-12 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-7">
            <p className="eyebrow">À propos</p>
            <h1 className="display mt-5 text-display-lg text-night">
              Ruby Assur&apos;, le courtage avec <em>proximité</em> et pédagogie.
            </h1>
            <p className="mt-6 max-w-xl text-lead text-ink-soft">
              Ruby Assur&apos; est une société de courtage et d&apos;intermédiation en assurances indépendante, dans l&apos;Aisne. L&apos;objectif est
              simple : vous aider à comprendre vos besoins, poser les bonnes questions et avancer avec un conseil clair et personnalisé.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-2xl bg-night shadow-lift">
              <Image src="/images/hero-ruby-assur.png" alt="Espace de conseil Ruby Assur'" fill priority sizes="(max-width: 1024px) 90vw, 36vw" className="object-cover object-[64%_30%]" />
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="mx-auto w-full max-w-page px-gutter">
          <ul className="grid gap-x-10 md:grid-cols-3">
            {values.map(({ icon: Icon, title, text }) => (
              <li key={title} className="reveal border-t border-night/15 py-8">
                <Icon className="h-6 w-6 text-champagne-deep" aria-hidden="true" />
                <h2 className="display mt-5 text-display-sm text-night">{title}</h2>
                <p className="mt-3 text-[1rem] leading-7 text-ink-muted">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="on-dark section bg-night text-white">
        <div className="mx-auto grid w-full max-w-page gap-12 px-gutter lg:grid-cols-12">
          <div className="reveal lg:col-span-4">
            <p className="eyebrow">Informations de l&apos;entreprise</p>
            <h2 className="display mt-4 text-display-md text-white">Transparence <em>et cadre légal</em>.</h2>
          </div>
          <dl className="reveal grid gap-x-10 sm:grid-cols-2 lg:col-span-8">
            {[
              ["Nom", legalInfo.name],
              ["Forme juridique", legalInfo.legalForm],
              ["RCS", legalInfo.rcs],
              ["SIREN", legalInfo.siren],
              ["SIRET", legalInfo.siret],
              ["ORIAS", legalInfo.orias],
            ].map(([label, value]) => (
              <div key={label} className="border-t border-white/15 py-5">
                <dt className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-champagne">{label}</dt>
                <dd className="mt-1 text-[1.05rem] text-white/85">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="mx-auto grid w-full max-w-page gap-10 px-gutter lg:grid-cols-12">
          <div className="reveal lg:col-span-5">
            <p className="eyebrow">Nous contacter</p>
            <h2 className="display mt-4 text-display-md text-night">On est <em>joignables</em>.</h2>
            <p className="mt-5 max-w-md text-[1rem] leading-7 text-ink-muted">Par téléphone, email ou formulaire — Ruby Assur&apos; vous répond en moins de 24h.</p>
          </div>
          <div className="reveal grid gap-4 sm:grid-cols-2 lg:col-span-7">
            <a href={`tel:${phone}`} className="group flex items-center gap-4 rounded-lg bg-ivory p-5 transition hover:bg-ivory-deep">
              <Phone className="h-5 w-5 text-champagne-deep" aria-hidden="true" />
              <span className="font-semibold text-night">{fmtPhone(phone)}</span>
            </a>
            <a href={`mailto:${email}`} className="group flex items-center gap-4 rounded-lg bg-ivory p-5 transition hover:bg-ivory-deep">
              <Mail className="h-5 w-5 text-champagne-deep" aria-hidden="true" />
              <span className="break-all font-semibold text-night">{email}</span>
            </a>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
