import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { ProductPage } from "@/components/ProductPage";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Autres Risques Professionnels",
  description: "Activité spécifique ou risque atypique ? Ruby Assur' analyse votre situation et accède à des marchés spécialisés pour trouver une couverture sur mesure. Première écoute gratuite.",
  alternates: { canonical: "/autres-risques-pro" },
};

export default function Page() {
  const product = getProductBySlug("autres-risques-pro");
  if (!product) notFound();
  return <ProductPage product={product} audiencePath="/professionnels" />;
}
