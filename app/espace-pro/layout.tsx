import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { portalEnabled } from "@/lib/portal/config";

export const metadata: Metadata = {
  title: { default: "Espace professionnel", template: "%s | Espace pro Ruby Assur'" },
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

/** Le portail est désactivé par défaut : sans PORTAL_ENABLED=true, toutes ses pages répondent 404. */
export default function EspaceProLayout({ children }: { children: React.ReactNode }) {
  if (!portalEnabled()) notFound();
  return children;
}
