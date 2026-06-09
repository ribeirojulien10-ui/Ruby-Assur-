import Link from "next/link";
import Image from "next/image";
import { TrustBadges } from "@/components/TrustBadges";
import { FAQ } from "@/components/FAQ";
import { BookingButton } from "@/components/BookingEmbed";
import { Home as HomeIcon, Building2, Shield, BarChart3, User, CheckCircle } from "lucide-react";
import { getProductsByAudience } from "@/lib/products";

const particulierProducts = getProductsByAudience("particulier");
const proProducts = getProductsByAudience("pro");

const homeFaq = [
  { question: "Qu'est-ce qu'un courtier en assurances ?", answer: "Un courtier est un intermédiaire indépendant qui compare les offres de plusieurs compagnies d'assurance pour trouver la meilleure solution adaptée à votre profil. Contrairement à un agent exclusif, il n'est lié à aucune compagnie." },
  { question: "Est-ce payant de passer par Ruby Assur' ?", answer: "Non. Le recours à un courtier est totalement gratuit pour vous. Ruby Assur' est rémunéré par les compagnies d'assurance sous forme de commissions, sans surcoût pour le client." },
  { question: "Combien de temps faut-il pour obtenir un devis ?", answer: "En général, Ruby Assur' vous revient sous 24 à 48 heures après réception de votre demande. Pour certains produits simples (auto, habitation), une réponse peut être apportée le jour même." },
  { question: "Puis-je changer d'assureur en cours de contrat ?", answer: "Oui, dans la plupart des cas. La loi Hamon (auto, habitation) et la loi Lemoine (emprunteur) permettent de résilier et changer à tout moment après un an de contrat. Ruby Assur' gère les démarches à votre place." },
  { question: "Ruby Assur' intervient-il uniquement dans l'Aisne ?", answer: "Non. Ruby Assur' accompagne des clients dans toute la France grâce aux échanges par téléphone, email et visioconférence." },
  { question: "Que se passe-t-il en cas de sinistre ?", answer: "Ruby Assur' vous accompagne dans la déclaration et le suivi du sinistre auprès de votre assureur. Avoir un courtier à vos côtés simplifie considérablement les démarches." },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[calc(100svh-64px)] items-start overflow-hidden bg-navy pt-8 pb-20 text-white sm:pt-12">
        <Image
          src="/images/hero-ruby-assur.png"
          alt="Courtier en assurance Ruby Assur'"
          fill
          className="absolute inset-0 -z-20 object-cover object-[center_30%]"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 -z-10 bg-navy/55" aria-hidden="true" />
        <div className="container-shell">
          <div className="max-w-3xl">
            <p className="mb-3 font-display text-5xl font-bold sm:text-6xl lg:text-7xl">
              Ruby<span className="text-gold"> Assur'</span>
            </p>
            <p className="eyebrow text-gold">Courtier indépendant — ORIAS 24007878</p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Votre assurance,{" "}
              <span className="text-gold underline decoration-gold/40 underline-offset-4">enfin claire</span>.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">
              Ruby Assur' compare les meilleures offres pour vous. Conseil humain, devis gratuit, zéro jargon.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/particuliers" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-navy transition hover:bg-off-white">
                Je suis un particulier
              </Link>
              <Link href="/professionnels" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Je suis un professionnel
              </Link>
            </div>
            <div className="mt-8">
              <TrustBadges />
            </div>
          </div>
        </div>
      </section>

      {/* Choisissez votre profil */}
      <section className="section bg-off-white">
        <div className="container-shell">
          <div className="text-center">
            <p className="eyebrow">Votre profil</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-navy sm:text-4xl">Choisissez votre profil</h2>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {/* Particuliers */}
            <div className="card flex flex-col">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy">
                  <HomeIcon className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <p className="font-display text-xl font-bold text-navy">Particuliers</p>
                  <p className="text-sm text-slate-500">Auto, habitation, santé, emprunteur</p>
                </div>
              </div>
              <ul className="mt-6 space-y-2">
                {particulierProducts.slice(0, 4).map(p => (
                  <li key={p.slug} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle className="h-4 w-4 text-gold" />{p.name}
                  </li>
                ))}
              </ul>
              <Link href="/particuliers" className="btn-primary mt-6 w-full text-center">
                Voir mes assurances
              </Link>
            </div>
            {/* Professionnels */}
            <div className="card flex flex-col">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy">
                  <Building2 className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <p className="font-display text-xl font-bold text-navy">Professionnels</p>
                  <p className="text-sm text-slate-500">RC Pro, décennale, flotte, multirisque</p>
                </div>
              </div>
              <ul className="mt-6 space-y-2">
                {proProducts.slice(0, 4).map(p => (
                  <li key={p.slug} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle className="h-4 w-4 text-gold" />{p.name}
                  </li>
                ))}
              </ul>
              <Link href="/professionnels" className="btn-primary mt-6 w-full text-center">
                Voir mes assurances pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi Ruby Assur' */}
      <section className="section bg-white">
        <div className="container-shell">
          <div className="text-center">
            <p className="eyebrow">Nos engagements</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-navy sm:text-4xl">Pourquoi Ruby Assur' ?</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Shield, title: "Indépendant", desc: "Aucune compagnie imposée. Ruby Assur' compare librement le marché pour vous." },
              { icon: BarChart3, title: "Multi-offres", desc: "Comparaison réelle de plusieurs assureurs pour vous obtenir le meilleur rapport qualité/prix." },
              { icon: User, title: "Humain", desc: "Un vrai interlocuteur, joignable, qui vous connaît et vous accompagne dans la durée." },
              { icon: CheckCircle, title: "Simple", desc: "Les démarches administratives sont prises en charge. Vous choisissez, on s'occupe du reste." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-navy/5">
                  <Icon className="h-6 w-6 text-gold" />
                </div>
                <p className="mt-4 font-display text-lg font-bold text-navy">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="section bg-navy text-white">
        <div className="container-shell">
          <div className="text-center">
            <p className="eyebrow text-gold">Processus</p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Comment ça marche ?</h2>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              { step: "01", title: "Vous décrivez votre besoin", desc: "En quelques minutes, via le formulaire ou par téléphone. Aucun engagement." },
              { step: "02", title: "On compare pour vous", desc: "Ruby Assur' analyse les offres du marché et sélectionne les meilleures options pour votre profil." },
              { step: "03", title: "Vous choisissez en confiance", desc: "Vous recevez un conseil clair, sans jargon, et vous décidez librement." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-gold/40 bg-white/10 font-display text-xl font-bold text-gold">
                  {step}
                </div>
                <p className="mt-4 font-display text-lg font-bold">{title}</p>
                <p className="mt-2 text-sm leading-6 text-white/70">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/contact" className="btn-gold">Demander un devis gratuit</Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-off-white">
        <div className="container-shell max-w-3xl">
          <div className="text-center">
            <p className="eyebrow">Questions fréquentes</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-navy sm:text-4xl">On répond à vos questions</h2>
          </div>
          <div className="mt-10">
            <FAQ items={homeFaq} />
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="section bg-navy text-white">
        <div className="container-shell text-center">
          <p className="eyebrow text-gold">Prêt à commencer ?</p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Obtenez votre devis gratuit aujourd'hui</h2>
          <p className="mt-4 text-lg text-white/70">Sans engagement, réponse sous 24h.</p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/contact" className="btn-gold text-base px-8 py-4">
              Demander un devis
            </Link>
            <BookingButton label="Prendre rendez-vous" className="border-white/30 text-white hover:bg-white/10 text-base px-8 py-4" />
          </div>
          <p className="mt-4 text-sm text-white/40">Choisissez ce qui vous convient le mieux</p>
        </div>
      </section>
    </>
  );
}
