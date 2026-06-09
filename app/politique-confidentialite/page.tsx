import type { Metadata } from "next";
import { legalInfo } from "@/lib/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité de Ruby Assur’ pour la version locale du site vitrine.",
};

export default function PrivacyPage() {
  return (
    <section className="bg-white py-16">
      <div className="section-shell max-w-4xl">
        <p className="eyebrow">Données personnelles</p>
        <h1 className="mt-3 text-4xl font-semibold text-ruby-navy sm:text-5xl">Politique de confidentialité</h1>
        <div className="mt-8 space-y-8 text-base leading-8 text-slate-700">
          <section>
            <h2 className="text-2xl font-semibold text-ruby-navy">Version locale</h2>
            <p className="mt-3">
              Dans cette version de démonstration, le formulaire de contact affiche un message de succès fictif. Aucune
              donnée n’est envoyée par email, stockée sur un serveur distant ou transmise à un service externe.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ruby-navy">Données susceptibles d’être demandées</h2>
            <p className="mt-3">
              Le formulaire prévoit les champs suivants : nom, prénom, email, téléphone, type d’assurance recherchée et
              message. Ces informations ont vocation à permettre le traitement d’une demande de rappel lorsque le site
              sera relié à une solution d’envoi.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ruby-navy">Chatbot de démonstration</h2>
            <p className="mt-3">
              L’assistant Ruby Assur’ utilise uniquement des réponses prédéfinies en local. Il ne réalise aucun appel à
              une intelligence artificielle, n’utilise aucune clé API et n’envoie pas de données personnelles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ruby-navy">Responsable</h2>
            <p className="mt-3">
              {legalInfo.name}, {legalInfo.address}. SIREN {legalInfo.siren}.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
