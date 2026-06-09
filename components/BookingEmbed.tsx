"use client";
const calLink = process.env.NEXT_PUBLIC_CAL_LINK;

export function BookingButton({ label = "Prendre RDV", className = "" }: { label?: string; className?: string }) {
  if (!calLink) {
    return (
      <button disabled className={`btn-outline opacity-50 cursor-not-allowed ${className}`} title="Prise de RDV bientôt disponible">
        {label} (bientôt)
      </button>
    );
  }
  return (
    <a href={calLink} target="_blank" rel="noopener noreferrer" className={`btn-outline ${className}`}>{label}</a>
  );
}
