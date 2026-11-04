import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { ProductPage } from "@/components/ProductPage";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Négoce Automobile",
  description: "Négociants, mandataires et marchands de voitures d'occasion : Ruby Assur' propose des contrats spécialisés couvrant les véhicules en stock, les essais et la responsabilité professionnelle. Devis sur mesure.",
  alternates: { canonical: "/negoce-automobile" },
};

export default function Page() {
  const product = getProductBySlug("negoce-automobile");
  if (!product) notFound();
  return <ProductPage product={product} audiencePath="/professionnels" />;
}
