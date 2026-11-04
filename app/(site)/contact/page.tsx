import type { Metadata } from "next";
import { QuoteForm } from "@/components/QuoteForm";
import { BookingButton } from "@/components/BookingEmbed";
import { CalendarDays, Clock, Mail, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact — Demande de devis gratuit",
  description: "Contactez Ruby Assur' pour une demande de devis gratuit en assurance auto, habitation, mutuelle, RC Pro et plus. Réponse sous 24h.",
  alternates: { canonical: "/contact" },
};

const phone = process.env.NEXT_PUBLIC_PHONE ?? "0671551931";
const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@rubyassur.fr";

const fmtPhone = (p: string) => p.replace(/(\d{2})(?=\d)/g, "$1 ").trim();

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 border-t border-night/10 py-5 first:border-t-0 first:pt-0">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-night text-champagne" aria-hidden="true">{icon}</span>
      <div>
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-champagne-ink">{label}</p>
        <div className="mt-0.5 text-[1.05rem] font-semibold text-night">{children}</div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ivory">
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-40 h-[32rem] w-[32rem] rounded-full border border-champagne/30" />
        <div className="mx-auto w-full max-w-page px-gutter pb-14 pt-14 lg:pb-20 lg:pt-20">
          <p className="eyebrow">Contact</p>
          <h1 className="display mt-5 max-w-3xl text-display-lg text-night">
            Demandez votre <em>devis gratuit</em>.
          </h1>
          <p className="mt-6 max-w-2xl text-lead text-ink-soft">
            Décrivez votre besoin et Ruby Assur&apos; vous recontacte rapidement. Gratuit, sans engagement.
          </p>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="mx-auto grid w-full max-w-page gap-12 px-gutter lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <p className="eyebrow">Nos coordonnées</p>
            <h2 className="display mt-4 text-display-sm text-night">Ruby Assur&apos;</h2>
            <div className="mt-8">
              <Row icon={<Phone className="h-5 w-5" />} label="Téléphone">
                <a href={`tel:${phone}`} className="transition hover:text-champagne-ink">{fmtPhone(phone)}</a>
              </Row>
              <Row icon={<Mail className="h-5 w-5" />} label="E-mail">
                <a href={`mailto:${email}`} className="break-all transition hover:text-champagne-ink">{email}</a>
              </Row>
              <Row icon={<Clock className="h-5 w-5" />} label="Délai de réponse">Sous 24 h en jours ouvrés</Row>
            </div>

            <div className="mt-8 rounded-xl bg-ivory p-6">
              <div className="flex items-center gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-night text-champagne" aria-hidden="true">
                  <CalendarDays className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-night">Prendre rendez-vous</p>
                  <p className="text-[0.88rem] text-ink-muted">Choisissez un créneau directement</p>
                </div>
              </div>
              <BookingButton label="Choisir un créneau" className="mt-5 w-full" />
            </div>

            <p className="mt-6 text-[0.88rem] leading-6 text-ink-muted">
              <span className="font-semibold text-night">ORIAS 24007878</span> — SIREN 933 756 074 — SASU Ruby Assur&apos;
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-card sm:p-8 lg:col-span-7">
            <h2 className="display text-display-sm text-night">Votre demande</h2>
            <div className="mt-6">
              <QuoteForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
