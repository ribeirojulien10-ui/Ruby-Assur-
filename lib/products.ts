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
  // PARTICULIERS
  {
    slug: "assurance-auto",
    audience: "particulier",
    name: "Assurance Auto",
    tagline: "Protégez votre véhicule au meilleur rapport qualité/prix.",
    description: "Ruby Assur' compare les offres des compagnies pour vous proposer une couverture adaptée à votre profil de conducteur, votre véhicule et votre usage.",
    benefits: ["Comparaison multi-compagnies", "Formules tous risques, tiers ou intermédiaire", "Assistance 0 km incluse selon formule", "Accompagnement en cas de sinistre", "Résiliation à tout moment (loi Hamon)"],
    requiredDocuments: ["Permis de conduire", "Carte grise du véhicule", "Relevé d'informations (ancien assureur)", "RIB pour prélèvement", "Bonus/malus actuel"],
    faq: [
      { question: "Puis-je changer d'assureur en cours d'année ?", answer: "Oui, depuis la loi Hamon vous pouvez résilier à tout moment après un an de contrat. Ruby Assur' s'occupe des démarches à votre place." },
      { question: "Que couvre l'assurance tous risques ?", answer: "Elle couvre votre responsabilité civile, les dommages à votre véhicule (accident, vol, incendie, bris de glace) et souvent une protection du conducteur." },
      { question: "Mon bonus est-il pris en compte ?", answer: "Absolument. Votre relevé d'informations indique votre coefficient bonus-malus, qui influe directement sur votre prime." },
    ],
  },
  {
    slug: "assurance-habitation",
    audience: "particulier",
    name: "Assurance Habitation",
    tagline: "Votre logement protégé, quoi qu'il arrive.",
    description: "Que vous soyez locataire, propriétaire ou en colocation, Ruby Assur' vous aide à trouver la garantie habitation qui correspond vraiment à votre situation.",
    benefits: ["Couverture vol, incendie, dégâts des eaux", "Responsabilité civile vie privée incluse", "Protection des objets de valeur", "Garantie relogement d'urgence", "Résiliation facilitée en cas de déménagement"],
    requiredDocuments: ["Adresse du logement", "Surface en m²", "Statut (locataire / propriétaire)", "Liste des équipements de valeur", "Ancien contrat si résiliation"],
    faq: [
      { question: "L'assurance habitation est-elle obligatoire ?", answer: "Elle est obligatoire pour les locataires. Pour les propriétaires occupants, elle est fortement recommandée mais pas légalement obligatoire." },
      { question: "Que faire en cas de dégât des eaux ?", answer: "Prévenez Ruby Assur' dès que possible. Nous vous guidons dans les démarches et l'ouverture du sinistre auprès de l'assureur." },
      { question: "Puis-je assurer une résidence secondaire ?", answer: "Oui, votre résidence secondaire peut être assurée séparément ou parfois incluse dans votre contrat principal. Demandez une étude personnalisée." },
    ],
  },
  {
    slug: "mutuelle-sante",
    audience: "particulier",
    name: "Mutuelle Santé",
    tagline: "Des remboursements adaptés à vos besoins réels.",
    description: "Optique, dentaire, hospitalisation : Ruby Assur' analyse vos habitudes de santé pour vous orienter vers la mutuelle qui couvre vraiment ce qui compte pour vous.",
    benefits: ["Analyse personnalisée de vos besoins", "Formules individuelles, familiales et seniors", "Tiers payant chez le médecin", "Remboursements optique et dentaire renforcés", "Délais de carence négociés"],
    requiredDocuments: ["Carte Vitale", "Attestation Ameli (droits Sécu)", "Relevé des dépenses santé actuelles", "Ancien contrat mutuelle si résiliation"],
    faq: [
      { question: "Quelle différence entre mutuelle et prévoyance ?", answer: "La mutuelle rembourse vos frais de santé (médecin, pharmacie, optique…). La prévoyance vous protège en cas d'arrêt de travail, d'invalidité ou de décès." },
      { question: "Puis-je inclure mes enfants dans mon contrat ?", answer: "Oui, la plupart des contrats permettent d'ajouter des ayants droit (conjoint, enfants) avec une cotisation adaptée." },
      { question: "Y a-t-il un délai avant d'être couvert ?", answer: "Les délais de carence varient selon les formules et les garanties. Ruby Assur' négocie pour les réduire ou les supprimer selon votre profil." },
    ],
  },
  {
    slug: "assurance-emprunteur",
    audience: "particulier",
    name: "Assurance Emprunteur",
    tagline: "Protégez votre crédit immobilier au meilleur tarif.",
    description: "L'assurance emprunteur est souvent négligée mais peut représenter des milliers d'euros d'économies. Ruby Assur' compare les offres pour vous faire choisir hors de la banque.",
    benefits: ["Délégation d'assurance possible (loi Lemoine)", "Économies significatives vs contrat bancaire", "Couverture DC, PTIA, ITT, IPT selon besoin", "Accompagnement pour la substitution", "Réponse rapide pour ne pas bloquer votre crédit"],
    requiredDocuments: ["Offre de prêt bancaire", "Tableau d'amortissement", "Questionnaire médical (selon couverture)", "Relevé d'identité bancaire"],
    faq: [
      { question: "Puis-je changer d'assurance emprunteur en cours de crédit ?", answer: "Oui, depuis la loi Lemoine (2022), vous pouvez résilier et changer à tout moment, sans frais, à condition que le nouveau contrat offre des garanties équivalentes." },
      { question: "Qu'est-ce que la délégation d'assurance ?", answer: "C'est le droit de souscrire votre assurance emprunteur auprès d'un autre assureur que votre banque. Cela peut générer 20 à 50 % d'économies." },
      { question: "Le questionnaire médical est-il obligatoire ?", answer: "Depuis la loi Lemoine, pour les prêts inférieurs à 200 000 € remboursés avant 60 ans, il n'est plus obligatoire." },
    ],
  },
  // PROFESSIONNELS
  {
    slug: "rc-pro",
    audience: "pro",
    name: "Responsabilité Civile Pro",
    tagline: "Protégez votre activité contre les erreurs et les dommages causés à vos clients.",
    description: "La RC Pro couvre les dommages matériels, corporels ou immatériels causés à des tiers dans le cadre de votre activité professionnelle. Indispensable pour exercer sereinement.",
    benefits: ["Couverture des dommages causés aux clients", "Défense juridique incluse", "Adaptée à chaque secteur d'activité", "Mise en conformité rapide pour les appels d'offres", "Attestation d'assurance délivrée sous 48h"],
    requiredDocuments: ["Kbis ou extrait SIREN", "Description précise de l'activité", "Chiffre d'affaires N-1 ou prévisionnel", "Historique sinistres (3 ans)"],
    faq: [
      { question: "La RC Pro est-elle obligatoire ?", answer: "Elle est obligatoire pour certaines professions réglementées (avocats, architectes, agents immobiliers…). Pour les autres, elle est fortement recommandée." },
      { question: "Quelle différence avec la RC exploitation ?", answer: "La RC exploitation couvre les dommages liés à l'exploitation de votre entreprise. La RC Pro couvre les dommages liés aux prestations fournies à vos clients." },
      { question: "Suis-je couvert à l'étranger ?", answer: "Cela dépend des clauses de votre contrat. Ruby Assur' peut négocier une couverture internationale si votre activité le nécessite." },
    ],
  },
  {
    slug: "assurance-decennale",
    audience: "pro",
    name: "Assurance Décennale",
    tagline: "Obligatoire pour les professionnels du bâtiment, on s'en charge.",
    description: "La garantie décennale couvre pendant 10 ans les dommages compromettant la solidité de l'ouvrage ou le rendant inhabitable. Obligatoire avant tout chantier.",
    benefits: ["Obligatoire pour tous les artisans du bâtiment", "Couverture 10 ans après réception des travaux", "Mise en jeu sans attendre une décision de justice", "Valable pour tous les corps de métier (maçon, électricien, plombier…)", "Attestation rapide pour démarrer les chantiers"],
    requiredDocuments: ["Kbis ou extrait SIREN", "Qualification professionnelle (Qualibat, RGE…)", "Description des travaux réalisés", "Chiffre d'affaires N-1 ou prévisionnel", "Historique sinistres décennaux"],
    faq: [
      { question: "Qui est concerné par la décennale ?", answer: "Tout professionnel du bâtiment (artisan, auto-entrepreneur, société) qui réalise des travaux de construction, rénovation ou extension est concerné." },
      { question: "Que se passe-t-il si je n'ai pas de décennale ?", answer: "L'exercice sans décennale est illégal. En cas de sinistre, vous seriez personnellement responsable des réparations, parfois sur plusieurs décennies." },
      { question: "La décennale couvre-t-elle mes sous-traitants ?", answer: "Non. Chaque intervenant doit être couvert par sa propre décennale. Exigez toujours l'attestation de vos sous-traitants." },
    ],
  },
  {
    slug: "flotte-vtc",
    audience: "pro",
    name: "Flotte & VTC",
    tagline: "Une couverture dédiée aux flottes de véhicules et aux chauffeurs VTC.",
    description: "Ruby Assur' propose des contrats spécialisés pour les flottes d'entreprise et les chauffeurs VTC/LOTI, avec des garanties adaptées à l'usage professionnel intensif.",
    benefits: ["Contrat flotte pour 2 véhicules et plus", "Couverture spécifique VTC/LOTI", "Gestion centralisée des sinistres", "Remplacement de véhicule en cas d'immobilisation", "Tarif dégressif selon taille de flotte"],
    requiredDocuments: ["Liste des véhicules (immatriculations, carte grise)", "Licence de transport (VTC/LOTI)", "Relevé d'informations de chaque véhicule", "Historique sinistres 3 ans", "Kbis de l'entreprise"],
    faq: [
      { question: "À partir de combien de véhicules peut-on faire un contrat flotte ?", answer: "Généralement à partir de 2-3 véhicules. Un contrat flotte simplifie la gestion et peut générer des économies sur chaque véhicule." },
      { question: "Les chauffeurs salariés sont-ils couverts ?", answer: "Oui, le contrat flotte peut couvrir tous les conducteurs autorisés. Nous précisons les conditions lors de l'étude de votre besoin." },
      { question: "Que couvre une assurance VTC spécifique ?", answer: "Elle couvre l'usage professionnel (transport de personnes à titre onéreux), souvent exclu des contrats auto classiques." },
    ],
  },
  {
    slug: "multirisque-pro",
    audience: "pro",
    name: "Multirisque Pro",
    tagline: "Protégez vos locaux, votre matériel et votre activité en une seule formule.",
    description: "La multirisque professionnelle regroupe en un seul contrat la protection de vos locaux, de votre matériel, de vos marchandises et votre responsabilité, pour une gestion simplifiée.",
    benefits: ["Protection des locaux (incendie, dégâts des eaux, vol)", "Couverture du matériel et des stocks", "Perte d'exploitation incluse selon formule", "RC exploitation intégrée", "Un seul interlocuteur pour tous vos sinistres"],
    requiredDocuments: ["Kbis ou extrait SIREN", "Adresse et surface des locaux", "Valeur du matériel et des stocks", "Chiffre d'affaires N-1", "Historique sinistres 3 ans"],
    faq: [
      { question: "La perte d'exploitation est-elle toujours incluse ?", answer: "Pas automatiquement. C'est une option importante qui couvre le manque à gagner si votre activité est interrompue après un sinistre. Ruby Assur' vous recommande de l'intégrer." },
      { question: "Mon matériel hors des locaux est-il couvert ?", answer: "Cela dépend des clauses. Des extensions peuvent couvrir le matériel en déplacement, sur chantier ou chez le client." },
      { question: "Puis-je assurer des locaux en location ?", answer: "Oui, que vous soyez propriétaire ou locataire de vos locaux professionnels, une multirisque pro peut être souscrite." },
    ],
  },
  {
    slug: "creation-entreprise",
    audience: "pro",
    name: "Pack Création d'Entreprise",
    tagline: "Lancez-vous sereinement avec les bonnes protections dès le départ.",
    description: "Ruby Assur' accompagne les créateurs d'entreprise pour mettre en place les assurances obligatoires et recommandées dès le lancement : RC Pro, décennale si besoin, mutuelle collective, prévoyance dirigeant.",
    benefits: ["Audit des besoins spécifiques à votre activité", "Mise en conformité rapide", "Mutuelle collective obligatoire si vous embauchez", "Prévoyance dirigeant pour protéger votre famille", "Accompagnement dans la durée"],
    requiredDocuments: ["Statuts de la société ou extrait Kbis", "Description de l'activité projetée", "Prévisionnel financier", "Nombre de salariés prévus"],
    faq: [
      { question: "Quelles assurances sont obligatoires à la création ?", answer: "Cela dépend de votre secteur. RC Pro pour les professions réglementées, décennale pour le bâtiment, mutuelle collective si vous avez des salariés. Ruby Assur' fait le point avec vous." },
      { question: "Puis-je souscrire en tant qu'auto-entrepreneur ?", answer: "Oui. Les auto-entrepreneurs ont les mêmes obligations que les sociétés pour certaines assurances professionnelles." },
      { question: "Quand dois-je souscrire mes assurances ?", answer: "Idéalement avant de démarrer votre activité. Certaines assurances doivent être actives avant le premier chantier ou la première prestation." },
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
