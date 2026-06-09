type EmblemProps = {
  size?: number;
  variant?: "badge" | "ring" | "plain";
  className?: string;
};

// Emblème samoyède Ruby Assur' — fourrure ébouriffée, symbole de protection & fidélité.
// variant "badge" : pastille navy (header, favicon, fonds clairs)
// variant "ring"  : pastille navy + anneau or (fonds sombres, ex. footer)
// variant "plain" : sans cercle (usages libres)
export default function Emblem({
  size = 42,
  variant = "badge",
  className = "",
}: EmblemProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Emblème Ruby Assur"
    >
      {variant !== "plain" && (
        <circle cx="60" cy="60" r="58" fill="#13243a" />
      )}
      {variant === "ring" && (
        <circle cx="60" cy="60" r="52" fill="none" stroke="#bd9a5f" strokeWidth="1.8" />
      )}

      {/* oreilles */}
      <path d="M-30 -20 C-35 -40 -27 -48 -19 -44 C-16 -36 -13 -30 -10 -26 Z" fill="#fffdf9" transform="translate(60,62)" />
      <path d="M30 -20 C35 -40 27 -48 19 -44 C16 -36 13 -30 10 -26 Z" fill="#fffdf9" transform="translate(60,62)" />
      <path d="M-26 -23 C-29 -36 -24 -42 -19 -39 C-17 -33 -15 -29 -13 -26 Z" fill="#e7c9c9" transform="translate(60,62)" />
      <path d="M26 -23 C29 -36 24 -42 19 -39 C17 -33 15 -29 13 -26 Z" fill="#e7c9c9" transform="translate(60,62)" />

      {/* sous-couche de fourrure (ombre) */}
      <path d="M 60.0 35.2 L 61.7 40.8 L 64.3 33.9 L 65.2 40.0 L 68.7 34.3 L 69.1 39.7 L 73.4 34.7 L 73.1 40.1 L 77.9 36.1 L 77.1 41.1 L 83.8 36.5 L 81.1 42.9 L 86.7 40.8 L 84.8 45.4 L 90.3 44.5 L 88.1 48.6 L 94.0 48.5 L 90.9 52.5 L 96.7 53.2 L 93.0 56.8 L 98.7 58.4 L 94.3 61.5 L 99.5 64.0 L 95.3 66.5 L 100.7 69.9 L 96.3 71.9 L 102.4 76.4 L 96.4 77.6 L 102.1 83.2 L 95.4 83.3 L 101.2 90.5 L 93.3 88.9 L 97.3 96.3 L 90.0 94.0 L 92.7 101.7 L 85.6 98.2 L 87.4 106.7 L 80.4 101.4 L 81.5 111.1 L 74.7 103.4 L 74.3 112.6 L 68.7 104.0 L 67.2 114.1 L 62.8 103.4 L 60.0 113.2 L 57.2 103.1 L 53.0 112.5 L 51.5 103.2 L 46.3 110.7 L 45.8 102.2 L 38.9 110.3 L 40.4 99.9 L 32.6 106.7 L 35.5 96.7 L 27.9 101.0 L 31.4 92.6 L 23.1 95.9 L 28.3 87.8 L 21.0 89.0 L 26.0 82.5 L 17.5 83.4 L 24.8 77.1 L 17.1 76.6 L 24.6 71.7 L 17.7 70.1 L 25.0 66.5 L 18.3 64.0 L 25.7 61.5 L 21.6 58.5 L 27.0 56.8 L 22.5 53.0 L 29.1 52.5 L 24.6 47.8 L 31.9 48.6 L 27.9 43.4 L 35.2 45.4 L 33.0 40.6 L 38.9 42.9 L 38.0 38.6 L 42.9 41.1 L 41.6 35.4 L 46.9 40.1 L 47.1 35.9 L 50.9 39.7 L 51.1 33.8 L 54.8 40.0 L 56.0 36.4 L 58.3 40.8 Z" fill="#c9d0db" opacity="0.9" />
      {/* fourrure principale */}
      <path d="M 60.0 34.4 L 61.7 38.8 L 64.0 33.9 L 65.2 38.0 L 68.8 31.9 L 69.1 37.7 L 72.8 33.9 L 73.1 38.1 L 78.2 33.7 L 77.1 39.1 L 82.5 36.0 L 81.1 40.9 L 86.2 39.3 L 84.8 43.4 L 91.3 41.9 L 88.1 46.6 L 93.3 46.8 L 90.9 50.5 L 97.2 51.1 L 93.0 54.8 L 97.9 56.5 L 94.3 59.5 L 98.9 62.0 L 95.3 64.5 L 101.7 68.0 L 96.3 69.9 L 103.9 74.9 L 96.4 75.6 L 101.6 81.0 L 95.4 81.3 L 100.3 87.9 L 93.3 86.9 L 98.3 95.2 L 90.0 92.0 L 94.5 101.8 L 85.6 96.2 L 88.1 105.7 L 80.4 99.4 L 81.3 108.7 L 74.7 101.4 L 74.8 112.4 L 68.7 102.0 L 66.9 109.9 L 62.8 101.4 L 60.0 111.3 L 57.2 101.1 L 53.1 110.1 L 51.5 101.2 L 46.3 108.8 L 45.8 100.2 L 39.7 106.5 L 40.4 97.9 L 33.4 103.5 L 35.5 94.7 L 27.1 100.0 L 31.4 90.6 L 24.3 92.9 L 28.3 85.8 L 20.3 87.5 L 26.0 80.5 L 18.3 81.0 L 24.8 75.1 L 18.5 74.2 L 24.6 69.7 L 18.5 68.0 L 25.0 64.5 L 21.2 62.0 L 25.7 59.5 L 22.1 56.6 L 27.0 54.8 L 23.5 51.3 L 29.1 50.5 L 24.8 45.9 L 31.9 46.6 L 28.9 42.0 L 35.2 43.4 L 33.2 38.8 L 38.9 40.9 L 37.0 35.5 L 42.9 39.1 L 41.9 33.9 L 46.9 38.1 L 46.9 33.3 L 50.9 37.7 L 51.0 31.5 L 54.8 38.0 L 55.7 32.2 L 58.3 38.8 Z" fill="#fffdf9" />

      {/* visage */}
      <g transform="translate(60,62)">
        <path d="M-19 -5 Q-13 -12 -5 -6 Q-12 -1 -19 -5 Z" fill="#1b2a40" />
        <path d="M19 -5 Q13 -12 5 -6 Q12 -1 19 -5 Z" fill="#1b2a40" />
        <circle cx="-10" cy="-7" r="1.2" fill="#fffdf9" />
        <circle cx="10" cy="-7" r="1.2" fill="#fffdf9" />
        <path d="M0 4 C5.5 4 7 8.5 4.5 11 C2.5 13 -2.5 13 -4.5 11 C-7 8.5 -5.5 4 0 4 Z" fill="#1b2a40" />
        <path d="M0 12 L0 15" stroke="#1b2a40" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M-11 15 Q0 24 11 15" stroke="#bd9a5f" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}
