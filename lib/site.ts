export const brand = "Ruby Assur’";

export const legalInfo = {
  name: "RUBY ASSUR’",
  siren: "933 756 074",
  siret: "933 756 074 00011",
  legalForm: "SASU",
  rcs: "Soissons",
  address: "44 avenue du Bois Roger, 02200 Pasly",
  activity: "Courtage et intermédiaire en assurances",
  naf: "66.22Z",
  president: "Julien Ribeiro",
  orias: "24007878",
  status: "Courtier en assurance, sans maniement de fonds",
  capital: "1 €",
  vat: "FR93933756074",
};

export const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/services", label: "Services" },
  { href: "/a-propos", label: "À propos" },
  { href: "/pourquoi-choisir-ruby-assur", label: "Pourquoi nous choisir" },
  { href: "/contact", label: "Contact" },
];

export const serviceItems = [
  {
    title: "Assurance auto",
    description:
      "Un accompagnement pour étudier votre profil, votre véhicule et les protections utiles à votre situation.",
  },
  {
    title: "Assurance habitation",
    description:
      "Des conseils pour protéger votre logement, vos biens et votre responsabilité selon votre usage réel.",
  },
  {
    title: "Santé / mutuelle",
    description:
      "Une analyse de vos besoins de remboursement et de votre budget, sans promesse standardisée.",
  },
  {
    title: "Prévoyance",
    description:
      "Des solutions à étudier pour mieux anticiper les conséquences d’un accident, d’une maladie ou d’un arrêt d’activité.",
  },
  {
    title: "Assurance emprunteur",
    description:
      "Un regard indépendant sur les besoins liés à un financement immobilier ou professionnel.",
  },
  {
    title: "Assurance professionnelle",
    description:
      "Responsabilité civile professionnelle, multirisque pro, protection de l’activité et besoins propres à votre métier.",
  },
  {
    title: "Multirisque professionnelle",
    description:
      "Une approche globale pour les locaux, le matériel, l’exploitation et les risques liés à votre activité.",
  },
  {
    title: "Autres besoins d’assurance",
    description:
      "Une première écoute pour comprendre votre demande et vous orienter vers une étude personnalisée.",
  },
];

export const insuranceOptions = [
  "Assurance auto",
  "Assurance habitation",
  "Santé / mutuelle",
  "Prévoyance",
  "Assurance emprunteur",
  "Assurance professionnelle",
  "Multirisque professionnelle",
  "Responsabilité civile professionnelle",
  "Autre besoin d’assurance",
];

export const reassuranceItems = [
  "Courtier inscrit à l’ORIAS",
  "Conseil personnalisé",
  "Courtier indépendant — Aisne",
  "Sans maniement de fonds",
];

export const chatSuggestions = [
  "Je cherche une assurance auto",
  "Je cherche une mutuelle santé",
  "Je suis professionnel",
  "Je veux être rappelé",
  "Quels documents préparer ?",
  "Où est située Ruby Assur’ ?",
] as const;

export type ChatSuggestion = (typeof chatSuggestions)[number];

export const chatReplies: Record<ChatSuggestion, string> = {
  "Je cherche une assurance auto":
    "Ruby Assur’ peut vous accompagner pour comparer des solutions d’assurance auto selon votre profil, votre véhicule et vos besoins. Pour une réponse adaptée, laissez vos coordonnées via le formulaire de contact.",
  "Je cherche une mutuelle santé":
    "Ruby Assur’ peut vous aider à clarifier vos besoins en santé et mutuelle : niveaux de remboursement, situation familiale, budget et priorités. Un échange personnalisé reste nécessaire.",
  "Je suis professionnel":
    "Ruby Assur’ accompagne aussi les professionnels pour leurs besoins d’assurance : responsabilité civile professionnelle, multirisque pro, prévoyance ou protection de l’activité. Un échange permet de mieux comprendre votre situation.",
  "Je veux être rappelé":
    "Bien sûr. Vous pouvez laisser votre nom, téléphone et type de besoin dans le formulaire de contact. Ruby Assur’ pourra ensuite vous recontacter.",
  "Quels documents préparer ?":
    "Selon votre demande, préparez idéalement vos coordonnées, le type d’assurance recherché, votre contrat actuel si vous en avez un, et quelques éléments sur votre situation. Ruby Assur’ précisera ensuite les pièces utiles.",
  "Où est située Ruby Assur’ ?":
    "Ruby Assur’ est basée au 44 avenue du Bois Roger, 02200 Pasly, à proximité de Soissons dans l’Aisne.",
};
