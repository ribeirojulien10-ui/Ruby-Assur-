import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, FileText, MapPin, PhoneCall, ShieldCheck, Sparkles } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { brand, legalInfo, reassuranceItems, serviceItems } from "@/lib/site";

export default function Home() {
  return (
    <>
      <section className="relative isolate flex min-h-[calc(100svh-120px)] items-center overflow-hidden bg-ruby-navy py-16 text-white sm:py-20">
        <Image
          src="/images/hero-ruby-assur.png"
          alt="Conseil en assurance dans un bureau lumineux avec samoyède"
          fill
          className="absolute inset-0 -z-20 object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 -z-10 bg-ruby-navy/75" aria-hidden="true" />
        <div className="section-shell">
          <div className="max-w-3xl">
            <p className="eyebrow text-ruby-glacier">Courtier local à Pasly / Soissons</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Ruby Assur’, courtier en assurances à Pasly et Soissons
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/88">
              Votre courtier vous accompagne pour protéger ce qui compte vraiment, avec un conseil clair,
              humain et indépendant.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-semibold text-ruby-navy transition hover:bg-ruby-glacier"
              >
                <PhoneCall className="h-4 w-4" aria-hidden="true" />
                Demander un rappel
              </Link>
              <Link
                href="/services"
                className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/35 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Voir les assurances
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/80">
              {reassuranceItems.map((item) => (
                <span key={item} className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2">
                  <ShieldCheck className="h-4 w-4 text-ruby-glacier" aria-hidden="true" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-lg border border-ruby-line bg-ruby-frost">
            <Image
              src="/images/samoyed-brand.png"
              alt="Samoyède, symbole de Ruby Assur’"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 90vw, 380px"
            />
          </div>
          <div>
            <p className="eyebrow">Accompagnement humain</p>
            <h2 className="mt-3 text-3xl font-semibold text-ruby-navy sm:text-4xl">
              Un interlocuteur de proximité pour vos besoins d’assurance
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-700">
              {brand} est une société de courtage et d’intermédiation en assurances basée à Pasly, près de Soissons.
              Son rôle est de vous aider à clarifier vos besoins, comparer les pistes adaptées et préparer une
              décision plus sereine.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-700">
              Chaque situation mérite une analyse spécifique. Les informations présentées sur ce site sont données à
              titre indicatif et ne remplacent pas une étude personnalisée.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-ruby-frost py-16">
        <div className="section-shell">
          <div className="max-w-3xl">
            <p className="eyebrow">Nos assurances</p>
            <h2 className="mt-3 text-3xl font-semibold text-ruby-navy sm:text-4xl">
              Des solutions à étudier pour les particuliers et les professionnels
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {serviceItems.map((service) => (
              <article key={service.title} className="rounded-lg border border-ruby-line bg-white p-5 shadow-sm">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-ruby-glacier text-ruby-navy">
                  <BadgeCheck className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-ruby-navy">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-700">{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="section-shell grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <p className="eyebrow">Pourquoi un courtier</p>
            <h2 className="mt-3 text-3xl font-semibold text-ruby-navy">Un conseil avant le contrat</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
            {[
              "Analyser votre besoin réel avant d’étudier les solutions possibles.",
              "Expliquer les points importants avec des mots simples et concrets.",
              "Vous accompagner dans les démarches sans promettre de tarif ni d’acceptation automatique.",
              "Garder un échange humain, local et accessible dans la durée.",
            ].map((item) => (
              <div key={item} className="rounded-lg border border-ruby-line bg-ruby-frost p-5">
                <Sparkles className="h-5 w-5 text-ruby-gold" aria-hidden="true" />
                <p className="mt-4 text-sm leading-7 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ruby-sand py-16">
        <div className="section-shell grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <p className="eyebrow">Pasly, Soissons, Aisne</p>
            <h2 className="mt-3 text-3xl font-semibold text-ruby-navy">Une présence locale pour un conseil plus proche</h2>
            <p className="mt-5 text-base leading-8 text-slate-700">
              Basée au {legalInfo.address}, Ruby Assur’ accompagne les habitants et professionnels du secteur de
              Pasly, Soissons et plus largement de l’Aisne.
            </p>
          </div>
          <div className="rounded-lg border border-ruby-line bg-white p-6 shadow-sm">
            <div className="flex gap-3">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-ruby-gold" aria-hidden="true" />
              <div>
                <h3 className="font-semibold text-ruby-navy">Ruby Assur’</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">{legalInfo.address}</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">ORIAS : {legalInfo.orias}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ruby-navy py-12 text-white">
        <div className="section-shell flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="eyebrow text-ruby-glacier">Réassurance</p>
            <h2 className="mt-3 text-2xl font-semibold">Courtier inscrit à l’ORIAS sous le numéro {legalInfo.orias}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/75">
              {legalInfo.status}. Les informations du site sont indicatives et ne remplacent pas une étude personnalisée.
            </p>
          </div>
          <Link
            href="/mentions-legales"
            className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/25 px-5 text-sm font-semibold hover:bg-white/10"
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            Mentions légales
          </Link>
        </div>
      </section>

      <section className="bg-white py-16" id="contact">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="eyebrow">Demande de devis ou de rappel</p>
            <h2 className="mt-3 text-3xl font-semibold text-ruby-navy">Parlons de votre besoin</h2>
            <p className="mt-5 text-base leading-8 text-slate-700">
              Décrivez votre situation, le type d’assurance recherché et vos coordonnées. Le formulaire est en mode
              démonstration pour cette version locale.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
