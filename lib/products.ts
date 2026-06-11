export type Audience = "particulier" | "pro";

export interface Product {
  slug: string;
  audience: Audience;
  name: string;
  tagline: string;
  description: string;
  benefits: string[];
  requiredDocuments: string[];
  faq: { question: string; answer: string }[];
}

export const products: Product[] = [

  // ─── PARTICULIERS ───────────────────────────────────────────────────────────

  {
    slug: "assurance-auto-moto",
    audience: "particulier",
    name: "Auto / Moto / Trottinette",
    tagline: "Tous profils, tous véhicules — même les situations complexes.",
    description: "Ruby Assur' accompagne tous les profils conducteurs : classique, malussé, sinistré, sans antécédents, jeune conducteur ou collection. Voitures, motos, scooters, trottinettes électriques, véhicules de collection — une solution existe pour chaque situation.",
    benefits: [
      "Profils malussés et sinistrés acceptés",
      "Assurance temporaire de 1 à 31 jours",
      "Véhicules de collection et anciens",
      "Motos, scooters, trottinettes électriques",
      "Jeunes conducteurs et permis probatoire",
      "Tous niveaux de couverture : tiers, intermédiaire, tous risques",
      "Résiliation à tout moment (loi Hamon)",
    ],
    requiredDocuments: ["Permis de conduire", "Carte grise du véhicule", "Relevé d'informations (ancien assureur)", "Bonus/malus actuel", "RIB pour prélèvement"],
    faq: [
      { question: "J'ai un malus élevé, puis-je quand même être assuré ?", answer: "Oui. Ruby Assur' travaille avec des compagnies spécialisées dans les profils à risque. Même avec un coefficient supérieur à 1,50, des solutions existent." },
      { question: "Qu'est-ce que l'assurance temporaire ?", answer: "C'est un contrat à durée courte (1 à 31 jours) utile pour un déplacement ponctuel, un test de véhicule ou un prêt entre particuliers. Il n'impacte pas votre bonus/malus principal." },
      { question: "Mon scooter ou ma trottinette électrique est-il assurable ?", answer: "Oui. Les engins de déplacement personnel motorisés (EDPM) nécessitent une assurance responsabilité civile. Ruby Assur' vous oriente vers la bonne formule." },
    ],
  },

  {
    slug: "assurance-habitation",
    audience: "particulier",
    name: "Habitation / PNO / Scolaire",
    tagline: "Votre logement et vos proches protégés, quoi qu'il arrive.",
    description: "Locataire, propriétaire occupant ou bailleur : Ruby Assur' trouve la couverture adaptée à votre situation. Assurance habitation classique, propriétaire non occupant (PNO) pour les bailleurs, et assurance scolaire pour vos enfants.",
    benefits: [
      "Habitation locataire et propriétaire occupant",
      "PNO (Propriétaire Non Occupant) pour les bailleurs",
      "Assurance scolaire et extrascolaire pour les enfants",
      "Couverture vol, incendie, dégâts des eaux",
      "Responsabilité civile vie privée incluse",
      "Garantie relogement d'urgence",
      "Résiliation facilitée en cas de déménagement",
    ],
    requiredDocuments: ["Adresse du logement", "Surface en m²", "Statut (locataire / propriétaire / bailleur)", "Liste des équipements de valeur", "Ancien contrat si résiliation"],
    faq: [
      { question: "Qu'est-ce que la PNO ?", answer: "L'assurance Propriétaire Non Occupant couvre un logement que vous louez ou laissez vacant. Elle protège votre responsabilité en tant que propriétaire, même si votre locataire est assuré." },
      { question: "L'assurance scolaire est-elle obligatoire ?", answer: "Elle n'est pas légalement obligatoire pour les activités scolaires obligatoires, mais elle est fortement conseillée et souvent demandée pour les activités périscolaires et sorties." },
      { question: "Puis-je assurer plusieurs logements ?", answer: "Oui, qu'il s'agisse d'une résidence principale, secondaire ou d'un bien locatif. Ruby Assur' peut regrouper ou séparer les contrats selon votre intérêt." },
    ],
  },

  {
    slug: "mutuelle-sante",
    audience: "particulier",
    name: "Mutuelle Santé",
    tagline: "Des remboursements adaptés à vos besoins réels.",
    description: "Optique, dentaire, hospitalisation : Ruby Assur' analyse vos habitudes de santé pour vous orienter vers la mutuelle qui couvre vraiment ce qui compte pour vous. Formules individuelles, familiales et seniors.",
    benefits: [
      "Analyse personnalisée de vos besoins",
      "Formules individuelles, familiales et seniors",
      "Tiers payant chez le médecin",
      "Remboursements optique et dentaire renforcés",
      "Délais de carence négociés",
    ],
    requiredDocuments: ["Carte Vitale", "Attestation Ameli (droits Sécu)", "Relevé des dépenses santé actuelles", "Ancien contrat mutuelle si résiliation"],
    faq: [
      { question: "Quelle différence entre mutuelle et prévoyance ?", answer: "La mutuelle rembourse vos frais de santé (médecin, pharmacie, optique…). La prévoyance vous protège en cas d'arrêt de travail, d'invalidité ou de décès." },
      { question: "Puis-je inclure mes enfants dans mon contrat ?", answer: "Oui, la plupart des contrats permettent d'ajouter des ayants droit (conjoint, enfants) avec une cotisation adaptée." },
      { question: "Y a-t-il un délai avant d'être couvert ?", answer: "Les délais de carence varient selon les formules. Ruby Assur' négocie pour les réduire ou les supprimer selon votre profil." },
    ],
  },

  {
    slug: "assurance-animaux",
    audience: "particulier",
    name: "Assurance Chien / Chat",
    tagline: "Protégez votre animal avec une couverture vétérinaire adaptée.",
    description: "Les frais vétérinaires peuvent rapidement devenir très élevés. Ruby Assur' compare les contrats d'assurance animaux pour couvrir les soins courants, les accidents et les maladies de votre chien ou chat.",
    benefits: [
      "Remboursement des frais vétérinaires",
      "Couverture accidents et maladies",
      "Soins courants et hospitalisations",
      "Responsabilité civile incluse (selon formule)",
      "Formules adaptées à l'âge et à la race",
    ],
    requiredDocuments: ["Carnet de santé de l'animal", "Race, âge et poids", "Attestation de vaccination à jour", "Numéro de tatouage ou puce électronique"],
    faq: [
      { question: "À partir de quel âge peut-on assurer son animal ?", answer: "La plupart des contrats acceptent les animaux dès 2 mois. Certains assureurs posent une limite d'âge à l'entrée (souvent 8-10 ans)." },
      { question: "Les maladies préexistantes sont-elles couvertes ?", answer: "Généralement non. Les conditions antérieures à la souscription sont souvent exclues. Il est conseillé d'assurer son animal le plus tôt possible." },
      { question: "La responsabilité civile est-elle incluse ?", answer: "Elle peut être intégrée ou optionnelle selon les contrats. Ruby Assur' vérifie ce point lors de la comparaison." },
    ],
  },

  {
    slug: "assurance-emprunteur",
    audience: "particulier",
    name: "Assurance Emprunteur",
    tagline: "Protégez votre crédit immobilier au meilleur tarif.",
    description: "L'assurance emprunteur représente souvent des milliers d'euros d'économies possibles. Ruby Assur' compare les offres hors banque pour vous faire réaliser des économies sur toute la durée de votre prêt.",
    benefits: [
      "Délégation d'assurance possible (loi Lemoine)",
      "Économies significatives vs contrat bancaire",
      "Couverture DC, PTIA, ITT, IPT selon besoin",
      "Accompagnement pour la substitution",
      "Réponse rapide pour ne pas bloquer votre crédit",
    ],
    requiredDocuments: ["Offre de prêt bancaire", "Tableau d'amortissement", "Questionnaire médical (selon couverture)", "Relevé d'identité bancaire"],
    faq: [
      { question: "Puis-je changer d'assurance emprunteur en cours de crédit ?", answer: "Oui, depuis la loi Lemoine (2022), vous pouvez résilier et changer à tout moment, sans frais, à condition que le nouveau contrat offre des garanties équivalentes." },
      { question: "Qu'est-ce que la délégation d'assurance ?", answer: "C'est le droit de souscrire votre assurance emprunteur auprès d'un autre assureur que votre banque. Cela peut générer 20 à 50 % d'économies." },
      { question: "Le questionnaire médical est-il obligatoire ?", answer: "Depuis la loi Lemoine, pour les prêts inférieurs à 200 000 € remboursés avant 60 ans, il n'est plus obligatoire." },
    ],
  },

  // ─── PROFESSIONNELS ─────────────────────────────────────────────────────────

  {
    slug: "multirisque-pro",
    audience: "pro",
    name: "Multirisque Professionnelle",
    tagline: "Protégez vos locaux, votre matériel et votre activité en une seule formule.",
    description: "La multirisque professionnelle regroupe en un seul contrat la protection de vos locaux, de votre matériel, de vos marchandises et votre responsabilité, pour une gestion simplifiée.",
    benefits: [
      "Protection des locaux (incendie, dégâts des eaux, vol)",
      "Couverture du matériel et des stocks",
      "Perte d'exploitation incluse selon formule",
      "RC exploitation intégrée",
      "Un seul interlocuteur pour tous vos sinistres",
    ],
    requiredDocuments: ["Kbis ou extrait SIREN", "Adresse et surface des locaux", "Valeur du matériel et des stocks", "Chiffre d'affaires N-1", "Historique sinistres 3 ans"],
    faq: [
      { question: "La perte d'exploitation est-elle toujours incluse ?", answer: "Pas automatiquement. C'est une option importante qui couvre le manque à gagner si votre activité est interrompue après un sinistre." },
      { question: "Mon matériel hors des locaux est-il couvert ?", answer: "Cela dépend des clauses. Des extensions peuvent couvrir le matériel en déplacement, sur chantier ou chez le client." },
      { question: "Puis-je assurer des locaux en location ?", answer: "Oui, que vous soyez propriétaire ou locataire de vos locaux professionnels, une multirisque pro peut être souscrite." },
    ],
  },

  {
    slug: "negoce-automobile",
    audience: "pro",
    name: "Négoce Automobile",
    tagline: "Assurance dédiée aux professionnels de la vente de véhicules.",
    description: "Ruby Assur' accompagne les négociants automobiles, mandataires et marchands de voitures d'occasion avec des contrats spécialisés couvrant les véhicules en stock, les essais et la responsabilité professionnelle.",
    benefits: [
      "Couverture des véhicules en stock",
      "Garantie lors des essais par les clients",
      "Responsabilité civile professionnelle incluse",
      "Protection contre le vol et l'incendie sur parc",
      "Contrats adaptés aux petits et grands stocks",
    ],
    requiredDocuments: ["Kbis", "Carte professionnelle de commerçant en véhicules", "Liste des véhicules en stock", "Surface du parc automobile", "Historique sinistres 3 ans"],
    faq: [
      { question: "Les essais clients sont-ils couverts ?", answer: "Oui, à condition que le contrat incluse une clause essais. Ruby Assur' vérifie ce point systématiquement lors de la souscription." },
      { question: "Puis-je assurer un stock variable ?", answer: "Oui, certains contrats s'adaptent au stock moyen ou à la valeur déclarée. Ruby Assur' trouve la formule la plus souple pour votre activité." },
      { question: "Un véhicule en réparation dans mon garage est-il couvert ?", answer: "Cela dépend des clauses. Une extension atelier peut être ajoutée pour couvrir les véhicules confiés par des tiers." },
    ],
  },

  {
    slug: "rc-pro",
    audience: "pro",
    name: "Responsabilité Civile Pro",
    tagline: "Protégez votre activité contre les erreurs et les dommages causés à vos clients.",
    description: "La RC Pro couvre les dommages matériels, corporels ou immatériels causés à des tiers dans le cadre de votre activité professionnelle. Indispensable pour exercer sereinement.",
    benefits: [
      "Couverture des dommages causés aux clients",
      "Défense juridique incluse",
      "Adaptée à chaque secteur d'activité",
      "Mise en conformité rapide pour les appels d'offres",
      "Attestation d'assurance délivrée sous 48h",
    ],
    requiredDocuments: ["Kbis ou extrait SIREN", "Description précise de l'activité", "Chiffre d'affaires N-1 ou prévisionnel", "Historique sinistres (3 ans)"],
    faq: [
      { question: "La RC Pro est-elle obligatoire ?", answer: "Elle est obligatoire pour certaines professions réglementées (avocats, architectes, agents immobiliers…). Pour les autres, elle est fortement recommandée." },
      { question: "Quelle différence avec la RC exploitation ?", answer: "La RC exploitation couvre les dommages liés à l'exploitation. La RC Pro couvre les dommages liés aux prestations fournies à vos clients." },
      { question: "Suis-je couvert à l'étranger ?", answer: "Cela dépend des clauses. Ruby Assur' peut négocier une couverture internationale si votre activité le nécessite." },
    ],
  },

  {
    slug: "sante-prevoyance-pro",
    audience: "pro",
    name: "Santé & Prévoyance Pro",
    tagline: "Protégez votre santé et vos revenus en cas d'arrêt d'activité.",
    description: "En tant que professionnel, votre protection sociale est souvent insuffisante. Ruby Assur' met en place une complémentaire santé adaptée à votre statut et une prévoyance pour maintenir vos revenus en cas d'arrêt, d'invalidité ou de décès.",
    benefits: [
      "Complémentaire santé adaptée TNS ou salarié",
      "Prévoyance maintien de revenus en cas d'arrêt",
      "Couverture invalidité et décès",
      "Mutuelle collective pour vos salariés",
      "Déductible fiscalement selon statut",
    ],
    requiredDocuments: ["Kbis ou SIREN", "Statut (TNS, gérant, salarié)", "Nombre de salariés si applicable", "Relevé de protection sociale actuelle"],
    faq: [
      { question: "Un TNS est-il bien couvert par la Sécu ?", answer: "Non, la protection sociale des travailleurs non-salariés est nettement inférieure à celle des salariés. Une prévoyance complémentaire est indispensable." },
      { question: "La mutuelle collective est-elle obligatoire ?", answer: "Oui, dès le premier salarié en CDI. L'employeur doit participer à hauteur de 50 % minimum de la cotisation." },
      { question: "Puis-je déduire les cotisations de mon revenu imposable ?", answer: "Oui, dans le cadre de la loi Madelin pour les TNS. Ruby Assur' vous accompagne pour optimiser votre situation." },
    ],
  },

  {
    slug: "assurance-decennale",
    audience: "pro",
    name: "Assurance Décennale",
    tagline: "Obligatoire pour les professionnels du bâtiment, on s'en charge.",
    description: "La garantie décennale couvre pendant 10 ans les dommages compromettant la solidité de l'ouvrage ou le rendant inhabitable. Obligatoire avant tout chantier.",
    benefits: [
      "Obligatoire pour tous les artisans du bâtiment",
      "Couverture 10 ans après réception des travaux",
      "Mise en jeu sans attendre une décision de justice",
      "Valable pour tous les corps de métier",
      "Attestation rapide pour démarrer les chantiers",
    ],
    requiredDocuments: ["Kbis ou extrait SIREN", "Qualification professionnelle (Qualibat, RGE…)", "Description des travaux réalisés", "Chiffre d'affaires N-1 ou prévisionnel", "Historique sinistres décennaux"],
    faq: [
      { question: "Qui est concerné par la décennale ?", answer: "Tout professionnel du bâtiment (artisan, auto-entrepreneur, société) qui réalise des travaux de construction, rénovation ou extension." },
      { question: "Que se passe-t-il si je n'ai pas de décennale ?", answer: "L'exercice sans décennale est illégal. En cas de sinistre, vous seriez personnellement responsable des réparations sur 10 ans." },
      { question: "La décennale couvre-t-elle mes sous-traitants ?", answer: "Non. Chaque intervenant doit être couvert par sa propre décennale. Exigez toujours l'attestation de vos sous-traitants." },
    ],
  },

  {
    slug: "autres-risques-pro",
    audience: "pro",
    name: "Autres Risques Professionnels",
    tagline: "Votre activité est spécifique ? Ruby Assur' trouve la solution.",
    description: "Certains secteurs d'activité nécessitent des couvertures sur-mesure difficiles à trouver en ligne. Ruby Assur' analyse votre situation et accède à des marchés spécialisés pour les risques atypiques ou complexes.",
    benefits: [
      "Analyse personnalisée de votre activité",
      "Accès aux marchés spécialisés et compagnies expertes",
      "Risques difficiles à placer ou refusés ailleurs",
      "Couvertures sur-mesure pour secteurs atypiques",
      "Accompagnement dans la durée",
    ],
    requiredDocuments: ["Kbis ou extrait SIREN", "Description détaillée de l'activité", "Chiffre d'affaires N-1", "Historique sinistres 3 ans", "Contrats en cours si résiliation"],
    faq: [
      { question: "Mon activité est très spécifique, puis-je quand même être assuré ?", answer: "Oui. Ruby Assur' a accès à des compagnies spécialisées sur les risques non standards. Décrivez votre activité et nous trouvons une solution." },
      { question: "J'ai été refusé par d'autres assureurs, que faire ?", answer: "Un refus d'assurance ne signifie pas qu'aucune solution n'existe. Ruby Assur' peut accéder à des marchés alternatifs adaptés aux profils complexes." },
      { question: "Combien de temps faut-il pour trouver une couverture sur-mesure ?", answer: "Cela dépend de la complexité du risque. En général, Ruby Assur' revient avec une réponse sous 48 à 72 heures." },
    ],
  },
];

export function getProductsByAudience(audience: Audience): Product[] {
  return products.filter((p) => p.audience === audience);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export const allSlugs = products.map((p) => p.slug);
