/** Logotype provisoire : monogramme + mot-symbole. À remplacer si Julien fournit un logo officiel. */
export function Logo({ className = "", tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const dark = tone === "dark";
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        aria-hidden="true"
        className={`display grid h-9 w-9 shrink-0 place-items-center rounded-[0.7rem] text-[1.35rem] leading-none ${
          dark ? "bg-night text-champagne" : "bg-white/10 text-champagne ring-1 ring-white/20"
        }`}
      >
        R
      </span>
      <span className={`display text-[1.4rem] leading-none tracking-tight ${dark ? "text-night" : "text-white"}`}>
        Ruby <span className={`italic ${dark ? "text-champagne-deep" : "text-champagne"}`}>Assur&apos;</span>
      </span>
    </span>
  );
}
