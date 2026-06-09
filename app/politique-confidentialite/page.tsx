import type { Metadata } from "next";
import { legalInfo } from "@/lib/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Ruby Assur'",
  description: "Politique de confidentialité de Ruby Assur', courtier en assurance immatriculé ORIAS 24007878.",
};

export default function PrivacyPage() {
  return (
    <section className="bg-white py-16">
      <div className="section-shell max-w-4xl">
        <p className="eyebrow">Données personnelles</p>
        <h1 className="mt-3 text-4xl font-semibold text-ruby-navy sm:text-5xl">Politique de confidentialité</h1>
        <div className="mt-8 space-y-8 text-base leading-8 text-slate-700">

          <section>
            <h2 className="text-2xl font-semibold text-ruby-navy">Responsable du traitement</h2>
            <p className="mt-3">
              {legalInfo.name}, {legalInfo.address}. SIREN {legalInfo.siren}. Immatriculé à l&apos;ORIAS sous le n° {legalInfo.orias}.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ruby-navy">Données collectées</h2>
            <p className="mt-3">
              Dans le cadre de l&apos;utilisation du formulaire de contact, les données suivantes peuvent être collectées :
              nom, prénom, adresse email, numéro de téléphone, type d&apos;assurance recherché et message libre.
              Ces informations sont utilisées exclusivement pour traiter votre demande et vous recontacter.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ruby-navy">Finalité et durée de conservation</h2>
            <p className="mt-3">
              Les données transmises via le formulaire sont utilisées dans le seul but de répondre à votre demande
              de devis ou d&apos;information. Elles ne sont pas cédées à des tiers et ne font l&apos;objet d&apos;aucun
              traitement commercial automatisé. Elles sont conservées le temps nécessaire au traitement de votre
              demande, et au maximum 3 ans à compter du dernier contact.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ruby-navy">Assistant en ligne</h2>
            <p className="mt-3">
              L&apos;assistant disponible sur le site propose des réponses aux questions fréquentes sur les assurances.
              Les échanges ne sont pas conservés ni transmis à des tiers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ruby-navy">Vos droits</h2>
            <p className="mt-3">
              Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d&apos;un droit
              d&apos;accès, de rectification, d&apos;effacement et d&apos;opposition concernant vos données personnelles.
              Pour exercer ces droits, contactez Ruby Assur' via le formulaire de contact ou par email.
            </p>
          </section>

        </div>
      </div>
    </section>
  );
}
