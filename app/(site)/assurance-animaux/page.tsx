import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { ProductPage } from "@/components/ProductPage";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Assurance Chien / Chat",
  description: "Frais vétérinaires, accidents, maladies : Ruby Assur' compare les assurances santé pour chien et chat afin de protéger votre animal et votre budget. Devis gratuit.",
  alternates: { canonical: "/assurance-animaux" },
};

export default function Page() {
  const product = getProductBySlug("assurance-animaux");
  if (!product) notFound();
  return <ProductPage product={product} audiencePath="/particuliers" />;
}
