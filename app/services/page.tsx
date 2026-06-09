import type { Metadata } from "next";
import { ArrowRight, BriefcaseBusiness, Car, HeartPulse, Home, ShieldCheck, Umbrella } from "lucide-react";
import Link from "next/link";
import { serviceItems } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services et assurances",
  description:
    "Découvrez les accompagnements Ruby Assur’ : assurance auto, habitation, mutuelle santé, prévoyance, emprunteur et assurances professionnelles à Pasly et Soissons.",
};

const icons = [Car, Home, HeartPulse, Umbrella, ShieldCheck, BriefcaseBusiness, BriefcaseBusiness, ShieldCheck];

export default function ServicesPage() {
  return (
    <>
      <section className="bg-ruby-frost py-16">
        <div className="section-shell max-w-4xl">
          <p className="eyebrow">Services / Nos assurances</p>
          <h1 className="mt-3 text-4xl font-semibold text-ruby-navy sm:text-5xl">Un accompagnement assurance clair et personnalisé</h1>
          <p className="mt-5 text-lg leading-8 text-slate-700">
            Ruby Assur’ vous aide à analyser vos besoins et à identifier les pistes d’assurance pertinentes, sans inventer
            de tarifs, de garanties ou de partenaires non confirmés.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="section-shell grid gap-5 md:grid-cols-2">
          {serviceItems.map((service, index) => {
            const Icon = icons[index] ?? ShieldCheck;
            return (
              <article key={service.title} className="rounded-lg border border-ruby-line bg-white p-6 shadow-sm">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-md bg-ruby-glacier text-ruby-navy">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className="text-xl font-semibold text-ruby-navy">{service.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-700">{service.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-ruby-sand py-14">
        <div className="section-shell flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-ruby-navy">Besoin d’une première orientation ?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Une demande de rappel permet de préciser votre situation avant toute étude.
            </p>
          </div>
          <Link
            href="/contact"
            className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-md bg-ruby-navy px-5 text-sm font-semibold text-white hover:bg-ruby-ink"
          >
            Demander un rappel
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
