import type { Metadata } from "next";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Ruby Assur'",
  description:
    "Politique de confidentialité et traitement des données personnelles (RGPD) de Ruby Assur'.",
};

export default function Confidentialite() {
  return (
    <section className="block">
      <div className="wrap legal">
        <span className="eyebrow">Données personnelles</span>
        <h1>Politique de confidentialité</h1>
        <p className="updated">
          Dernière mise à jour : à compléter à la mise en ligne
        </p>

        <p>
          {company.name} accorde une importance particulière à la protection de
          vos données personnelles, dans le respect du Règlement Général sur la
          Protection des Données (RGPD) et de la loi Informatique et Libertés.
        </p>

        <h2>Responsable du traitement</h2>
        <p>
          {company.name}, SASU, {company.address}. Contact :{" "}
          <span className="placeholder">{company.email} (à confirmer)</span>.
        </p>

        <h2>Données collectées</h2>
        <p>
          Via le formulaire de contact, nous collectons les données que vous
          nous transmettez : nom, prénom, adresse email, numéro de téléphone,
          type d&apos;assurance recherchée et contenu de votre message.
        </p>

        <h2>Finalités</h2>
        <ul>
          <li>répondre à votre demande de devis, de rappel ou d&apos;information ;</li>
          <li>
            vous accompagner dans le cadre de notre activité de courtage en
            assurance ;
          </li>
          <li>assurer le suivi de la relation commerciale.</li>
        </ul>

        <h2>Base légale</h2>
        <p>
          Les traitements reposent sur votre consentement et/ou sur
          l&apos;exécution de mesures précontractuelles prises à votre demande.
        </p>

        <h2>Durée de conservation</h2>
        <p>
          Vos données sont conservées le temps nécessaire au traitement de votre
          demande et à la relation commerciale, puis archivées ou supprimées
          conformément aux durées légales applicables.{" "}
          <span className="placeholder">
            (Durées précises à formaliser par la société.)
          </span>
        </p>

        <h2>Destinataires</h2>
        <p>
          Vos données sont destinées à {company.name} et, le cas échéant, aux
          compagnies d&apos;assurance et partenaires strictement nécessaires au
          traitement de votre demande. Elles ne sont jamais vendues à des tiers.
        </p>

        <h2>Vos droits</h2>
        <p>
          Vous disposez d&apos;un droit d&apos;accès, de rectification,
          d&apos;effacement, de limitation, d&apos;opposition et de portabilité
          de vos données. Vous pouvez les exercer en nous écrivant à
          l&apos;adresse ci-dessus.
        </p>
        <p>
          Vous pouvez également introduire une réclamation auprès de la CNIL —
          Commission Nationale de l&apos;Informatique et des Libertés (
          <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
            www.cnil.fr
          </a>
          ).
        </p>

        <h2>Cookies</h2>
        <p className="placeholder">
          À compléter : si le site utilise des cookies (mesure d&apos;audience,
          etc.), décrire ici leur nature et le moyen de les refuser. En
          l&apos;absence de cookies non essentiels, le préciser.
        </p>
      </div>
    </section>
  );
}
