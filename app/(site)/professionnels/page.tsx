import type { Metadata } from "next";
import { AudiencePage } from "@/components/AudiencePage";
import { getProductsByAudience } from "@/lib/products";

export const metadata: Metadata = {
  title: "Assurances Professionnels",
  description: "Ruby Assur' accompagne les professionnels : RC Pro, décennale, flotte VTC, multirisque pro, création d'entreprise. Devis gratuit.",
  alternates: { canonical: "/professionnels" },
};

const list = getProductsByAudience("pro");

export default function Page() {
  return (
    <AudiencePage
      tone="dark"
      eyebrow="Professionnels"
      title={<>Vos assurances <em>professionnelles</em>.</>}
      intro="RC Pro, décennale, flotte, multirisque : Ruby Assur' vous aide à protéger votre activité avec les bonnes garanties, aux meilleurs tarifs."
      list={list}
      whyTitle={<>Un courtier qui connaît <em>votre activité</em>.</>}
      why={[
    { title: "Indépendant", text: "Aucune compagnie imposée. On compare librement le marché pour vous." },
    { title: "Réactif", text: "Retour sous 24h. Pas de délai administratif inutile." },
    { title: "Dédié pro", text: "Connaissance des spécificités des contrats professionnels." },
    { title: "Gratuit", text: "Le courtier est rémunéré par les assureurs, pas par vous." },
      ]}
    />
  );
}
