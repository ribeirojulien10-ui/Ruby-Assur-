import type { Metadata } from "next";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Mentions légales — Ruby Assur'",
  description: "Mentions légales de Ruby Assur', SASU — courtier en assurances.",
};

export default function MentionsLegales() {
  return (
    <section className="block">
      <div className="wrap legal">
        <span className="eyebrow">Informations légales</span>
        <h1>Mentions légales</h1>
        <p className="updated">
          Dernière mise à jour : à compléter à la mise en ligne
        </p>

        <h2>Éditeur du site</h2>
        <div className="infobox">
          <dl>
            <dt>Dénomination</dt>
            <dd>{company.name}</dd>
            <dt>Forme juridique</dt>
            <dd>{company.legalForm}</dd>
            <dt>Capital social</dt>
            <dd>{company.capital}</dd>
            <dt>Siège social</dt>
            <dd>{company.address}</dd>
            <dt>SIREN</dt>
            <dd>{company.siren}</dd>
            <dt>SIRET (siège)</dt>
            <dd>{company.siret}</dd>
            <dt>RCS</dt>
            <dd>{company.rcs}</dd>
            <dt>Code APE / NAF</dt>
            <dd>{company.ape}</dd>
            <dt>TVA intracom.</dt>
            <dd>{company.tva}</dd>
            <dt>Président</dt>
            <dd>{company.president}</dd>
            <dt>Email</dt>
            <dd className="placeholder">{company.email} (à confirmer)</dd>
            <dt>Téléphone</dt>
            <dd className="placeholder">à compléter</dd>
          </dl>
        </div>

        <h2>Statut de courtier en assurance</h2>
        <p>
          {company.name} exerce une activité de courtage et d&apos;intermédiation
          en assurances. À ce titre, la société est immatriculée auprès de
          l&apos;ORIAS (Organisme pour le Registre unique des Intermédiaires en
          Assurance, Banque et Finance).
        </p>
        <div className="infobox">
          <dl>
            <dt>N° ORIAS</dt>
            <dd>{company.orias}</dd>
            <dt>Catégorie</dt>
            <dd>{company.oriasStatus}</dd>
            <dt>Inscrit depuis</dt>
            <dd>{company.oriasDate}</dd>
            <dt>Vérification</dt>
            <dd>
              Le registre est consultable sur{" "}
              <a
                href="https://www.orias.fr"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.orias.fr
              </a>
            </dd>
          </dl>
        </div>

        <h2>Autorité de contrôle</h2>
        <p>
          L&apos;activité de courtage en assurance est soumise au contrôle de
          l&apos;Autorité de Contrôle Prudentiel et de Résolution (ACPR), 4 place
          de Budapest, CS 92459, 75436 Paris Cedex 09.
        </p>

        <h2>Hébergement</h2>
        <p className="placeholder">
          À compléter : nom de l&apos;hébergeur, raison sociale et adresse (par
          exemple Vercel Inc. si le site est déployé sur Vercel, ou
          l&apos;hébergeur retenu).
        </p>

        <h2>Propriété intellectuelle</h2>
        <p>
          L&apos;ensemble des contenus de ce site (textes, visuels, logo, charte
          graphique) est la propriété de {company.name} ou de ses partenaires.
          Toute reproduction sans autorisation est interdite.
        </p>

        <h2>Médiation</h2>
        <p>
          En cas de litige, le client peut, après avoir épuisé les voies de
          recours internes (voir la page Réclamations), saisir gratuitement le
          médiateur de l&apos;assurance. Coordonnées indiquées sur la page
          Réclamations.
        </p>
      </div>
    </section>
  );
}
