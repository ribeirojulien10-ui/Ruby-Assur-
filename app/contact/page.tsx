import type { Metadata } from "next";
import { QuoteForm } from "@/components/QuoteForm";
import { BookingButton } from "@/components/BookingEmbed";
import { Phone, Mail, MapPin, Clock, CalendarDays } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact — Demande de devis gratuit",
  description: "Contactez Ruby Assur' pour une demande de devis gratuit en assurance auto, habitation, mutuelle, RC Pro et plus. Réponse sous 24h.",
};

const phone = process.env.NEXT_PUBLIC_PHONE ?? "0671551931";
const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "ruby.assur@gmail.com";

export default function ContactPage() {
  return (
    <>
      <section className="bg-navy py-20 text-white">
        <div className="container-shell">
          <p className="eyebrow text-gold">Contact</p>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Demandez votre devis gratuit</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/75">
            Décrivez votre besoin et Ruby Assur' vous recontacte rapidement. Gratuit, sans engagement.
          </p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-shell grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:items-start">
          <div>
            <p className="eyebrow">Nos coordonnées</p>
            <h2 className="mt-3 font-display text-2xl font-bold text-navy">Ruby Assur&apos;</h2>
            <div className="mt-6 space-y-4">
              <a href={`tel:${phone}`} className="flex items-center gap-3 text-slate-700 hover:text-navy">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy/5">
                  <Phone className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gold">Téléphone</p>
                  <p className="font-semibold">{phone}</p>
                </div>
              </a>
              <a href={`mailto:${email}`} className="flex items-center gap-3 text-slate-700 hover:text-navy">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy/5">
                  <Mail className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gold">Email</p>
                  <p className="font-semibold">{email}</p>
                </div>
              </a>
              <div className="flex items-center gap-3 text-slate-700">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy/5">
                  <Clock className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gold">Délai de réponse</p>
                  <p className="font-semibold">Sous 24h en jours ouvrés</p>
                </div>
              </div>
            </div>
            {/* Cal.com — Prise de RDV */}
            <div className="mt-8 rounded-2xl border border-gold/30 bg-navy/5 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy">
                  <CalendarDays className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="font-semibold text-navy">Prendre rendez-vous</p>
                  <p className="text-xs text-slate-500">Choisissez un créneau directement</p>
                </div>
              </div>
              <BookingButton label="Choisir un créneau" className="w-full justify-center" />
            </div>

            <div className="mt-4 rounded-xl border border-off-gray bg-off-white p-4 text-sm text-slate-600">
              <p className="font-semibold text-navy">ORIAS 24007878</p>
              <p className="mt-1">SIREN 933 756 074 — SASU Ruby Assur'</p>
            </div>
          </div>
          <div className="rounded-2xl border border-off-gray bg-white p-6 shadow-card">
            <p className="mb-6 font-display text-xl font-bold text-navy">Votre demande</p>
            <QuoteForm />
          </div>
        </div>
      </section>
    </>
  );
}
