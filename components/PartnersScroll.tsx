"use client";

import Image from "next/image";

const partners = [
  { name: "AXA", domain: "axa.fr" },
  { name: "Generali", domain: "generali.fr" },
  { name: "Allianz", domain: "allianz.fr" },
  { name: "Groupama", domain: "groupama.fr" },
  { name: "MMA", domain: "mma.fr" },
  { name: "Maif", domain: "maif.fr" },
  { name: "Swiss Life", domain: "swisslife.fr" },
  { name: "April", domain: "april.fr" },
  { name: "Zephyr", domain: "zephyr-assurances.fr" },
  { name: "Covéa", domain: "covea.fr" },
];

const names = [...partners, ...partners];
const logos = [...partners, ...partners];

export function PartnersScroll() {
  return (
    <div className="overflow-hidden bg-white py-6 border-y border-off-gray">
      <p className="text-center text-xs font-bold uppercase tracking-widest text-gold mb-5">
        Compagnies comparées
      </p>

      {/* Logos défilants */}
      <div className="relative overflow-hidden mb-4">
        <div className="flex animate-scroll gap-10 whitespace-nowrap items-center">
          {logos.map((p, i) => (
            <div key={i} className="inline-flex h-8 w-20 shrink-0 items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition">
              <Image
                src={`https://logo.clearbit.com/${p.domain}`}
                alt={p.name}
                width={80}
                height={32}
                className="object-contain max-h-8"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>

      {/* Noms défilants en dessous */}
      <div className="relative overflow-hidden">
        <div className="flex animate-scroll gap-8 whitespace-nowrap" style={{ animationDuration: "20s", animationDirection: "reverse" }}>
          {names.map((p, i) => (
            <span key={i} className="inline-flex items-center text-xs font-semibold text-navy/30">
              {p.name}
              <span className="ml-8 text-gold/20">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
