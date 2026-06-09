import { Product } from "@/lib/products";
import { CheckCircle, FileText, ChevronRight } from "lucide-react";
import Link from "next/link";
import { FAQ } from "./FAQ";
import { BookingButton } from "./BookingEmbed";
import { QuoteForm } from "./QuoteForm";

export function ProductPage({ product, audiencePath }: { product: Product; audiencePath: string }) {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-20 text-white">
        <div className="container-shell">
          <Link href={audiencePath} className="mb-6 inline-flex items-center gap-1 text-sm text-white/60 hover:text-white">
            <ChevronRight className="h-4 w-4 rotate-180" /> Retour
          </Link>
          <p className="eyebrow text-gold">{product.audience === "particulier" ? "Particuliers" : "Professionnels"}</p>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">{product.name}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/75">{product.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-navy transition hover:bg-off-white">
              Demander un devis gratuit
            </Link>
            <BookingButton label="Être rappelé" className="border-white/30 text-white hover:bg-white/10" />
          </div>
        </div>
      </section>

      {/* Description + Bénéfices */}
      <section className="section bg-white">
        <div className="container-shell grid gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">En quoi ça consiste</p>
            <h2 className="mt-3 font-display text-2xl font-bold text-navy">{product.name}</h2>
            <p className="mt-4 leading-8 text-slate-600">{product.description}</p>
          </div>
          <div>
            <p className="eyebrow">Ce que vous obtenez</p>
            <ul className="mt-4 space-y-3">
              {product.benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm leading-6 text-slate-700">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold" />{b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Documents */}
      <section className="section bg-off-white">
        <div className="container-shell max-w-2xl">
          <p className="eyebrow">Documents à préparer</p>
          <h2 className="mt-3 font-display text-2xl font-bold text-navy">Ce dont nous avons besoin</h2>
          <ul className="mt-6 space-y-3">
            {product.requiredDocuments.map((d) => (
              <li key={d} className="flex items-center gap-3 rounded-xl border border-off-gray bg-white p-4 text-sm font-medium text-navy shadow-card">
                <FileText className="h-4 w-4 text-gold" />{d}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-white">
        <div className="container-shell max-w-2xl">
          <p className="eyebrow">Questions fréquentes</p>
          <h2 className="mt-3 font-display text-2xl font-bold text-navy">On répond à vos questions</h2>
          <div className="mt-8">
            <FAQ items={product.faq} />
          </div>
        </div>
      </section>

      {/* Formulaire */}
      <section className="section bg-navy" id="devis">
        <div className="container-shell grid gap-12 lg:grid-cols-2 lg:items-start">
          <div className="text-white">
            <p className="eyebrow text-gold">Demande de devis</p>
            <h2 className="mt-3 font-display text-3xl font-bold">Obtenez votre devis {product.name} gratuit</h2>
            <p className="mt-4 leading-8 text-white/70">Ruby Assur' compare les offres et vous revient rapidement. Gratuit, sans engagement.</p>
          </div>
          <div className="rounded-2xl bg-white p-6">
            <QuoteForm />
          </div>
        </div>
      </section>
    </>
  );
}
