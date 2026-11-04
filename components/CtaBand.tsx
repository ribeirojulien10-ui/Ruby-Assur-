import Link from "next/link";
import { Phone } from "lucide-react";
import { BookingButton } from "./BookingEmbed";

const phone = process.env.NEXT_PUBLIC_PHONE ?? "0671551931";
const fmtPhone = (p: string) => p.replace(/(\d{2})(?=\d)/g, "$1 ").trim();

/** Bandeau d'appel à l'action de fin de page : toujours les trois façons réelles de contacter le cabinet. */
export function CtaBand({
  title = "Parlons de votre assurance.",
  text = "Décrivez votre besoin en quelques minutes : devis gratuit et sans engagement, réponse sous 24 h.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="on-dark relative overflow-hidden bg-night text-white">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full border border-champagne/15" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 h-96 w-96 rounded-full border border-champagne/10" />
      <div className="mx-auto grid w-full max-w-page gap-8 px-gutter py-section lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div>
          <h2 className="text-display-md text-white">{title}</h2>
          <p className="mt-4 max-w-xl text-lead text-white/70">{text}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
          <Link href="/contact" className="btn-gold flex-1">Demander un devis</Link>
          <a href={`tel:${phone}`} className="btn-outline flex-1">
            <Phone className="h-4 w-4" aria-hidden="true" /> {fmtPhone(phone)}
          </a>
          <BookingButton label="Prendre RDV" className="flex-1" />
        </div>
      </div>
    </section>
  );
}
