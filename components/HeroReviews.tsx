"use client";

import { useEffect, useState } from "react";

const reviews = [
  { name: "Marie T.", text: "Très professionnel, réponse rapide !" },
  { name: "Thomas R.", text: "Mutuelle parfaite trouvée en 48h." },
  { name: "Sophie M.", text: "Enfin un courtier qui explique clairement." },
  { name: "Pierre L.", text: "Excellent pour mon assurance décennale." },
];

export function HeroReviews() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrent((p) => (p + 1) % reviews.length);
        setVisible(true);
      }, 500);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const r = reviews[current];

  return (
    <div
      className="transition-opacity duration-500"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div className="flex items-start gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
        <div className="flex shrink-0 text-gold text-xs mt-0.5">★★★★★</div>
        <div>
          <p className="text-xs leading-5 text-white/90 italic">"{r.text}"</p>
          <p className="mt-1 text-[10px] font-semibold text-gold">{r.name}</p>
        </div>
      </div>
    </div>
  );
}
