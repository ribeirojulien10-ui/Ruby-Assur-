import { DEFAULT_FORMATS } from "./constants";

/**
 * MODÈLES INITIAUX de checklists.
 *
 * Source : liste des documents fournie par Julien (types Auto, Moto, Habitation, PNO, Mutuelle, Prévoyance,
 * Multirisque pro, RC pro, Emprunteur, Animaux, Protection juridique). Les modèles « négoce automobile »,
 * « décennale » et « autres risques » restent ceux d'origine. Ce ne sont PAS des exigences réglementaires
 * ni celles d'un assureur donné. Julien peut tout modifier depuis /espace-pro/modeles, sans toucher au code.
 *
 * Seuls les FICHIERS sont des pièces à téléverser. Les informations (adresse, surface, profession, chiffre
 * d'affaires, date de naissance…) sont reprises dans les « précisions » affichées au client.
 * Plusieurs modèles peuvent exister pour une même page d'assurance (ex. Auto et Moto).
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
  // ───────── Particuliers (liste fournie par Julien) ─────────
  {
    insuranceSlug: "assurance-auto-moto",
    name: "Auto",
    description: "Assurance auto.",
    items: [
      doc("Carte grise", true),
      doc("Permis de conduire", true, "Recto et verso, lisibles."),
      doc("Relevé d'information", true, "À demander à votre assureur actuel ou précédent."),
      doc("Pièce d'identité", true),
      doc("RIB", true),
    ],
  },
  {
    insuranceSlug: "assurance-auto-moto",
    name: "Moto",
    description: "Assurance moto.",
    items: [
      doc("Carte grise", true),
      doc("Permis A / A2 (ou justificatif de formation)", true),
      doc("Relevé d'information", true, "À demander à votre assureur actuel ou précédent."),
      doc("Pièce d'identité", true),
      doc("RIB", true),
    ],
  },
  {
    insuranceSlug: "assurance-habitation",
    name: "Habitation",
    description: "Assurance habitation.",
    instructions: "Informations à avoir sous la main : adresse du logement, surface, nombre de pièces, statut (propriétaire ou locataire).",
    items: [doc("Pièce d'identité", true), doc("RIB", true)],
  },
  {
    insuranceSlug: "assurance-habitation",
    name: "Propriétaire non occupant (PNO)",
    description: "Assurance propriétaire non occupant.",
    instructions:
      "Informations à avoir sous la main : adresse du bien, surface, nombre de pièces, usage du logement, informations sur les éventuels locataires.",
    items: [doc("RIB", true)],
  },
  {
    insuranceSlug: "mutuelle-sante",
    name: "Mutuelle santé",
    description: "Mutuelle santé.",
    instructions: "Informations à avoir sous la main : coordonnées et date de naissance des bénéficiaires.",
    items: [doc("Pièce d'identité", true), doc("Attestation de droits Sécurité sociale", true), doc("RIB", true)],
  },
  {
    insuranceSlug: "assurance-animaux",
    name: "Animaux",
    description: "Assurance chien / chat.",
    instructions: "Informations à avoir sous la main : date de naissance et race de l'animal.",
    items: [
      doc("Identification de l'animal (puce ou tatouage)", true),
      doc("Carnet de santé", true),
      doc("RIB", true),
    ],
  },
  {
    insuranceSlug: "assurance-emprunteur",
    name: "Emprunteur",
    description: "Assurance de prêt.",
    instructions: "Informations à avoir sous la main : profession, date de naissance.",
    items: [
      doc("Offre de prêt", true),
      doc("Tableau d'amortissement", true),
      doc("Pièce d'identité", true),
      doc("Justificatif de revenus", true),
      doc("Questionnaire de santé", false, "Selon les conditions légales."),
    ],
  },

  // ───────── Professionnels (liste fournie par Julien) ─────────
  {
    insuranceSlug: "sante-prevoyance-pro",
    name: "Prévoyance",
    description: "Prévoyance.",
    instructions: "Informations à avoir sous la main : profession, statut professionnel.",
    items: [
      doc("Pièce d'identité", true),
      doc("Justificatif de revenus ou dernier avis d'imposition", true),
      doc("Questionnaire médical", false, "Selon le contrat."),
    ],
  },
  {
    insuranceSlug: "multirisque-pro",
    name: "Multirisque professionnelle",
    description: "Multirisque professionnelle.",
    instructions:
      "Informations à avoir sous la main : activité exercée, adresse professionnelle, chiffre d'affaires, effectif, superficie des locaux.",
    items: [doc("Kbis ou extrait SIREN", true), doc("RIB", true)],
  },
  {
    insuranceSlug: "rc-pro",
    name: "Responsabilité civile professionnelle",
    description: "RC professionnelle.",
    instructions: "Informations à avoir sous la main : description précise de l'activité, chiffre d'affaires, effectif.",
    items: [doc("Kbis ou extrait SIREN", true), doc("Antécédents d'assurance et de sinistres", true)],
  },
  {
    insuranceSlug: "autres-risques-pro",
    name: "Protection juridique",
    description: "Protection juridique (rattachée à « Autres risques »).",
    instructions: "Informations à avoir sous la main : coordonnées, activité ou situation personnelle selon le contrat.",
    items: [doc("Pièce d'identité", true)],
  },

  // ───────── Inchangés (non concernés par la liste de Julien) ─────────
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
