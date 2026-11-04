import Link from "next/link";
import { ArrowRight, Check, ChevronRight, FileText } from "lucide-react";
import { products, type Product } from "@/lib/products";
import { BookingButton } from "./BookingEmbed";
import { FAQ } from "./FAQ";
import { QuoteForm } from "./QuoteForm";

/**
 * Page d'assurance. Deux déclinaisons : particuliers (en-tête clair, ivoire) et professionnels (en-tête nuit).
 * Mêmes contenus qu'avant (description, garanties, pièces, FAQ) : seule la présentation change.
 */
export function ProductPage({ product, audiencePath }: { product: Product; audiencePath: string }) {
  const pro = product.audience === "pro";
  const audienceLabel = pro ? "Professionnels" : "Particuliers";
  const related = products.filter((p) => p.audience === product.audience && p.slug !== product.slug).slice(0, 3);

  return (
    <>
      {/* ───────── En-tête ───────── */}
      <section className={pro ? "on-dark relative overflow-hidden bg-night text-white" : "relative overflow-hidden bg-ivory text-night"}>
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -right-32 -top-32 h-[30rem] w-[30rem] rounded-full border ${pro ? "border-champagne/15" : "border-champagne/30"}`}
        />
        <div className="mx-auto grid w-full max-w-page gap-12 px-gutter pb-16 pt-8 lg:grid-cols-12 lg:items-end lg:pb-20 lg:pt-10">
          <div className="lg:col-span-7">
            <nav aria-label="Fil d'Ariane" className={`flex flex-wrap items-center gap-1.5 text-[0.85rem] ${pro ? "text-white/60" : "text-ink-muted"}`}>
              <Link href="/" className="transition hover:text-champagne-ink">Accueil</Link>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              <Link href={audiencePath} className="transition hover:text-champagne-ink">{audienceLabel}</Link>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              <span aria-current="page" className={pro ? "text-white" : "text-night"}>{product.name}</span>
            </nav>
            <p className="eyebrow mt-10">{audienceLabel}</p>
            <h1 className="display mt-4 text-display-lg">{product.name}</h1>
            <p className={`mt-6 max-w-xl text-lead ${pro ? "text-white/75" : "text-ink-soft"}`}>{product.tagline}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#devis" className={pro ? "btn-gold" : "btn-primary"}>
                Demander un devis gratuit <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <BookingButton label="Être rappelé" />
            </div>
          </div>

          <aside
            aria-label="Pièces utiles"
            className={`lg:col-span-5 rounded-xl p-6 sm:p-7 ${pro ? "bg-white/[0.06] ring-1 ring-white/15" : "bg-white shadow-card"}`}
          >
            <p className="eyebrow">À préparer</p>
            <ul className="mt-4 space-y-3">
              {product.requiredDocuments.slice(0, 4).map((d) => (
                <li key={d} className="flex items-start gap-3 text-[0.95rem]">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-champagne" aria-hidden="true" />
                  <span className={pro ? "text-white/85" : "text-ink-soft"}>{d}</span>
                </li>
              ))}
            </ul>
            <a href="#pieces" className="link-arrow mt-5 text-sm">
              Voir la liste complète <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </aside>
        </div>
      </section>

      {/* ───────── En quoi ça consiste ───────── */}
      <section className="section bg-paper">
        <div className="mx-auto grid w-full max-w-page gap-12 px-gutter lg:grid-cols-12">
          <div className="reveal lg:col-span-5">
            <p className="eyebrow">En quoi ça consiste</p>
            <h2 className="display mt-4 text-display-md text-night">{product.name}</h2>
            <p className="mt-6 text-lead text-ink-soft">{product.description}</p>
          </div>
          <div className="reveal lg:col-span-7">
            <p className="eyebrow">Ce que vous obtenez</p>
            <ul className="mt-5 grid gap-x-8 sm:grid-cols-2">
              {product.benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 border-t border-night/10 py-4 text-[0.98rem] leading-6 text-ink-soft">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-champagne/25 text-champagne-ink" aria-hidden="true">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ───────── Pièces à préparer ───────── */}
      <section id="pieces" className="section bg-ivory">
        <div className="mx-auto grid w-full max-w-page gap-12 px-gutter lg:grid-cols-12">
          <div className="reveal lg:col-span-5">
            <p className="eyebrow">Documents à préparer</p>
            <h2 className="display mt-4 text-display-md text-night">
              Ce dont nous avons <em>besoin</em>.
            </h2>
            <p className="mt-5 max-w-md text-[1rem] leading-7 text-ink-muted">
              Préparez ces éléments pour que votre demande soit étudiée rapidement. Vous pouvez les joindre directement dans le formulaire ci-dessous.
            </p>
          </div>
          <ol className="reveal lg:col-span-7">
            {product.requiredDocuments.map((d, i) => (
              <li key={d} className="flex items-center gap-5 border-t border-night/15 py-5 first:border-t-0 first:pt-0">
                <span className="display w-10 shrink-0 text-[1.7rem] leading-none text-champagne-deep">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[1.05rem] font-medium text-night">{d}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───────── FAQ ───────── */}
      {product.faq.length > 0 && (
        <section className="section bg-paper">
          <div className="mx-auto grid w-full max-w-page gap-12 px-gutter lg:grid-cols-12">
            <div className="reveal lg:col-span-4">
              <p className="eyebrow">Questions fréquentes</p>
              <h2 className="display mt-4 text-display-md text-night">
                On répond à <em>vos questions</em>.
              </h2>
            </div>
            <div className="reveal lg:col-span-8">
              <FAQ items={product.faq} />
            </div>
          </div>
        </section>
      )}

      {/* ───────── Demande de devis ───────── */}
      <section id="devis" className="section border-t border-line bg-ivory">
        <div className="mx-auto grid w-full max-w-page gap-12 px-gutter lg:grid-cols-12 lg:items-start">
          <div className="reveal lg:col-span-5">
            <p className="eyebrow">Demande de devis</p>
            <h2 className="display mt-4 text-display-md text-night">
              Votre devis <em>{product.name}</em>, gratuit.
            </h2>
            <p className="mt-5 max-w-md text-[1rem] leading-7 text-ink-muted">
              Ruby Assur&apos; compare les offres et vous revient rapidement. Gratuit, sans engagement.
            </p>
            <ul className="mt-8 space-y-3 text-[0.98rem] text-ink-soft">
              {["Devis gratuit et sans engagement", "Réponse sous 24 h", "Conseil indépendant, plusieurs assureurs comparés"].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-night text-champagne" aria-hidden="true">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal rounded-xl bg-white p-6 shadow-card sm:p-8 lg:col-span-7">
            <QuoteForm defaultInsurance={product.slug} />
          </div>
        </div>
      </section>

      {/* ───────── Autres assurances (maillage interne) ───────── */}
      {related.length > 0 && (
        <section className="section bg-paper">
          <div className="mx-auto w-full max-w-page px-gutter">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">À découvrir aussi</p>
                <h2 className="display mt-4 text-display-sm text-night">Autres assurances {pro ? "professionnelles" : "particuliers"}</h2>
              </div>
              <Link href={audiencePath} className="link-arrow text-sm">
                Tout voir <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <ul className="mt-8 grid gap-4 md:grid-cols-3">
              {related.map((p) => (
                <li key={p.slug}>
                  <Link href={`/${p.slug}`} className="group flex h-full flex-col rounded-lg bg-white p-6 shadow-card transition duration-300 hover:-translate-y-0.5 hover:shadow-lift">
                    <span className="display text-[1.3rem] leading-snug text-night">{p.name}</span>
                    <span className="mt-2 line-clamp-2 text-[0.92rem] leading-6 text-ink-muted">{p.tagline}</span>
                    <span className="link-arrow mt-5 pt-1 text-sm">
                      Découvrir <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
