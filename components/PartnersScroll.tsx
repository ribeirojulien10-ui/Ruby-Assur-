"use client";

const partners = [
  "AXA", "Generali", "April", "Zephyr", "Allianz",
  "Groupama", "MMA", "Maif", "Swiss Life", "Covéa",
];

export function PartnersScroll() {
  const doubled = [...partners, ...partners];
  return (
    <div className="overflow-hidden bg-white py-6 border-y border-off-gray">
      <p className="text-center text-xs font-bold uppercase tracking-widest text-gold mb-4">
        Compagnies comparées
      </p>
      <div className="relative">
        <div className="flex animate-scroll gap-10 whitespace-nowrap">
          {doubled.map((p, i) => (
            <span
              key={i}
              className="inline-flex items-center text-base font-bold text-navy/40 transition hover:text-navy"
            >
              {p}
              <span className="ml-10 text-gold/30">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
