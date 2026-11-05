/** Barre de progression RÉELLE : calculée à partir de l'état des pièces, jamais simulée. Le texte porte aussi l'information. */
export function Progress({ done, total, label = "pièces obligatoires reçues", compact = false }: { done: number; total: number; label?: string; compact?: boolean }) {
  // Produit sans document (questionnaire seul) : pas de barre, pas de « 0/0 ».
  if (total === 0) return <p className={`text-ink-muted ${compact ? "text-[0.8rem]" : "text-[0.9rem]"}`}>Questionnaire seul (aucun document)</p>;
  const pct = Math.round((done / total) * 100);
  return (
    <div className={compact ? "min-w-[7rem]" : ""}>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        aria-label={`${done} sur ${total} ${label}`}
        className={`overflow-hidden rounded-full bg-night/10 ${compact ? "h-1.5" : "h-2.5"}`}
      >
        <div className={`h-full rounded-full transition-[width] duration-700 ease-out ${pct === 100 ? "bg-ok" : "bg-champagne-deep"}`} style={{ width: `${pct}%` }} />
      </div>
      <p className={`mt-1.5 text-ink-muted ${compact ? "text-[0.75rem]" : "text-[0.85rem]"}`}>
        <span className="font-semibold text-night">{done}/{total}</span> {compact ? "" : label}
      </p>
    </div>
  );
}
