import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { ProductPage } from "@/components/ProductPage";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "Assurance Auto" };

export default function Page() {
  const product = getProductBySlug("assurance-auto");
  if (!product) notFound();
  return <ProductPage product={product} audiencePath="/particuliers" />;
}
