import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { ProductPage } from "@/components/ProductPage";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Multirisque Pro",
  description: "Locaux, matériel, marchandises et responsabilité en un seul contrat : Ruby Assur' construit une multirisque professionnelle adaptée aux risques réels de votre activité. Conseil indépendant, devis gratuit.",
  alternates: { canonical: "/multirisque-pro" },
};

export default function Page() {
  const product = getProductBySlug("multirisque-pro");
  if (!product) notFound();
  return <ProductPage product={product} audiencePath="/professionnels" />;
}
