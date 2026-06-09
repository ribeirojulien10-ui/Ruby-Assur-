import type { Metadata } from "next";
import OriasPill from "@/components/OriasPill";
import ContactForm from "@/components/ContactForm";
import { Pin, Mail, Phone, Clock } from "@/components/Icons";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Contact & devis — Ruby Assur'",
  description:
    "Contactez Ruby Assur', courtier en assurances à Pasly et Soissons. Demandez un devis ou un rappel, sans engagement.",
};

export default function Contact() {
  return (
    <section className="block">
      <div className="wrap">
        <span className="eyebrow">Contact &amp; devis</span>
        <h2 className="sec-title">Parlons de votre besoin</h2>
        <p className="sec-intro">
          Remplissez le formulaire ou contactez-nous directement. Nous revenons
          vers vous rapidement avec des solutions adaptées.
        </p>

        <div className="contact-grid" style={{ marginTop: 46 }}>
          <div className="contact-info">
            <div className="ci">
              <div className="ico">
                <Pin size={20} />
              </div>
              <div>
                <b>Adresse</b>
                <span>
                  {company.addressLine1}
                  <br />
                  {company.addressLine2}
                </span>
              </div>
            </div>

            <div className="ci">
              <div className="ico">
                <Mail size={20} />
              </div>
              <div>
                <b>Email</b>
                <span className="placeholder">
                  {company.email} — à confirmer
                </span>
              </div>
            </div>

            <div className="ci">
              <div className="ico">
                <Phone size={20} />
              </div>
              <div>
                <b>Téléphone</b>
                <span className="placeholder">
                  +33 (0)_ __ __ __ __ — à compléter
                </span>
              </div>
            </div>

            <div className="ci">
              <div className="ico">
                <Clock size={20} />
              </div>
              <div>
                <b>Zone d&apos;intervention</b>
                <span>
                  {company.area} — et au-delà selon les contrats.
                </span>
              </div>
            </div>

            <div style={{ marginTop: 8 }}>
              <OriasPill />
            </div>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
