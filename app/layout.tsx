import type { Metadata } from "next";
import "./globals.css";
import { Chatbot } from "@/components/Chatbot";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "Ruby Assur’ - Courtier en assurances à Pasly et Soissons",
    template: "%s | Ruby Assur’",
  },
  description:
    "Ruby Assur’ accompagne particuliers et professionnels à Pasly, Soissons et dans l’Aisne pour leurs besoins d’assurance auto, habitation, santé, prévoyance, emprunteur et professionnelle.",
  keywords: [
    "Courtier assurance Pasly",
    "Courtier assurance Soissons",
    "Ruby Assur’",
    "Assurance auto",
    "Assurance habitation",
    "Mutuelle santé",
    "Assurance professionnelle",
    "Prévoyance",
    "Assurance emprunteur",
  ],
  openGraph: {
    title: "Ruby Assur’ - Courtier en assurances à Pasly et Soissons",
    description:
      "Un conseil clair, humain et indépendant pour trouver une assurance adaptée à vos besoins.",
    images: ["/images/hero-ruby-assur.png"],
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <Chatbot />
      </body>
    </html>
  );
}
