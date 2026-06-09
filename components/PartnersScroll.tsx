"use client";

const partners = [
  { name: "AXA", color: "#00008F" },
  { name: "Generali", color: "#c8102e" },
  { name: "Allianz", color: "#003781" },
  { name: "Groupama", color: "#007A3D" },
  { name: "MMA", color: "#e4002b" },
  { name: "Maif", color: "#005792" },
  { name: "Swiss Life", color: "#b40000" },
  { name: "April", color: "#e30613" },
  { name: "Zephyr", color: "#1a3c6e" },
  { name: "Covéa", color: "#003865" },
];

const doubled = [...partners, ...partners];

export function PartnersScroll() {
  return (
    <div className="overflow-hidden bg-white py-8 border-y border-off-gray">
      <p className="text-center text-xs font-bold uppercase tracking-widest text-gold mb-6">
        Compagnies comparées
      </p>
      <div className="relative overflow-hidden">
        <div className="flex animate-scroll items-center gap-8 whitespace-nowrap">
          {doubled.map((p, i) => (
            <span
              key={i}
              className="inline-flex h-10 items-center rounded-lg border border-gray-100 px-4 text-sm font-bold shadow-sm transition hover:shadow-md"
              style={{ color: p.color, borderColor: `${p.color}22`, background: `${p.color}08` }}
            >
              {p.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
