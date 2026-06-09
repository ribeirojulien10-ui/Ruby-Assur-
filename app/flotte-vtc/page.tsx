import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { ProductPage } from "@/components/ProductPage";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "Flotte & VTC" };

export default function Page() {
  const product = getProductBySlug("flotte-vtc");
  if (!product) notFound();
  return <ProductPage product={product} audiencePath="/professionnels" />;
}
