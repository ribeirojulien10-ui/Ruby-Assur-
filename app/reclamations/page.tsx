import type { Metadata } from "next";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Réclamations — Ruby Assur'",
  description:
    "Procédure de traitement des réclamations de Ruby Assur' et recours au médiateur de l'assurance.",
};

export default function Reclamations() {
  return (
    <section className="block">
      <div className="wrap legal">
        <span className="eyebrow">Vos droits</span>
        <h1>Réclamations</h1>
        <p className="updated">Procédure de traitement des réclamations</p>

        <p>
          {company.name} attache une grande importance à la qualité de la
          relation avec ses clients. Si vous n&apos;êtes pas satisfait, voici la
          marche à suivre.
        </p>

        <h2>1. Nous contacter directement</h2>
        <p>Adressez votre réclamation à {company.name} par l&apos;un des moyens suivants :</p>
        <ul>
          <li>
            Par courrier : {company.name} — Service réclamations,{" "}
            {company.address}
          </li>
          <li>
            Par email :{" "}
            <span className="placeholder">{company.email} (à confirmer)</span>
          </li>
        </ul>

        <h2>2. Délais de traitement</h2>
        <p>
          Conformément aux recommandations applicables au secteur, {company.name}{" "}
          s&apos;engage à :
        </p>
        <ul>
          <li>
            accuser réception de votre réclamation sous dix (10) jours ouvrables
            maximum ;
          </li>
          <li>
            vous apporter une réponse sous deux (2) mois maximum à compter de sa
            réception.
          </li>
        </ul>
        <p style={{ fontSize: ".88rem", fontStyle: "italic" }}>
          Ces délais reprennent les standards usuels du secteur ; ils sont à
          confirmer et à formaliser par la société.
        </p>

        <h2>3. Saisir le médiateur de l&apos;assurance</h2>
        <p>
          Si la réponse apportée ne vous satisfait pas, ou en l&apos;absence de
          réponse dans les délais, vous pouvez saisir gratuitement le médiateur
          de l&apos;assurance :
        </p>
        <div className="infobox">
          <dl>
            <dt>Organisme</dt>
            <dd>La Médiation de l&apos;Assurance</dd>
            <dt>Adresse</dt>
            <dd>TSA 50110, 75441 Paris Cedex 09</dd>
            <dt>En ligne</dt>
            <dd>
              <a
                href="https://www.mediation-assurance.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.mediation-assurance.org
              </a>
            </dd>
          </dl>
        </div>
        <p>
          La saisine du médiateur ne vous prive pas de la possibilité de saisir
          les tribunaux compétents.
        </p>
        <p style={{ fontSize: ".88rem", fontStyle: "italic" }}>
          Le dispositif de médiation compétent peut varier selon le contrat
          concerné ; les coordonnées exactes du médiateur applicable figurent
          également dans vos documents contractuels.
        </p>
      </div>
    </section>
  );
}
