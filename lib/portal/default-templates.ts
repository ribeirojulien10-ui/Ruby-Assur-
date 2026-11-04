import { DEFAULT_FORMATS } from "./config";

/**
 * MODÈLES INITIAUX de checklists, un par assurance proposée sur le site.
 *
 * ⚠️ Proposition à VALIDER par Julien : elle est dérivée des pièces déjà listées sur les pages
 * d'assurance (lib/products.ts, rubrique « Documents à préparer »). Ce ne sont PAS des règles
 * réglementaires ni les exigences officielles des assureurs. Julien peut tout modifier depuis
 * l'espace professionnel (/espace-pro/modeles), sans toucher au code.
 *
 * Les informations qui ne sont pas des documents (adresse du logement, surface, chiffre d'affaires…)
 * sont reprises dans les « précisions » du modèle plutôt que comme pièces à téléverser.
 */
export interface DefaultItem {
  label: string;
  instructions?: string;
  required: boolean;
  formats?: string[];
}
export interface DefaultTemplate {
  insuranceSlug: string;
  name: string;
  description: string;
  instructions?: string;
  items: DefaultItem[];
}

const doc = (label: string, required: boolean, instructions?: string): DefaultItem => ({ label, required, instructions });

export const DEFAULT_TEMPLATES: DefaultTemplate[] = [
  {
    insuranceSlug: "assurance-auto-moto",
    name: "Assurance auto / moto",
    description: "Pièces courantes pour une étude d'assurance auto, moto ou trottinette.",
    instructions: "Informations utiles à avoir sous la main : bonus/malus actuel.",
    items: [
      doc("Permis de conduire", true, "Recto et verso, lisibles."),
      doc("Carte grise du véhicule", true),
      doc("Relevé d'informations (ancien assureur)", true, "À demander à votre assureur actuel ou précédent."),
      doc("RIB pour prélèvement", false),
    ],
  },
  {
    insuranceSlug: "assurance-habitation",
    name: "Assurance habitation",
    description: "Pièces courantes pour une étude d'assurance habitation, PNO ou scolaire.",
    instructions: "Informations utiles : adresse du logement, surface, statut (locataire / propriétaire / bailleur).",
    items: [
      doc("Ancien contrat (si résiliation)", false),
      doc("Liste des équipements de valeur", false),
    ],
  },
  {
    insuranceSlug: "mutuelle-sante",
    name: "Mutuelle santé",
    description: "Pièces courantes pour une étude de mutuelle santé.",
    items: [
      doc("Carte Vitale", true),
      doc("Attestation Ameli (droits Sécurité sociale)", true),
      doc("Relevé des dépenses santé actuelles", false),
      doc("Ancien contrat de mutuelle (si résiliation)", false),
    ],
  },
  {
    insuranceSlug: "assurance-animaux",
    name: "Assurance chien / chat",
    description: "Pièces courantes pour une étude d'assurance animaux.",
    instructions: "Informations utiles : race, âge, poids, numéro de tatouage ou de puce électronique.",
    items: [doc("Carnet de santé de l'animal", true), doc("Attestation de vaccination à jour", true)],
  },
  {
    insuranceSlug: "assurance-emprunteur",
    name: "Assurance emprunteur",
    description: "Pièces courantes pour une étude d'assurance de prêt.",
    items: [
      doc("Offre de prêt bancaire", true),
      doc("Tableau d'amortissement", true),
      doc("Questionnaire médical", false, "Selon la couverture choisie."),
      doc("Relevé d'identité bancaire", false),
    ],
  },
  {
    insuranceSlug: "multirisque-pro",
    name: "Multirisque professionnelle",
    description: "Pièces courantes pour une multirisque professionnelle.",
    instructions: "Informations utiles : adresse et surface des locaux, valeur du matériel et des stocks, chiffre d'affaires N-1.",
    items: [doc("Kbis ou extrait SIREN", true), doc("Historique des sinistres (3 ans)", false)],
  },
  {
    insuranceSlug: "negoce-automobile",
    name: "Négoce automobile",
    description: "Pièces courantes pour une assurance de négociant automobile.",
    instructions: "Information utile : surface du parc automobile.",
    items: [
      doc("Kbis", true),
      doc("Carte professionnelle de commerçant en véhicules", true),
      doc("Liste des véhicules en stock", true),
      doc("Historique des sinistres (3 ans)", false),
    ],
  },
  {
    insuranceSlug: "rc-pro",
    name: "Responsabilité civile professionnelle",
    description: "Pièces courantes pour une RC professionnelle.",
    instructions: "Informations utiles : description précise de l'activité, chiffre d'affaires N-1 ou prévisionnel.",
    items: [doc("Kbis ou extrait SIREN", true), doc("Historique des sinistres (3 ans)", false)],
  },
  {
    insuranceSlug: "sante-prevoyance-pro",
    name: "Santé et prévoyance professionnelles",
    description: "Pièces courantes pour une santé / prévoyance professionnelle.",
    instructions: "Informations utiles : statut (TNS, gérant, salarié), nombre de salariés le cas échéant.",
    items: [doc("Kbis ou extrait SIREN", true), doc("Relevé de protection sociale actuelle", false)],
  },
  {
    insuranceSlug: "assurance-decennale",
    name: "Assurance décennale",
    description: "Pièces courantes pour une assurance décennale.",
    instructions: "Information utile : chiffre d'affaires N-1 ou prévisionnel.",
    items: [
      doc("Kbis ou extrait SIREN", true),
      doc("Qualification professionnelle (Qualibat, RGE…)", true),
      doc("Description des travaux réalisés", false),
      doc("Historique des sinistres décennaux", false),
    ],
  },
  {
    insuranceSlug: "autres-risques-pro",
    name: "Autres risques professionnels",
    description: "Pièces courantes pour un risque professionnel spécifique.",
    instructions: "Informations utiles : description détaillée de l'activité, chiffre d'affaires N-1.",
    items: [
      doc("Kbis ou extrait SIREN", true),
      doc("Contrats en cours (si résiliation)", false),
      doc("Historique des sinistres (3 ans)", false),
    ],
  },
];

export const defaultFormats = (): string[] => [...DEFAULT_FORMATS];
