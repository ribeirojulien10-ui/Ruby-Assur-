import { DEFAULT_FORMATS } from "./constants";
import type { InfoField, Question } from "./types";

/**
 * MODÈLES INITIAUX de checklists.
 *
 * Source : liste des documents fournie par Julien (types Auto, Moto, Habitation, PNO, Mutuelle, Prévoyance,
 * Multirisque pro, RC pro, Emprunteur, Animaux, Protection juridique). Les modèles « négoce automobile »,
 * « décennale » et « autres risques » restent ceux d'origine. Ce ne sont PAS des exigences réglementaires
 * ni celles d'un assureur donné. Julien peut tout modifier depuis /espace-pro/modeles, sans toucher au code.
 *
 * Les FICHIERS sont des pièces à téléverser ; les informations (adresse, surface, profession, chiffre
 * d'affaires, date de naissance…) sont des champs que le client peut saisir directement.
 * Plusieurs modèles peuvent exister pour une même page d'assurance (ex. Auto et Moto).
 */
export interface DefaultItem {
  label: string;
  instructions?: string;
  required: boolean;
  formats?: string[];
  /** Pièce affichée seulement selon la réponse à une question (ex. relevé d'information). */
  conditionQuestion?: string;
  conditionEquals?: "yes" | "no";
}
export interface DefaultTemplate {
  insuranceSlug: string;
  name: string;
  description: string;
  instructions?: string;
  questions?: Question[];
  /** Informations que le client peut saisir en plus des documents. */
  fields?: InfoField[];
  items: DefaultItem[];
}

const doc = (label: string, required: boolean, instructions?: string): DefaultItem => ({ label, required, instructions });

/** RIB : facultatif au départ, nécessaire seulement si le devis est accepté. */
const rib = (): DefaultItem =>
  doc("RIB", false, "Facultatif pour l'instant : nécessaire seulement si vous acceptez le devis.");

const f = (key: string, label: string, type: InfoField["type"] = "text", extra: Partial<InfoField> = {}): InfoField => ({ key, label, type, ...extra });

/** Case « première assurance » : décochée, le relevé d'information est demandé ; cochée, il ne l'est plus. */
const FIRST_INSURANCE: Question = {
  key: "premiere_assurance",
  label: "C'est ma première assurance (je n'ai pas de relevé d'information)",
  type: "checkbox",
};
const releve = (): DefaultItem => ({
  label: "Relevé d'information",
  required: true,
  instructions: "À demander à votre assureur actuel ou précédent.",
  conditionQuestion: "premiere_assurance",
  conditionEquals: "no",
});

