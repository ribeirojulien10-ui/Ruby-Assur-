import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { ProductPage } from "@/components/ProductPage";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Auto / Moto / Trottinette",
  description: "Malussé, jeune conducteur, véhicule de collection ou trottinette électrique : Ruby Assur' compare les assurances auto et moto adaptées à chaque profil, même les situations complexes. Devis gratuit.",
  alternates: { canonical: "/assurance-auto-moto" },
};

export default function Page() {
  const product = getProductBySlug("assurance-auto-moto");
  if (!product) notFound();
  return <ProductPage product={product} audiencePath="/particuliers" />;
}
