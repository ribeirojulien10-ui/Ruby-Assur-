import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Phone } from "lucide-react";
import { BookingButton } from "@/components/BookingEmbed";
import { CtaBand } from "@/components/CtaBand";
import { FAQ } from "@/components/FAQ";
import { PartnersScroll } from "@/components/PartnersScroll";
import { getProductsByAudience } from "@/lib/products";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const particulierProducts = getProductsByAudience("particulier");
const proProducts = getProductsByAudience("pro");

const phone = process.env.NEXT_PUBLIC_PHONE ?? "0671551931";
const fmtPhone = (p: string) => p.replace(/(\d{2})(?=\d)/g, "$1 ").trim();

const homeFaq = [
  { question: "Qu'est-ce qu'un courtier en assurances ?", answer: "Un courtier est un intermédiaire indépendant qui compare les offres de plusieurs compagnies d'assurance pour trouver la meilleure solution adaptée à votre profil. Contrairement à un agent exclusif, il n'est lié à aucune compagnie." },
  { question: "Est-ce payant de passer par Ruby Assur' ?", answer: "Non. Le recours à un courtier est totalement gratuit pour vous. Ruby Assur' est rémunéré par les compagnies d'assurance sous forme de commissions, sans surcoût pour le client." },
  { question: "Combien de temps faut-il pour obtenir un devis ?", answer: "En général, Ruby Assur' vous revient sous 24 à 48 heures après réception de votre demande. Pour certains produits simples (auto, habitation), une réponse peut être apportée le jour même." },
  { question: "Puis-je changer d'assureur en cours de contrat ?", answer: "Oui, dans la plupart des cas. La loi Hamon (auto, habitation) et la loi Lemoine (emprunteur) permettent de résilier et changer à tout moment après un an de contrat. Ruby Assur' gère les démarches à votre place." },
  { question: "Ruby Assur' intervient-il uniquement dans l'Aisne ?", answer: "Non. Ruby Assur' accompagne des clients dans toute la France grâce aux échanges par téléphone, email et visioconférence." },
  { question: "Que se passe-t-il en cas de sinistre ?", answer: "Ruby Assur' vous accompagne dans la déclaration et le suivi du sinistre auprès de votre assureur. Avoir un courtier à vos côtés simplifie considérablement les démarches." },
];

// Texte strictement identique aux réponses affichées dans le composant FAQ.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: homeFaq.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

/** Les quatre engagements déjà affichés sur le site (aucune promesse nouvelle). */
const principles = [
  { title: "Indépendant", text: "Aucune compagnie imposée. Ruby Assur' compare librement le marché pour vous." },
  { title: "Multi-offres", text: "Comparaison réelle de plusieurs assureurs pour vous obtenir le meilleur rapport qualité/prix." },
  { title: "Humain", text: "Un vrai interlocuteur, joignable, qui vous connaît et vous accompagne dans la durée." },
  { title: "Simple", text: "Les démarches administratives sont prises en charge. Vous choisissez, on s'occupe du reste." },
];

/** Les trois étapes déjà décrites sur le site. */
const steps = [
  { n: "01", title: "Vous décrivez votre besoin", text: "En quelques minutes, via le formulaire ou par téléphone. Aucun engagement." },
  { n: "02", title: "On compare pour vous", text: "Ruby Assur' analyse les offres du marché et sélectionne les meilleures options pour votre profil." },
  { n: "03", title: "Vous choisissez en confiance", text: "Vous recevez un conseil clair, sans jargon, et vous décidez librement." },
];