export const DEFAULT_TEMPLATES: DefaultTemplate[] = [
  // ───────── Particuliers (règles de Julien : identité obligatoire, RIB facultatif au départ,
  //           relevé d'information obligatoire sauf première assurance) ─────────
  {
    insuranceSlug: "assurance-auto-moto",
    name: "Auto",
    description: "Assurance auto.",
    questions: [FIRST_INSURANCE],
    items: [doc("Carte grise", true), doc("Permis de conduire", true, "Recto et verso, lisibles."), releve(), doc("Pièce d'identité", true), rib()],
  },
  {
    insuranceSlug: "assurance-auto-moto",
    name: "Moto",
    description: "Assurance moto.",
    questions: [FIRST_INSURANCE],
    items: [doc("Carte grise", true), doc("Permis A / A2 (ou justificatif de formation)", true), releve(), doc("Pièce d'identité", true), rib()],
  },
  {
    insuranceSlug: "assurance-habitation",
    name: "Habitation",
    description: "Assurance habitation.",
    fields: [
      f("adresse", "Adresse complète du logement", "textarea"),
      f("type-bien", "Type de bien", "choice", { options: ["Maison", "Appartement"] }),
      f("surface", "Surface habitable", "number", { unit: "m²" }),
      f("pieces", "Nombre de pièces principales", "number"),
      f("annee", "Année de construction (approximative)", "number"),
      f("statut", "Vous êtes", "choice", { options: ["Locataire", "Propriétaire occupant"] }),
      f("commentaires", "Commentaires complémentaires", "textarea"),
    ],
    items: [doc("Pièce d'identité", true), rib()],
  },
  {
    insuranceSlug: "assurance-habitation",
    name: "Propriétaire non occupant (PNO)",
    description: "Assurance propriétaire non occupant.",
    fields: [
      f("adresse", "Adresse complète du bien", "textarea"),
      f("type-bien", "Type de bien", "choice", { options: ["Maison", "Appartement"] }),
      f("surface", "Surface habitable", "number", { unit: "m²" }),
      f("pieces", "Nombre de pièces principales", "number"),
      f("usage", "Usage du logement", "choice", { options: ["Logement loué", "Vacant", "Résidence secondaire"] }),
      f("location", "Type de location", "choice", { options: ["Location nue", "Location meublée"] }),
      f("locataires", "Informations sur les éventuels locataires", "textarea"),
      f("commentaires", "Commentaires complémentaires", "textarea"),
    ],
    items: [doc("Pièce d'identité", true), rib()],
  },
  {
    insuranceSlug: "mutuelle-sante",
    name: "Mutuelle santé",
    description: "Mutuelle santé.",
    fields: [
      f("contrat", "Type de contrat", "choice", { options: ["Individuel", "Couple", "Famille"] }),
      f("beneficiaires", "Bénéficiaires (nom, prénom et date de naissance de chacun)", "textarea"),
      f("statut", "Statut", "choice", { options: ["Salarié", "Indépendant", "Retraité", "Sans activité", "Étudiant", "Autre"] }),
      f("cp", "Code postal de résidence"),
      f("commune", "Commune de résidence"),
      f("familiale", "Situation familiale"),
      f("effet", "Date souhaitée de prise d'effet", "date"),
      f("mutuelle-actuelle", "Mutuelle actuelle", "choice", { options: ["Oui", "Non"] }),
    ],
    items: [doc("Pièce d'identité", true), doc("Attestation de droits Sécurité sociale", true), rib()],
  },
  {
    insuranceSlug: "assurance-animaux",
    name: "Animaux",
    description: "Assurance chien / chat.",
    fields: [f("naissance", "Date de naissance de l'animal", "date"), f("race", "Race")],
    items: [doc("Identification de l'animal (puce ou tatouage)", true), doc("Carnet de santé", true), rib()],
  },
  {
    insuranceSlug: "assurance-emprunteur",
    name: "Emprunteur",
    description: "Assurance de prêt.",
    fields: [f("profession", "Profession"), f("naissance", "Date de naissance", "date")],
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
    fields: [f("profession", "Profession"), f("statut", "Statut professionnel")],
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
    fields: [
      f("activite", "Activité exercée"),
      f("adresse-pro", "Adresse professionnelle", "textarea"),
      f("ca", "Chiffre d'affaires", "text", { unit: "€" }),
      f("effectif", "Effectif", "number"),
      f("superficie", "Superficie des locaux", "number", { unit: "m²" }),
    ],
    items: [doc("Kbis ou extrait SIREN", true), rib()],
  },
  {
    insuranceSlug: "rc-pro",
    name: "Responsabilité civile professionnelle",
    description: "RC professionnelle.",
    fields: [
      f("activite", "Description précise de l'activité", "textarea"),
      f("ca", "Chiffre d'affaires", "text", { unit: "€" }),
      f("effectif", "Effectif", "number"),
    ],
    items: [doc("Kbis ou extrait SIREN", true), doc("Antécédents d'assurance et de sinistres", true)],
  },
  {
    insuranceSlug: "autres-risques-pro",
    name: "Protection juridique",
    description: "Protection juridique (rattachée à « Autres risques »).",
    fields: [f("situation", "Votre activité ou situation personnelle (selon le contrat)", "textarea")],
    items: [doc("Pièce d'identité", true)],
  },

  // ───────── Inchangés (non concernés par la liste de Julien) ─────────
  {
    insuranceSlug: "negoce-automobile",
    name: "Négoce automobile",
    description: "Pièces courantes pour une assurance de négociant automobile.",
    fields: [f("parc", "Surface du parc automobile", "number", { unit: "m²" })],
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
    fields: [f("ca", "Chiffre d'affaires N-1 ou prévisionnel", "text", { unit: "€" })],
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
    fields: [f("activite", "Description détaillée de l'activité", "textarea"), f("ca", "Chiffre d'affaires N-1", "text", { unit: "€" })],
    items: [
      doc("Kbis ou extrait SIREN", true),
      doc("Contrats en cours (si résiliation)", false),
      doc("Historique des sinistres (3 ans)", false),
    ],
  },
];

export const defaultFormats = (): string[] => [...DEFAULT_FORMATS];
