import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Handshake, ListChecks, MapPinned, MessagesSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Pourquoi choisir Ruby Assur’",
  description:
    "Pourquoi choisir Ruby Assur’ : conseil humain, proximité Pasly Soissons, analyse des besoins et accompagnement personnalisé.",
};

const reasons = [
  {
    title: "Une écoute avant la solution",
    text: "La première étape consiste à comprendre votre situation, vos contraintes et vos priorités.",
    icon: MessagesSquare,
  },
  {
    title: "Un conseil plus lisible",
    text: "Les points importants sont expliqués de manière claire pour vous aider à décider avec davantage de sérénité.",
    icon: ListChecks,
  },
  {
    title: "Une relation de proximité",
    text: "Ruby Assur’ s’appuie sur un ancrage local à Pasly, près de Soissons, pour garder un échange simple et direct.",
    icon: MapPinned,
  },
  {
    title: "Un accompagnement dans la durée",
    text: "Vos besoins peuvent évoluer. L’objectif est de garder un suivi humain, sans promesse automatique ni conseil définitif sans étude.",
    icon: Handshake,
  },
];

export default function WhyPage() {
  return (
    <>
      <section className="bg-ruby-navy py-16 text-white">
        <div className="section-shell max-w-4xl">
          <p className="eyebrow text-ruby-glacier">Pourquoi choisir Ruby Assur’</p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Un courtier pour rendre l’assurance plus compréhensible</h1>
          <p className="mt-5 text-lg leading-8 text-white/80">
            Ruby Assur’ privilégie une approche claire, humaine et personnalisée pour accompagner particuliers et
            professionnels dans leurs démarches d’assurance.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="section-shell grid gap-5 md:grid-cols-2">
          {reasons.map((reason) => {
            const Icon = reason.icon;
            return (
              <article key={reason.title} className="rounded-lg border border-ruby-line bg-ruby-frost p-6">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-white text-ruby-navy">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className="mt-5 text-xl font-semibold text-ruby-navy">{reason.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-700">{reason.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-ruby-sand py-14">
        <div className="section-shell flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-ruby-navy">Vous souhaitez échanger ?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Une demande de rappel permet de poser le cadre de votre besoin avant une étude personnalisée.
            </p>
          </div>
          <Link
            href="/contact"
            className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-md bg-ruby-navy px-5 text-sm font-semibold text-white hover:bg-ruby-ink"
          >
            Contacter Ruby Assur’
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
