import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { legalInfo } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact et demande de devis",
  description:
    "Contactez Ruby Assur’ à Pasly près de Soissons pour une demande de rappel ou une première orientation en assurance.",
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-ruby-frost py-16">
        <div className="section-shell max-w-4xl">
          <p className="eyebrow">Contact / Demande de devis</p>
          <h1 className="mt-3 text-4xl font-semibold text-ruby-navy sm:text-5xl">Demander un rappel</h1>
          <p className="mt-5 text-lg leading-8 text-slate-700">
            Présentez brièvement votre besoin. Le formulaire est actuellement en mode démonstration et n’envoie aucun email.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="rounded-lg border border-ruby-line bg-ruby-sand p-6">
            <h2 className="text-xl font-semibold text-ruby-navy">Ruby Assur’</h2>
            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-700">
              <p>{legalInfo.address}</p>
              <p>ORIAS : {legalInfo.orias}</p>
              <p>{legalInfo.status}</p>
              <p>
                Les informations transmises via cette version locale ne sont pas envoyées. Une connexion future pourra
                être prévue vers Resend, Brevo, Formspree ou une API email.
              </p>
            </div>
          </aside>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
