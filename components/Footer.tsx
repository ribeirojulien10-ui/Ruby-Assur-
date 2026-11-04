import Link from "next/link";
import { ArrowUpRight, Facebook, Mail, MapPin, Phone } from "lucide-react";
import { products } from "@/lib/products";
import { CookieSettingsButton } from "./CookieSettingsButton";
import { Logo } from "./Logo";

const phone = process.env.NEXT_PUBLIC_PHONE ?? "0671551931";
const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@rubyassur.fr";
const fmtPhone = (p: string) => p.replace(/(\d{2})(?=\d)/g, "$1 ").trim();

const col = "text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-champagne";
const link = "block py-1.5 text-[0.95rem] text-white/70 transition hover:text-white";

export function Footer() {
  const part = products.filter((p) => p.audience === "particulier");
  const pro = products.filter((p) => p.audience === "pro");
  return (
    <footer className="on-dark bg-night-950 text-white">
      <div className="mx-auto w-full max-w-page px-gutter pb-10 pt-section">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo tone="light" />
            <p className="mt-6 max-w-sm text-[0.95rem] leading-7 text-white/65">
              Courtier en assurances indépendant dans l&apos;Aisne, au service des particuliers et des professionnels dans toute la France.
            </p>
            <a
              href="https://www.orias.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 transition hover:border-white/40 hover:text-white"
            >
              Immatriculé ORIAS n° 24007878 <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>

          <nav aria-label="Assurances particuliers" className="lg:col-span-2">
            <p className={col}>Particuliers</p>
            <ul className="mt-4">
              {part.map((p) => (
                <li key={p.slug}>
                  <Link href={`/${p.slug}`} className={link}>{p.name}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Assurances professionnelles" className="lg:col-span-3">
            <p className={col}>Professionnels</p>
            <ul className="mt-4">
              {pro.map((p) => (
                <li key={p.slug}>
                  <Link href={`/${p.slug}`} className={link}>{p.name}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <p className={col}>Contact</p>
            <ul className="mt-4 space-y-1">
              <li>
                <a href={`tel:${phone}`} className={`${link} flex items-center gap-2.5`}>
                  <Phone className="h-4 w-4 text-champagne" aria-hidden="true" /> {fmtPhone(phone)}
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className={`${link} flex items-center gap-2.5`}>
                  <Mail className="h-4 w-4 text-champagne" aria-hidden="true" /> {email}
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/rubyassur" target="_blank" rel="noopener noreferrer" className={`${link} flex items-center gap-2.5`}>
                  <Facebook className="h-4 w-4 text-champagne" aria-hidden="true" /> Ruby Assur&apos; sur Facebook
                </a>
              </li>
              <li className="flex items-center gap-2.5 py-1.5 text-[0.95rem] text-white/70">
                <MapPin className="h-4 w-4 shrink-0 text-champagne" aria-hidden="true" /> Aisne · Toute la France
              </li>
            </ul>
            <Link href="/contact" className="btn-gold btn-sm mt-5">Demander un devis</Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-white/10 pt-8 text-[0.85rem] text-white/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} Ruby Assur&apos; — ORIAS 24007878 — SIREN 933 756 074 — Courtier en assurance, sans maniement de fonds.
          </p>
          <nav aria-label="Informations légales" className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <Link href="/mentions-legales" className="transition hover:text-white">Mentions légales</Link>
            <Link href="/politique-confidentialite" className="transition hover:text-white">Confidentialité</Link>
            <Link href="/reclamations" className="transition hover:text-white">Réclamations</Link>
            <CookieSettingsButton />
          </nav>
        </div>
      </div>
    </footer>
  );
}
