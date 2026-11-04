import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { ProductPage } from "@/components/ProductPage";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Santé & Prévoyance Pro",
  description: "Complémentaire santé et prévoyance pour TNS, indépendants et entreprises : Ruby Assur' étudie vos garanties santé, arrêt de travail, invalidité et maintien de revenu. Conseil indépendant, devis gratuit.",
  alternates: { canonical: "/sante-prevoyance-pro" },
};

export default function Page() {
  const product = getProductBySlug("sante-prevoyance-pro");
  if (!product) notFound();
  return <ProductPage product={product} audiencePath="/professionnels" />;
}