function ProductList({ list, dark = false }: { list: typeof particulierProducts; dark?: boolean }) {
  return (
    <ul className={`mt-8 divide-y ${dark ? "divide-white/10 border-y border-white/10" : "divide-night/10 border-y border-night/10"}`}>
      {list.map((p) => (
        <li key={p.slug}>
          <Link
            href={`/${p.slug}`}
            className={`group flex items-center justify-between gap-4 py-4 transition ${dark ? "hover:bg-white/5" : "hover:bg-white/60"} sm:px-2`}
          >
            <span>
              <span className={`block text-[1.05rem] font-semibold ${dark ? "text-white" : "text-night"}`}>{p.name}</span>
              <span className={`mt-0.5 line-clamp-1 block text-[0.88rem] ${dark ? "text-white/55" : "text-ink-muted"}`}>{p.tagline}</span>
            </span>
            <ArrowRight
              className={`h-5 w-5 shrink-0 transition duration-300 group-hover:translate-x-1 ${dark ? "text-champagne" : "text-champagne-deep"}`}
              aria-hidden="true"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* ───────── Hero : composition asymétrique, texte à gauche, image en arche à droite ───────── */}
      <section className="relative overflow-hidden bg-ivory">
        <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-1/3 h-[34rem] w-[34rem] rounded-full border border-champagne/25" />
        <div className="mx-auto grid w-full max-w-page items-center gap-12 px-gutter pb-16 pt-10 sm:pt-14 lg:grid-cols-12 lg:gap-10 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-7">
            <p className="eyebrow">Courtier indépendant · ORIAS 24007878</p>
            <h1 className="display mt-5 text-display-xl text-night">
              Votre assurance, <em>enfin claire</em>.
            </h1>
            <p className="mt-6 max-w-xl text-lead text-ink-soft">
              Ruby Assur&apos; compare les meilleures offres pour vous. Conseil humain, devis gratuit, zéro jargon.
            </p>

            <div className="mt-9 grid gap-3 sm:max-w-xl sm:grid-cols-2">
              <Link href="/particuliers" className="btn-primary">
                Je suis un particulier <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/professionnels" className="btn-outline">
                Je suis un professionnel <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <p className="mt-5 text-[0.95rem] text-ink-muted">
              Ou{" "}
              <Link href="/contact" className="font-semibold text-night underline decoration-champagne decoration-2 underline-offset-4 hover:text-champagne-ink">
                demandez directement un devis gratuit
              </Link>
              .
            </p>

            <dl className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-night/10 pt-6">
              {[
                ["Immatriculation", "ORIAS 24007878"],
                ["Devis", "Gratuit"],
                ["Réponse", "Sous 24 h"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-ink-faint">{k}</dt>
                  <dd className="mt-1 text-[0.98rem] font-semibold text-night">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-2xl bg-night shadow-lift">
              <Image
                src="/images/hero-ruby-assur.png"
                alt="Rendez-vous de conseil en assurance"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-cover object-[64%_30%]"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-night/50 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-4 left-1/2 w-[88%] -translate-x-1/2 rounded-lg bg-white p-4 shadow-lift sm:left-auto sm:right-[-1rem] sm:w-72 sm:translate-x-0">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-champagne-ink">Votre courtier</p>
              <p className="mt-1 text-[0.98rem] leading-6 text-night">Vous répond en moins de 24 h.</p>
            </div>
          </div>
        </div>
      </section>

      <PartnersScroll />

      {/* ───────── Profils : deux panneaux, accès direct à chaque assurance ───────── */}
      <section className="section bg-paper">
        <div className="mx-auto w-full max-w-page px-gutter">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">Trouvez votre assurance</p>
            <h2 className="display mt-4 text-display-lg text-night">
              Pour votre vie, <em>pour votre activité</em>.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="reveal rounded-xl bg-ivory p-8 sm:p-10">
              <p className="eyebrow">Particuliers</p>
              <h3 className="display mt-3 text-display-sm text-night">Solutions pour tous les profils</h3>
              <ProductList list={particulierProducts} />
              <Link href="/particuliers" className="link-arrow mt-8">
                Voir toutes les assurances particuliers <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="on-dark reveal rounded-xl bg-night p-8 text-white sm:p-10">
              <p className="eyebrow">Professionnels</p>
              <h3 className="display mt-3 text-display-sm text-white">Artisans, TPE, commerçants, indépendants</h3>
              <ProductList list={proProducts} dark />
              <Link href="/professionnels" className="link-arrow mt-8 !text-white">
                Voir toutes les assurances professionnelles <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Pourquoi un courtier : titre fixe à gauche, principes en lignes à droite ───────── */}
      <section className="section bg-ivory">
        <div className="mx-auto grid w-full max-w-page gap-12 px-gutter lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <p className="eyebrow">Notre approche</p>
              <h2 className="display mt-4 text-display-lg text-night">
                Un courtier, pour comparer <em>librement</em>.
              </h2>
              <p className="mt-6 max-w-md text-lead text-ink-soft">
                Contrairement à un agent exclusif, un courtier n&apos;est lié à aucune compagnie : il compare les offres de plusieurs
                assureurs pour trouver la solution adaptée à votre profil.
              </p>
            </div>
          </div>
          <ol className="lg:col-span-7">
            {principles.map((p, i) => (
              <li key={p.title} className="reveal grid grid-cols-[3.5rem_1fr] gap-4 border-t border-night/15 py-8 first:border-t-0 first:pt-0 sm:grid-cols-[5rem_1fr]">
                <span className="display text-[2.2rem] leading-none text-champagne-deep sm:text-[3rem]">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="display text-display-sm text-night">{p.title}</h3>
                  <p className="mt-2 max-w-lg text-[1.02rem] leading-7 text-ink-muted">{p.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───────── Julien : emplacement prévu pour la future photographie ───────── */}
      <section className="section bg-paper">
        <div className="mx-auto grid w-full max-w-page items-center gap-12 px-gutter lg:grid-cols-12">
          <div className="reveal lg:col-span-5">
            {/* Pas de photo fictive : cadre sobre (monogramme) en attendant la photographie de Julien. */}
            <div className="on-dark relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-t-[999px] rounded-b-2xl bg-night">
              <div aria-hidden="true" className="absolute inset-4 rounded-t-[999px] rounded-b-xl border border-champagne/30" />
              <div className="absolute inset-0 grid place-items-center">
                <span className="display text-[7rem] leading-none text-champagne/90 sm:text-[9rem]">JR</span>
              </div>
            </div>
          </div>
          <div className="reveal lg:col-span-7">
            <p className="eyebrow">Votre interlocuteur</p>
            <h2 className="display mt-4 text-display-lg text-night">
              Julien Ribeiro, <em>courtier indépendant</em>.
            </h2>
            <p className="mt-6 max-w-xl text-lead text-ink-soft">
              Ruby Assur&apos; est une société de courtage et d&apos;intermédiation en assurances indépendante, dans l&apos;Aisne.
              L&apos;objectif est simple : vous aider à comprendre vos besoins, poser les bonnes questions et avancer avec un conseil
              clair et personnalisé.
            </p>
            <ul className="mt-8 grid gap-3 text-[0.98rem] text-ink-soft sm:grid-cols-2">
              <li className="flex gap-3 border-t border-night/10 pt-3"><span className="text-champagne-deep" aria-hidden="true">—</span>Ancrage dans l&apos;Aisne, accompagnement partout en France</li>
              <li className="flex gap-3 border-t border-night/10 pt-3"><span className="text-champagne-deep" aria-hidden="true">—</span>Courtier en assurance inscrit à l&apos;ORIAS sous le n° 24007878</li>
            </ul>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <BookingButton label="Prendre RDV" />
              <a href={`tel:${phone}`} className="btn-outline">
                <Phone className="h-4 w-4" aria-hidden="true" /> {fmtPhone(phone)}
              </a>
              <a href="https://www.orias.fr" target="_blank" rel="noopener noreferrer" className="link-arrow ml-1 text-sm">
                Vérifier sur orias.fr <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Comment ça marche : trois étapes sur une ligne ───────── */}
      <section className="section bg-night text-white on-dark">
        <div className="mx-auto w-full max-w-page px-gutter">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">Comment ça marche</p>
            <h2 className="display mt-4 text-display-lg text-white">
              Trois étapes, <em>sans jargon</em>.
            </h2>
          </div>
          <ol className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            <div aria-hidden="true" className="absolute left-0 right-0 top-[1.55rem] hidden border-t border-dashed border-white/20 md:block" />
            {steps.map((s) => (
              <li key={s.n} className="reveal relative">
                <span className="display relative z-10 inline-grid h-12 min-w-12 place-items-center rounded-full bg-champagne px-3 text-[1.1rem] text-night">{s.n}</span>
                <h3 className="display mt-6 text-display-sm text-white">{s.title}</h3>
                <p className="mt-3 max-w-xs text-[1rem] leading-7 text-white/65">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-14">
            <Link href="/contact" className="btn-gold">Demander un devis gratuit</Link>
          </div>
        </div>
      </section>

      {/* ───────── FAQ ───────── */}
      <section className="section bg-ivory">
        <div className="mx-auto grid w-full max-w-page gap-12 px-gutter lg:grid-cols-12">
          <div className="reveal lg:col-span-4">
            <p className="eyebrow">Questions fréquentes</p>
            <h2 className="display mt-4 text-display-md text-night">
              On répond à <em>vos questions</em>.
            </h2>
            <p className="mt-5 text-[1rem] leading-7 text-ink-muted">Une autre question ? Écrivez-nous ou appelez, nous vous répondons avec plaisir.</p>
            <Link href="/contact" className="link-arrow mt-6">
              Nous contacter <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="reveal lg:col-span-8">
            <FAQ items={homeFaq} />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
