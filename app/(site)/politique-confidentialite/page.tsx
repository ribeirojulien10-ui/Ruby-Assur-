import type { Metadata } from "next";
import { legalInfo } from "@/lib/site";

const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@rubyassur.fr";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Ruby Assur'",
  description: "Politique de confidentialité de Ruby Assur', courtier en assurance immatriculé ORIAS 24007878.",
  alternates: { canonical: "/politique-confidentialite" },
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
              {legalInfo.name}, {legalInfo.legalForm}. SIREN {legalInfo.siren}. Immatriculé à l&apos;ORIAS sous le n° {legalInfo.orias}.
              Contact : <a href={`mailto:${email}`} className="underline">{email}</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ruby-navy">Données collectées</h2>
            <p className="mt-3">
              Lorsque vous demandez un devis ou une information, nous collectons : nom, prénom, adresse e-mail, numéro de
              téléphone, type d&apos;assurance recherché, message libre, ainsi que les informations utiles à l&apos;étude de votre
              demande (par exemple : situation, adresse du logement, informations sur le véhicule, date de naissance et
              informations relatives aux personnes à assurer, caractéristiques d&apos;un animal) et, si vous les joignez, les
              documents nécessaires (permis de conduire, carte grise, relevé d&apos;information, pièce d&apos;identité, RIB…).
              Les informations relatives à d&apos;autres personnes (conjoint, enfants) ne doivent être transmises que si vous
              êtes autorisé à le faire. Nous ne collectons pas de données de santé via le site : ne nous en transmettez pas
              sans que nous vous les ayons demandées.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ruby-navy">Finalités et bases légales</h2>
            <p className="mt-3">
              Vos données sont utilisées pour répondre à votre demande, établir des devis et, si vous le souhaitez,
              conclure et gérer un contrat d&apos;assurance (mesures précontractuelles et exécution du contrat), respecter nos
              obligations légales de courtier (devoir de conseil, lutte contre le blanchiment et le financement du terrorisme,
              réclamations) et, avec votre accord, mesurer l&apos;efficacité de nos publicités. Elles ne sont ni vendues ni
              cédées à des fins commerciales et ne font l&apos;objet d&apos;aucune décision automatisée.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ruby-navy">Durée de conservation</h2>
            <p className="mt-3">
              Si aucun contrat n&apos;est conclu, vos données sont conservées le temps nécessaire au traitement de votre demande
              et au maximum 3 ans à compter du dernier contact. En cas de contrat, elles sont conservées pendant sa durée
              puis pendant les délais de conservation et de prescription légaux applicables.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ruby-navy">Destinataires et prestataires</h2>
            <p className="mt-3">
              Pour faire fonctionner le site, Ruby Assur&apos; fait appel à des prestataires techniques :
              Vercel (hébergement du site) et Resend (acheminement des e-mails issus du formulaire de devis).
              Ils n&apos;utilisent pas vos données pour leur propre compte. Ces prestataires pouvant être établis hors de l&apos;Union
              européenne, des garanties appropriées (clauses contractuelles types de la Commission européenne ou équivalent)
              encadrent ces transferts. Pour établir un devis ou un contrat, vos données peuvent aussi être transmises aux
              compagnies d&apos;assurance que vous avez choisi de consulter.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ruby-navy">Cookies et mesure d&apos;audience</h2>
            <p className="mt-3">
              La mesure d&apos;audience du site (Vercel Analytics) fonctionne sans cookie. Les traceurs publicitaires
              (Google Ads) ne sont activés qu&apos;avec votre accord, recueilli via le bandeau affiché lors de votre
              première visite. Vous pouvez modifier votre choix à tout moment avec le lien « Gérer les cookies »
              en bas de page.
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
              d&apos;accès, de rectification, d&apos;effacement, d&apos;opposition, de limitation et de portabilité concernant vos données personnelles.
              Pour exercer ces droits, contactez Ruby Assur' via le formulaire de contact ou par email.
              Vous pouvez également introduire une réclamation auprès de la CNIL (
              <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="underline">www.cnil.fr</a>).
            </p>
          </section>

        </div>
      </div>
    </section>
  );
}
