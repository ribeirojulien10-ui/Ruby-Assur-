// Informations légales de l'entreprise — source unique de vérité.
// ⚠️ Les champs marqués TODO sont à compléter par Julien avant mise en ligne.

export const company = {
  name: "RUBY ASSUR'",
  display: "Ruby Assur'",
  legalForm: "SASU — Société par actions simplifiée unipersonnelle",
  capital: "1 €",
  creationDate: "03/10/2024",
  addressLine1: "44 avenue du Bois Roger",
  addressLine2: "02200 Pasly",
  get address() {
    return `${this.addressLine1}, ${this.addressLine2}`;
  },
  siren: "933 756 074",
  siret: "933 756 074 00011",
  rcs: "933 756 074 R.C.S. Soissons",
  greffe: "Soissons",
  ape: "66.22Z — Activités des agents et courtiers d'assurances",
  tva: "FR93 933 756 074",
  president: "Julien Ribeiro",
  orias: "24007878",
  oriasStatus: "Courtier en assurance, sans maniement de fonds",
  oriasDate: "22/11/2024",
  area: "Soissons et l'Aisne",

  email: "contact@rubyassur.fr",
  phone: "0671551931",
};

export const taglines = {
  primary:
    "Un conseil clair, humain et indépendant pour mieux protéger ce qui compte pour vous.",
  hero:
    "Ruby Assur', votre courtier en assurances dans l'Aisne, vous accompagne pour trouver des solutions adaptées à vos besoins personnels et professionnels.",
};
