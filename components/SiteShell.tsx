import { Analytics } from "@vercel/analytics/react";
import { Chatbot } from "@/components/Chatbot";
import { Footer } from "@/components/Footer";
import { GoogleTag } from "@/components/GoogleTag";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { WhatsAppButton } from "@/components/WhatsAppButton";

/** Coquille du site PUBLIC. Le portail documentaire n'utilise pas cette coquille (ni suivi, ni chatbot). */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#contenu"
        className="sr-only z-[100] rounded-md bg-night px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Aller au contenu
      </a>
      <JsonLd />
      <Header />
      <main id="contenu">{children}</main>
      <Footer />
      <WhatsAppButton />
      <Chatbot />
      <Analytics />
      <GoogleTag />
    </>
  );
}
