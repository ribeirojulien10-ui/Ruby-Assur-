import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Chatbot } from "@/components/Chatbot";
import { JsonLd } from "@/components/JsonLd";
import { Analytics } from "@vercel/analytics/react";
import { GoogleTag } from "@/components/GoogleTag";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

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
  return (
    <html lang="fr" className={`${inter.variable} ${manrope.variable}`}>
      <head>
        <JsonLd />
      </head>
      <body className="font-body">
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
        <Chatbot />
        <Analytics />
        <GoogleTag />
      </body>
    </html>
  );
}
