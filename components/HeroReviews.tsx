"use client";

/*
 * ⚠️  AVIS NON VÉRIFIÉS — À CONFIRMER PAR LE PROPRIÉTAIRE  ⚠️
 * Ces témoignages (nom, texte, 5 étoiles) sont écrits EN DUR dans le code : aucune source
 * (Google, Trustpilot, e-mail de client, accord écrit) ne les atteste dans ce dépôt.
 * Afficher de faux avis est une pratique commerciale trompeuse (Code de la consommation,
 * art. L.121-2 et L.111-7-2). À FAIRE : confirmer l'origine de chaque avis et l'accord du
 * client ; sinon les supprimer ou les remplacer par de vrais avis (ex. Google Business).
 * Tant que `verified` vaut false, ne rien afficher de plus (note chiffrée, étoiles agrégées,
 * balisage schema.org Review/AggregateRating) : AUCUN balisage d'avis n'est publié sur le site.
 */

import { useEffect, useState } from "react";

const reviews = [
  { name: "Marie T.", text: "Très professionnel, réponse rapide !", verified: false },
  { name: "Thomas R.", text: "Mutuelle parfaite trouvée en 48h.", verified: false },
  { name: "Sophie M.", text: "Enfin un courtier qui explique clairement.", verified: false },
  { name: "Pierre L.", text: "Excellent pour mon assurance décennale.", verified: false },
  { name: "Camille D.", text: "Devis gratuit, sans pression. Très à l'écoute.", verified: false },
  { name: "Lucas B.", text: "J'ai économisé sur mon assurance auto sans rien sacrifier.", verified: false },
  { name: "Nathalie F.", text: "Super accompagnement pour notre assurance emprunteur.", verified: false },
  { name: "Karim A.", text: "RC Pro souscrite en 2 jours, impeccable.", verified: false },
  { name: "Julie M.", text: "On m'a expliqué chaque garantie, sans jargon.", verified: false },
  { name: "Romain C.", text: "Vraiment disponible, même le soir. Je recommande.", verified: false },
];

const doubled = [...reviews, ...reviews];

function ReviewCard({ name, text }: { name: string; text: string }) {
  return (
    <div
      className="flex items-start gap-3 rounded-2xl px-4 py-3"
      style={{
        background: "rgba(255,255,255,0.07)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.18)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.22), 0 4px 24px rgba(0,0,0,0.18)",
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

/* ─── Desktop : scroll vertical vers le bas ─── */
export function HeroReviews() {
  return (
    <div
      className="w-72"
      style={{
        maskImage: "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
        height: "180px",
        overflow: "hidden",
      }}
    >
      <div className="animate-scroll-down flex flex-col gap-3">
        {doubled.map((r, i) => (
          <ReviewCard key={i} name={r.name} text={r.text} />
        ))}
      </div>
    </div>
  );
}

/* ─── Mobile : 2 avis en fondu alterné ─── */
export function HeroReviewsMobile() {
  const [pair, setPair] = useState(0);
  const [visible, setVisible] = useState(true);

  const pairs = [
    [reviews[0], reviews[1]],
    [reviews[2], reviews[3]],
    [reviews[4], reviews[5]],
    [reviews[6], reviews[7]],
    [reviews[8], reviews[9]],
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setPair((p) => (p + 1) % pairs.length);
        setVisible(true);
      }, 450);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="flex flex-col gap-3 transition-opacity duration-500"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {pairs[pair].map((r, i) => (
        <ReviewCard key={i} name={r.name} text={r.text} />
      ))}
    </div>
  );
}
