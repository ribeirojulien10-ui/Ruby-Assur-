import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { ProductPage } from "@/components/ProductPage";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Habitation / PNO / Scolaire",
  description: "Locataire, propriétaire occupant ou bailleur : Ruby Assur' trouve l'assurance habitation adaptée, y compris PNO et assurance scolaire. Couverture vol, incendie, dégâts des eaux. Devis gratuit.",
  alternates: { canonical: "/assurance-habitation" },
};

export default function Page() {
  const product = getProductBySlug("assurance-habitation");
  if (!product) notFound();
  return <ProductPage product={product} audiencePath="/particuliers" />;
}
