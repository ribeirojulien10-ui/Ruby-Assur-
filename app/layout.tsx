import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

// Titres : Fraunces (serif expressive, avec italiques) — Interface : Inter (lisibilité maximale).
const display = Fraunces({ subsets: ["latin"], variable: "--font-display", style: ["normal", "italic"], axes: ["opsz", "SOFT"], display: "swap" });
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://rubyassur.fr"),
  title: { default: "Ruby Assur' — Courtier en assurances dans l'Aisne", template: "%s | Ruby Assur'" },
  description: "Ruby Assur', courtier en assurances indépendant, ORIAS 24007878. Assurance auto, habitation, mutuelle, RC Pro, décennale. Devis gratuit et sans engagement.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://rubyassur.fr",
    siteName: "Ruby Assur'",
    title: "Ruby Assur' — Courtier en assurances dans l'Aisne",
    description: "Ruby Assur', courtier en assurances indépendant, ORIAS 24007878. Assurance auto, habitation, mutuelle, RC Pro, décennale. Devis gratuit et sans engagement.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ruby Assur' — Courtier en assurances dans l'Aisne",
    description: "Ruby Assur', courtier en assurances indépendant, ORIAS 24007878. Devis gratuit et sans engagement.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A1A35",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Mise en page racine volontairement MINIMALE : le site public (en-tête, pied de page, suivi publicitaire…)
  // vit dans app/(site)/layout.tsx ; le portail documentaire (app/espace-pro, app/documents) n'en hérite pas.
  return (
    <html lang="fr" className={`${display.variable} ${body.variable}`}>
      <body className="font-body">{children}</body>
    </html>
  );
}
