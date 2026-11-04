import type { Metadata } from "next";
import { AudiencePage } from "@/components/AudiencePage";
import { getProductsByAudience } from "@/lib/products";

export const metadata: Metadata = {
  title: "Assurances Particuliers",
  description: "Ruby Assur' vous accompagne pour toutes vos assurances particuliers : auto, habitation, mutuelle santé, assurance emprunteur. Devis gratuit.",
  alternates: { canonical: "/particuliers" },
};

const list = getProductsByAudience("particulier");

export default function Page() {
  return (
    <AudiencePage
      tone="light"
      eyebrow="Particuliers"
      title={<>Vos assurances <em>personnelles</em>.</>}
      intro="Auto, moto, habitation, santé, animaux, emprunteur… Tous profils acceptés, même les situations complexes. Ruby Assur' compare et trouve la solution adaptée."
      list={list}
      whyTitle={<>Un courtier à votre service, <em>pas à celui des assureurs</em>.</>}
      why={[
    { title: "Indépendant", text: "Aucune compagnie imposée. On compare librement pour vous." },
    { title: "Rapide", text: "Retour sous 24h après réception de votre demande." },
    { title: "Humain", text: "Un vrai interlocuteur joignable, pas un formulaire sans suite." },
    { title: "Gratuit", text: "Le recours à un courtier ne vous coûte rien." },
      ]}
    />
  );
}
