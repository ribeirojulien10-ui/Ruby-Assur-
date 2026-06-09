import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { ProductPage } from "@/components/ProductPage";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "Assurance Décennale" };

export default function Page() {
  const product = getProductBySlug("assurance-decennale");
  if (!product) notFound();
  return <ProductPage product={product} audiencePath="/professionnels" />;
}
