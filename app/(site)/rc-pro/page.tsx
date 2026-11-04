import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { ProductPage } from "@/components/ProductPage";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "RC Pro",
  description: "Ruby Assur' compare les garanties de responsabilité civile professionnelle pour couvrir les dommages causés à vos clients dans le cadre de votre activité. Adaptée aux indépendants et TPE. Devis gratuit.",
  alternates: { canonical: "/rc-pro" },
};

export default function Page() {
  const product = getProductBySlug("rc-pro");
  if (!product) notFound();
  return <ProductPage product={product} audiencePath="/professionnels" />;
}
