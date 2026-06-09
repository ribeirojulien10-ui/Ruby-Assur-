"use client";

import { useEffect, useState } from "react";

const reviews = [
  { name: "Marie T.", text: "Très professionnel, réponse rapide. Je recommande vivement !", stars: 5 },
  { name: "Thomas R.", text: "Ruby Assur' a trouvé une mutuelle parfaite pour ma famille en 48h.", stars: 5 },
  { name: "Sophie M.", text: "Enfin un courtier qui explique clairement sans jargon.", stars: 5 },
  { name: "Pierre L.", text: "Excellent accompagnement pour mon assurance décennale.", stars: 5 },
  { name: "Camille D.", text: "Devis gratuit, sans pression. Très à l'écoute.", stars: 5 },
];

export function ReviewsCarousel() {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % reviews.length);
        setFade(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const review = reviews[current];

  return (
    <div className="bg-navy py-12 text-white">
      <div className="container-shell text-center">
        <p className="eyebrow text-gold mb-6">Ce que disent nos clients</p>
        <div
          className="mx-auto max-w-2xl px-4 transition-opacity duration-400"
          style={{ opacity: fade ? 1 : 0 }}
        >
          <div className="flex justify-center gap-1 text-gold text-lg sm:text-xl mb-4">
            {"★".repeat(review.stars)}
          </div>
          <p className="text-base sm:text-lg font-medium italic text-white/90 leading-7">
            &ldquo;{review.text}&rdquo;
          </p>
          <p className="mt-4 text-sm font-semibold text-gold">— {review.name}</p>
        </div>
        {/* Indicateurs */}
        <div className="mt-6 flex justify-center gap-2">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => { setFade(false); setTimeout(() => { setCurrent(i); setFade(true); }, 400); }}
              className={`h-1.5 rounded-full transition-all ${i === current ? "w-6 bg-gold" : "w-1.5 bg-white/30"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
