"use client";

import { useEffect, useState } from "react";

const reviews = [
  { name: "Marie T.", text: "Très professionnel, réponse rapide !" },
  { name: "Thomas R.", text: "Mutuelle parfaite trouvée en 48h." },
  { name: "Sophie M.", text: "Enfin un courtier qui explique clairement." },
  { name: "Pierre L.", text: "Excellent pour mon assurance décennale." },
  { name: "Camille D.", text: "Devis gratuit, sans pression. Très à l'écoute." },
];

const doubled = [...reviews, ...reviews];

/* ─── Carte liquid glass ─── */
function ReviewCard({ name, text }: { name: string; text: string }) {
  return (
    <div
      className="flex items-start gap-3 rounded-2xl px-4 py-3"
      style={{
        background: "rgba(255,255,255,0.07)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.18)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.22), 0 4px 24px rgba(0,0,0,0.18)",
      }}
    >
      <span className="shrink-0 text-[#C9A24B] text-xs mt-0.5">★★★★★</span>
      <div>
        <p className="text-xs leading-5 text-white/85 italic">"{text}"</p>
        <p className="mt-1 text-[10px] font-semibold text-[#C9A24B]/80">{name}</p>
      </div>
    </div>
  );
}

/* ─── Version desktop : défilement vers le bas en continu ─── */
export function HeroReviews() {
  return (
    <div className="relative h-56 overflow-hidden w-72">
      {/* fondu haut — se fond dans le hero */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-14"
        style={{ background: "linear-gradient(to bottom, #0A1A35 0%, transparent 100%)" }}
      />
      {/* fondu bas */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-14"
        style={{ background: "linear-gradient(to top, #0A1A35 0%, transparent 100%)" }}
      />
      <div className="animate-scroll-down flex flex-col gap-3">
        {doubled.map((r, i) => (
          <ReviewCard key={i} name={r.name} text={r.text} />
        ))}
      </div>
    </div>
  );
}

/* ─── Version mobile : rotation avec fondu ─── */
export function HeroReviewsMobile() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrent((p) => (p + 1) % reviews.length);
        setVisible(true);
      }, 450);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const r = reviews[current];

  return (
    <div
      className="transition-opacity duration-500 mx-auto max-w-xs"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <ReviewCard name={r.name} text={r.text} />
    </div>
  );
}
