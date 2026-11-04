import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ClipboardCheck, MailCheck, MessageSquareWarning } from "lucide-react";
import { legalInfo } from "@/lib/site";

const phone = process.env.NEXT_PUBLIC_PHONE ?? "0671551931";
const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@rubyassur.fr";

export const metadata: Metadata = {
  title: "Réclamations",
  description: "Informations sur le traitement des réclamations pour Ruby Assur’, courtier en assurance indépendant.",
  alternates: { canonical: "/reclamations" },
};

export default function ClaimsPage() {
  return (
    <section className="bg-white py-16">
      <div className="section-shell max-w-5xl">
        <p className="eyebrow">Réclamations</p>
        <h1 className="mt-3 text-4xl font-semibold text-ruby-navy sm:text-5xl">Une démarche claire en cas d’insatisfaction</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-700">
          Si vous souhaitez formuler une réclamation, précisez votre identité, vos coordonnées, l’objet de
          votre demande et les éléments utiles à sa compréhension. Les délais de référence applicables aux courtiers
          en assurance sont rappelés ci-dessous.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <article className="rounded-lg border border-ruby-line bg-ruby-frost p-6">
            <MessageSquareWarning className="h-6 w-6 text-ruby-gold" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-semibold text-ruby-navy">1. Exposer la situation</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Décrivez les faits, le contrat concerné le cas échéant et la réponse attendue.
            </p>
          </article>
          <article className="rounded-lg border border-ruby-line bg-ruby-frost p-6">
            <ClipboardCheck className="h-6 w-6 text-ruby-gold" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-semibold text-ruby-navy">2. Joindre les éléments utiles</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Ajoutez les références, courriers ou documents permettant d’étudier votre demande.
            </p>
          </article>
          <article className="rounded-lg border border-ruby-line bg-ruby-frost p-6">
            <MailCheck className="h-6 w-6 text-ruby-gold" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-semibold text-ruby-navy">3. Suivi de la demande</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Ruby Assur’ pourra revenir vers vous après analyse des éléments communiqués.
            </p>
          </article>
        </div>

        {/* Délais issus de la recommandation ACPR 2024-R-02 (intermédiaires d'assurance).
            TODO propriétaire : ajouter ici le médiateur compétent et ses modalités de saisine
            (information exigée par la même recommandation, points 3.2.1 à 3.2.3) — à NE PAS inventer. */}
        <div className="mt-10 rounded-lg border border-ruby-line bg-ruby-frost p-6">
          <h2 className="text-xl font-semibold text-ruby-navy">Délais de référence</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700">
            <li>
              <strong>Accusé de réception</strong> : par écrit, dans un délai maximal de 10 jours ouvrables à compter de
              l’envoi de votre réclamation écrite, sauf si une réponse écrite vous est apportée dans ce délai.
            </li>
            <li>
              <strong>Réponse</strong> : au plus tard sous 2 mois, sauf dispositions législatives ou réglementaires
              plus contraignantes.
            </li>
          </ul>
          <p className="mt-3 text-xs leading-6 text-slate-500">
            Source : recommandation de l’ACPR n° 2024-R-02 du 2 juillet 2024 sur le traitement des réclamations,
            applicable notamment aux intermédiaires d’assurance.
          </p>
        </div>

        <div className="mt-6 rounded-lg border border-ruby-line bg-ruby-sand p-6">
          <h2 className="text-xl font-semibold text-ruby-navy">Coordonnées</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            {legalInfo.name} — par e-mail : <a href={`mailto:${email}`} className="font-semibold text-ruby-navy underline">{email}</a> ou par téléphone : <a href={`tel:${phone}`} className="font-semibold text-ruby-navy underline">{phone.replace(/(\d{2})(?=\d)/g, "$1 ")}</a>
          </p>
          <Link
            href="/contact"
            className="focus-ring mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-ruby-navy px-5 text-sm font-semibold text-white hover:bg-ruby-ink"
          >
            Utiliser le formulaire
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
