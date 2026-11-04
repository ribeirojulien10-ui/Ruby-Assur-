import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { ProductPage } from "@/components/ProductPage";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Assurance Emprunteur",
  description: "Ruby Assur' compare les offres d'assurance de prêt hors banque pour réduire le coût de votre crédit immobilier grâce à la délégation d'assurance et la loi Lemoine. Regard indépendant, devis gratuit.",
  alternates: { canonical: "/assurance-emprunteur" },
};

export default function Page() {
  const product = getProductBySlug("assurance-emprunteur");
  if (!product) notFound();
  return <ProductPage product={product} audiencePath="/particuliers" />;
}
