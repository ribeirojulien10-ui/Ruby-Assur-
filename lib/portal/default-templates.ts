import { DEFAULT_FORMATS, PAPER_QUESTION_KEY } from "./constants";
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

/** Message libre pour Ruby Assur' (par exemple si un document n'est pas disponible). */
const message = (hint = "Facultatif : une précision, ou la raison si un document n'est pas disponible."): InfoField =>
  f("message", "Message pour Ruby Assur'", "textarea", { hint });

// ───────── Véhicules : documents obligatoires, relevé d'information sauf première assurance ─────────
const FIRST_INSURANCE: Question = {
  key: "premiere_assurance",
  label: "C'est ma première assurance (je n'ai pas de relevé d'information)",
  type: "checkbox",
};
const releve = (): DefaultItem => ({
  label: "Relevé d'information",
  required: true,
  instructions:
    "Vous n'avez pas de relevé d'information ? Si c'est votre première assurance, cochez la case « C'est ma première assurance » en haut de page. Sinon, demandez-le à votre assureur actuel ou précédent, ou écrivez-nous un message ci-dessous.",
  conditionQuestion: "premiere_assurance",
  conditionEquals: "no",
});
const vehicleMessage = () =>
  message("Facultatif : par exemple si vous avez du mal à obtenir votre relevé d'information.");

// ───────── Habitation / PNO : mini questionnaire à remplir en ligne OU à imprimer ─────────
const PAPER: Question = {
  key: PAPER_QUESTION_KEY,
  label: "Je préfère imprimer le questionnaire, le remplir à la main et le renvoyer en photo ou en scan",
  type: "checkbox",
};
const online = (key: string, label: string, type: InfoField["type"] = "text", extra: Partial<InfoField> = {}): InfoField =>
  f(key, label, type, { ...extra, condition: { question: PAPER_QUESTION_KEY, equals: "no" } });
const paperDoc = (): DefaultItem => ({
  label: "Questionnaire rempli (photo ou scan)",
  required: true,
  instructions: "Imprimez le questionnaire avec le bouton ci-dessus, remplissez-le à la main, puis envoyez-le ici en photo ou en scan.",
  conditionQuestion: PAPER_QUESTION_KEY,
  conditionEquals: "yes",
});

