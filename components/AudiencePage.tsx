import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/lib/products";
import { CtaBand } from "./CtaBand";

interface Props {
  tone: "light" | "dark";
  eyebrow: string;
  title: React.ReactNode;
  intro: string;
  list: Product[];
  whyTitle: React.ReactNode;
  why: { title: string; text: string }[];
}

/** Page « catalogue » d'un public (particuliers ou professionnels). Contenus identiques à l'existant. */
export function AudiencePage({ tone, eyebrow, title, intro, list, whyTitle, why }: Props) {
  const dark = tone === "dark";
  return (
    <>
      <section className={dark ? "on-dark relative overflow-hidden bg-night text-white" : "relative overflow-hidden bg-ivory text-night"}>
        <div aria-hidden="true" className={`pointer-events-none absolute -right-32 -top-40 h-[34rem] w-[34rem] rounded-full border ${dark ? "border-champagne/15" : "border-champagne/30"}`} />
        <div className="mx-auto w-full max-w-page px-gutter pb-16 pt-14 lg:pb-24 lg:pt-20">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="display mt-5 max-w-3xl text-display-lg">{title}</h1>
          <p className={`mt-6 max-w-2xl text-lead ${dark ? "text-white/75" : "text-ink-soft"}`}>{intro}</p>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="mx-auto w-full max-w-page px-gutter">
          <ul className="grid gap-px overflow-hidden rounded-xl bg-line shadow-hairline md:grid-cols-2">
            {list.map((p, i) => (
              <li key={p.slug} className="bg-white">
                <Link href={`/${p.slug}`} className="group flex h-full flex-col p-7 transition duration-300 hover:bg-ivory-soft sm:p-9">
                  <span className="display text-[1.6rem] leading-none text-champagne-deep">{String(i + 1).padStart(2, "0")}</span>
                  <h2 className="display mt-5 text-display-sm text-night">{p.name}</h2>
                  <p className="mt-2 text-[0.98rem] font-medium text-champagne-ink">{p.tagline}</p>
                  <ul className="mt-5 space-y-2 text-[0.95rem] text-ink-muted">
                    {p.benefits.slice(0, 3).map((b) => (
                      <li key={b} className="flex gap-3"><span className="text-champagne-deep" aria-hidden="true">—</span>{b}</li>
                    ))}
                  </ul>
                  <span className="link-arrow mt-8 pt-1 text-sm">
                    En savoir plus <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="on-dark section bg-night text-white">
        <div className="mx-auto grid w-full max-w-page gap-12 px-gutter lg:grid-cols-12">
          <div className="reveal lg:col-span-5">
            <p className="eyebrow">Pourquoi Ruby Assur&apos; ?</p>
            <h2 className="display mt-4 text-display-md text-white">{whyTitle}</h2>
          </div>
          <ul className="grid gap-x-10 sm:grid-cols-2 lg:col-span-7">
            {why.map((w) => (
              <li key={w.title} className="reveal border-t border-white/15 py-6">
                <h3 className="display text-[1.4rem] text-white">{w.title}</h3>
                <p className="mt-2 text-[0.98rem] leading-7 text-white/65">{w.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand title="Pas sûr de ce qu'il vous faut ?" text="Décrivez votre situation en quelques lignes, Ruby Assur' vous oriente." />
    </>
  );
}
