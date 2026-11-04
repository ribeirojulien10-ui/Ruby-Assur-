import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { ProductPage } from "@/components/ProductPage";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Mutuelle Santé",
  description: "Ruby Assur' compare les mutuelles santé selon vos besoins de remboursement, votre situation familiale et votre budget. Conseil indépendant, sans promesse standardisée. Devis gratuit.",
  alternates: { canonical: "/mutuelle-sante" },
};

export default function Page() {
  const product = getProductBySlug("mutuelle-sante");
  if (!product) notFound();
  return <ProductPage product={product} audiencePath="/particuliers" />;
}