export const DEFAULT_TEMPLATES: DefaultTemplate[] = [
  // ═════════ Particuliers ═════════
  {
    insuranceSlug: "assurance-auto-moto",
    name: "Auto",
    description: "Assurance auto.",
    questions: [FIRST_INSURANCE],
    fields: [vehicleMessage()],
    items: [doc("Carte grise", true), doc("Permis de conduire", true, "Recto et verso, lisibles."), releve(), doc("Pièce d'identité", true), rib()],
  },
  {
    insuranceSlug: "assurance-auto-moto",
    name: "Moto",
    description: "Assurance moto.",
    questions: [FIRST_INSURANCE],
    fields: [vehicleMessage()],
    items: [doc("Carte grise", true), doc("Permis A / A2 (ou justificatif de formation)", true), releve(), doc("Pièce d'identité", true), rib()],
  },
  {
    insuranceSlug: "assurance-auto-moto",
    name: "Véhicule terrestre à moteur (VTM)",
    description: "Véhicule terrestre à moteur (quad, buggy, engin…).",
    questions: [FIRST_INSURANCE],
    fields: [vehicleMessage()],
    items: [doc("Carte grise", true), doc("Permis de conduire", true, "Recto et verso, lisibles."), releve(), doc("Pièce d'identité", true), rib()],
  },
  {
    insuranceSlug: "assurance-habitation",
    name: "Habitation",
    description: "Assurance habitation.",
    questions: [PAPER],
    fields: [
      online("adresse", "Adresse complète du logement", "textarea", { required: true }),
      online("type-bien", "Type de bien", "choice", { options: ["Maison", "Appartement"], required: true }),
      online("surface", "Surface habitable", "number", { unit: "m²", required: true }),
      online("pieces", "Nombre de pièces principales", "number", { required: true }),
      online("statut", "Vous êtes", "choice", { options: ["Locataire", "Propriétaire occupant"], required: true }),
      online("annee", "Année de construction (approximative)", "number"),
      online("commentaires", "Commentaires complémentaires", "textarea"),
    ],
    items: [doc("Pièce d'identité", true), paperDoc(), rib()],
  },
  {
    insuranceSlug: "assurance-habitation",
    name: "Propriétaire non occupant (PNO)",
    description: "Assurance propriétaire non occupant.",
    questions: [PAPER],
    fields: [
      online("adresse", "Adresse complète du bien", "textarea", { required: true }),
      online("type-bien", "Type de bien", "choice", { options: ["Maison", "Appartement"], required: true }),
      online("surface", "Surface habitable", "number", { unit: "m²", required: true }),
      online("pieces", "Nombre de pièces principales", "number", { required: true }),
      online("usage", "Usage du logement", "choice", { options: ["Logement loué", "Vacant", "Résidence secondaire"], required: true }),
      online("location", "Type de location", "choice", { options: ["Location nue", "Location meublée"] }),
      online("locataires", "Informations sur les éventuels locataires", "textarea"),
    ],
    items: [doc("Pièce d'identité", true), paperDoc(), rib()],
  },
  {
    insuranceSlug: "mutuelle-sante",
    name: "Mutuelle santé",
    description: "Mutuelle santé (assuré, conjoint et enfants possibles).",
    questions: [
      { key: "ajout_conjoint", label: "J'ajoute mon conjoint ou partenaire", type: "checkbox" },
      { key: "ajout_enfants", label: "J'ajoute un ou plusieurs enfants", type: "checkbox" },
    ],
    fields: [
      f("statut", "Votre statut", "choice", { options: ["Salarié", "Indépendant", "Retraité", "Sans activité", "Étudiant", "Autre"], required: true }),
      f("naissance", "Votre date de naissance", "date", { required: true }),
      f("cp", "Code postal de résidence", "text", { required: true }),
      f("commune", "Commune de résidence", "text", { required: true }),
      f("conjoint", "Conjoint ou partenaire", "persons", { required: true, birthRequired: true, max: 1, condition: { question: "ajout_conjoint", equals: "yes" } }),
      f("enfants", "Enfants", "persons", { required: true, birthRequired: true, max: 8, condition: { question: "ajout_enfants", equals: "yes" } }),
      f("effet", "Date souhaitée de prise d'effet", "date"),
      f("mutuelle-actuelle", "Mutuelle actuelle", "choice", { options: ["Oui", "Non"] }),
    ],
    items: [doc("Pièce d'identité (CNI)", true), doc("Attestation de droits Sécurité sociale", false, "Facultative pour obtenir un devis ; elle sera nécessaire pour la souscription."), rib()],
  },
  {
    // Produit DÉCLARATIF : aucun document, uniquement un questionnaire.
    insuranceSlug: "assurance-animaux",
    name: "Animaux",
    description: "Assurance chien / chat (questionnaire seul, sans document).",
    fields: [
      f("nom", "Nom de l'animal", "text", { required: true }),
      f("espece", "Espèce", "choice", { options: ["Chien", "Chat"], required: true }),
      f("race", "Race", "text", { required: true }),
      f("naissance", "Date de naissance de l'animal", "date", { required: true }),
      f("identification", "Type d'identification", "choice", { options: ["Puce électronique", "Tatouage", "Aucune"], required: true }),
      f("numero", "Numéro d'identification", "text", { hint: "Facultatif : numéro de puce ou de tatouage." }),
    ],
    items: [],
  },
  {
    insuranceSlug: "assurance-emprunteur",
    name: "Emprunteur",
    description: "Assurance de prêt.",
    fields: [f("profession", "Profession", "text", { required: true }), f("naissance", "Date de naissance", "date", { required: true })],
    items: [
      doc("Offre de prêt", true),
      doc("Tableau d'amortissement", true),
      doc("Pièce d'identité", true),
      doc("Justificatif de revenus", true),
      doc("Questionnaire de santé", false, "Selon les conditions légales."),
    ],
  },

  // ═════════ Professionnels : documents obligatoires + message possible ═════════
  {
    insuranceSlug: "sante-prevoyance-pro",
    name: "Prévoyance",
    description: "Prévoyance.",
    fields: [f("profession", "Profession", "text", { required: true }), f("statut", "Statut professionnel", "text", { required: true }), message()],
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
      f("activite", "Activité exercée", "text", { required: true }),
      f("adresse-pro", "Adresse professionnelle", "textarea", { required: true }),
      f("ca", "Chiffre d'affaires", "text", { unit: "€" }),
      f("effectif", "Effectif", "number"),
      f("superficie", "Superficie des locaux", "number", { unit: "m²" }),
      message(),
    ],
    items: [doc("Kbis ou extrait SIREN", true), rib()],
  },
  {
    insuranceSlug: "rc-pro",
    name: "Responsabilité civile professionnelle",
    description: "RC professionnelle.",
    fields: [
      f("activite", "Description précise de l'activité", "textarea", { required: true }),
      f("ca", "Chiffre d'affaires", "text", { unit: "€" }),
      f("effectif", "Effectif", "number"),
      message(),
    ],
    items: [doc("Kbis ou extrait SIREN", true), doc("Antécédents d'assurance et de sinistres", true)],
  },
  {
    insuranceSlug: "autres-risques-pro",
    name: "Protection juridique",
    description: "Protection juridique (rattachée à « Autres risques »).",
    fields: [f("situation", "Votre activité ou situation personnelle (selon le contrat)", "textarea", { required: true }), message()],
    items: [doc("Pièce d'identité", true)],
  },
  {
    insuranceSlug: "negoce-automobile",
    name: "Négoce automobile",
    description: "Pièces courantes pour une assurance de négociant automobile.",
    fields: [f("parc", "Surface du parc automobile", "number", { unit: "m²" }), message()],
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
    fields: [f("ca", "Chiffre d'affaires N-1 ou prévisionnel", "text", { unit: "€" }), message()],
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
    fields: [f("activite", "Description détaillée de l'activité", "textarea", { required: true }), f("ca", "Chiffre d'affaires N-1", "text", { unit: "€" }), message()],
    items: [
      doc("Kbis ou extrait SIREN", true),
      doc("Contrats en cours (si résiliation)", false),
      doc("Historique des sinistres (3 ans)", false),
    ],
  },
];

export const defaultFormats = (): string[] => [...DEFAULT_FORMATS];
