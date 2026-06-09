import Link from "next/link";
import { Logo } from "./Logo";
import { Phone, Mail, MapPin } from "lucide-react";

const phone = process.env.NEXT_PUBLIC_PHONE ?? "0671551931";
const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "ruby.assur@gmail.com";

const navLinks: [string, string][] = [
  ["Particuliers", "/particuliers"],
  ["Professionnels", "/professionnels"],
  ["À propos", "/a-propos"],
  ["Contact", "/contact"],
];

const legalLinks: [string, string][] = [
  ["Mentions légales", "/mentions-legales"],
  ["Politique de confidentialité", "/politique-confidentialite"],
  ["Réclamations", "/reclamations"],
];

export function Footer() {
  return (
    <footer className="border-t border-off-gray bg-navy text-white">
      <div className="container-shell grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo className="text-white [&_span]:text-gold" />
          <p className="mt-4 text-sm leading-7 text-white/60">
            Courtier en assurances indépendant, inscrit à l&apos;ORIAS sous le n° 24007878. Basé à Pasly, Soissons.
          </p>
        </div>
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gold">Navigation</p>
          {navLinks.map(([l, h]) => (
            <Link key={h} href={h} className="block py-1 text-sm text-white/70 transition hover:text-white">{l}</Link>
          ))}
        </div>
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gold">Contact</p>
          <a href={`tel:${phone}`} className="flex items-center gap-2 py-1 text-sm text-white/70 hover:text-white">
            <Phone className="h-4 w-4 text-gold" />{phone}
          </a>
          <a href={`mailto:${email}`} className="flex items-center gap-2 py-1 text-sm text-white/70 hover:text-white">
            <Mail className="h-4 w-4 text-gold" />{email}
          </a>
          <p className="flex items-start gap-2 py-1 text-sm text-white/70">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />44 avenue du Bois Roger, 02200 Pasly
          </p>
        </div>
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gold">Légal</p>
          {legalLinks.map(([l, h]) => (
            <Link key={h} href={h} className="block py-1 text-sm text-white/70 transition hover:text-white">{l}</Link>
          ))}
          <p className="mt-4 text-xs text-white/40">
            ORIAS 24007878 — SIREN 933 756 074<br />© {new Date().getFullYear()} Ruby Assur&apos;
          </p>
        </div>
      </div>
    </footer>
  );
}
