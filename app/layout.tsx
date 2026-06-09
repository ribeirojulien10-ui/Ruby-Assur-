import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const SITE_URL = "http://localhost:3000"; // À remplacer par le domaine réel lors du déploiement

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ruby Assur' — Courtier en assurances à Pasly & Soissons",
    template: "%s · Ruby Assur'",
  },
  description:
    "Ruby Assur', courtier en assurances à Pasly et Soissons (Aisne). Conseil clair, humain et indépendant pour vos assurances auto, habitation, santé, prévoyance et professionnelles. Demandez un devis ou un rappel.",
  keywords: [
    "Courtier assurance Pasly",
    "Courtier assurance Soissons",
    "Ruby Assur'",
    "Assurance auto",
    "Assurance habitation",
    "Mutuelle santé",
    "Assurance professionnelle",
    "Prévoyance",
    "Assurance emprunteur",
  ],
  openGraph: {
    title: "Ruby Assur' — Courtier en assurances à Pasly et Soissons",
    description:
      "Un conseil clair, humain et indépendant pour trouver une assurance adaptée à vos besoins.",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ruby Assur' — Courtier en assurances à Pasly et Soissons",
    description:
      "Un conseil clair, humain et indépendant pour trouver une assurance adaptée à vos besoins.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${manrope.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <Chatbot />
      </body>
    </html>
  );
}
