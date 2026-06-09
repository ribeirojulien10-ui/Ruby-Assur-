import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, ShieldCheck } from "lucide-react";
import { brand, legalInfo, navLinks, serviceItems } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-ruby-line bg-ruby-navy text-white">
      <div className="section-shell grid gap-10 py-12 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/images/samoyed-brand.png"
              alt="Logo Ruby Assur’ avec samoyède"
              width={56}
              height={56}
              className="h-14 w-14 rounded-full border border-white/20 object-cover"
            />
            <div>
              <p className="text-xl font-semibold">{brand}</p>
              <p className="mt-1 text-sm text-white/70">Courtier en assurance, sans maniement de fonds</p>
            </div>
          </div>
          <div className="mt-6 space-y-3 text-sm text-white/75">
            <p className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ruby-gold" aria-hidden="true" />
              <span>{legalInfo.address}</span>
            </p>
            <p className="flex gap-2">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-ruby-gold" aria-hidden="true" />
              <span>ORIAS {legalInfo.orias} - {legalInfo.status}</span>
            </p>
            <p className="flex gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-ruby-gold" aria-hidden="true" />
              <span>Formulaire de contact en mode démonstration</span>
            </p>
          </div>
        </div>

        <div>
          <p className="font-semibold">Navigation</p>
          <ul className="mt-4 space-y-3 text-sm text-white/75">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="focus-ring rounded-md hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/mentions-legales" className="focus-ring rounded-md hover:text-white">
                Mentions légales
              </Link>
            </li>
            <li>
              <Link href="/reclamations" className="focus-ring rounded-md hover:text-white">
                Réclamations
              </Link>
            </li>
            <li>
              <Link href="/politique-confidentialite" className="focus-ring rounded-md hover:text-white">
                Politique de confidentialité
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-semibold">Assurances</p>
          <ul className="mt-4 space-y-3 text-sm text-white/75">
            {serviceItems.slice(0, 7).map((service) => (
              <li key={service.title}>{service.title}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="section-shell flex flex-col gap-2 py-5 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
          <p>{legalInfo.name} - SIREN {legalInfo.siren} - RCS {legalInfo.rcs}</p>
          <p>Informations données à titre indicatif, sous réserve d’une étude personnalisée.</p>
        </div>
      </div>
    </footer>
  );
}
