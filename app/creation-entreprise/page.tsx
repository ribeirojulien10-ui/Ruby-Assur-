import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { ProductPage } from "@/components/ProductPage";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "Pack Création d'Entreprise" };

export default function Page() {
  const product = getProductBySlug("creation-entreprise");
  if (!product) notFound();
  return <ProductPage product={product} audiencePath="/professionnels" />;
}
