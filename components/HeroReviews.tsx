"use client";

const reviews = [
  { name: "Marie T.", text: "Très professionnel, réponse rapide !" },
  { name: "Thomas R.", text: "Mutuelle parfaite trouvée en 48h." },
  { name: "Sophie M.", text: "Enfin un courtier qui explique clairement." },
  { name: "Pierre L.", text: "Excellent pour mon assurance décennale." },
  { name: "Camille D.", text: "Devis gratuit, sans pression. Très à l'écoute." },
];

const doubled = [...reviews, ...reviews];

export function HeroReviews() {
  return (
    <div className="relative h-52 overflow-hidden w-72">
      {/* Fondu haut — se fond dans le hero */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-12 bg-gradient-to-b from-[#0A1A35]/80 to-transparent" />
      {/* Fondu bas */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-[#0A1A35]/90 to-transparent" />

      <div className="animate-scroll-up flex flex-col gap-3">
        {doubled.map((r, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-xl border border-white/15 bg-white/8 px-4 py-3 backdrop-blur-sm"
          >
            <span className="shrink-0 text-gold text-xs mt-0.5">★★★★★</span>
            <div>
              <p className="text-xs leading-5 text-white/85 italic">"{r.text}"</p>
              <p className="mt-1 text-[10px] font-semibold text-gold/80">{r.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
