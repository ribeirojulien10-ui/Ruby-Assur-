import type { Config } from "tailwindcss";

/**
 * DESIGN SYSTEM Ruby Assur' — jetons (tokens) uniques.
 *
 * Direction artistique : bleu nuit profond + ivoire chaud + or champagne employé avec parcimonie.
 * Titres : Fraunces (serif expressive, avec italiques) ; interface : Inter (lisibilité maximale).
 *
 * Les noms historiques (navy, gold, off, ruby) sont conservés pour ne pas casser les pages
 * existantes (pages légales, chatbot) : ils pointent désormais vers la nouvelle palette.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    screens: { xs: "480px", sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1536px" },
    extend: {
      colors: {
        // Bleu nuit
        night: { DEFAULT: "#0A1A35", 950: "#060F20", 900: "#0A1A35", 800: "#0F2347", 700: "#17315E", 600: "#274677", 500: "#3B5A8F" },
        // Neutres chauds
        ivory: { DEFAULT: "#F6F1E7", deep: "#ECE4D2", soft: "#FAF7F0" },
        paper: "#FCFAF6",
        // Or champagne (texte sur fond clair : utiliser `champagne-ink`)
        champagne: { DEFAULT: "#C9A96B", light: "#E6D3A9", deep: "#94742F", ink: "#7A5F25" },
        ink: { DEFAULT: "#16202F", soft: "#364255", muted: "#5B6679", faint: "#5F6A7D" },
        line: { DEFAULT: "#E3DAC6", cool: "#DDE3EC", dark: "rgb(255 255 255 / 0.12)" },
        // États (portail) : toujours accompagnés d'un libellé et d'une icône
        ok: { DEFAULT: "#1E7A4C", soft: "#E3F2EA" },
        warn: { DEFAULT: "#8A5A00", soft: "#FBF0D6" },
        danger: { DEFAULT: "#B3261E", soft: "#FBE6E4" },
        info: { DEFAULT: "#1F4E99", soft: "#E4ECF8" },

        // ── alias historiques ──
        navy: { DEFAULT: "#0A1A35", deep: "#0F2347", accent: "#17315E", light: "#274677" },
        gold: { DEFAULT: "#C9A24B", light: "#E6D3A9", muted: "#C9A24B33", ink: "#7A5F25" },
        off: { white: "#F6F1E7", gray: "#E3DAC6" },
        ruby: {
          navy: "#0A1A35",
          ink: "#16202F",
          glacier: "#E6D3A9",
          frost: "#F6F1E7",
          sand: "#ECE4D2",
          gold: "#A98846",
          line: "#E3DAC6",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // titres fluides : de 320 px à 1920 px sans rupture
        "display-xl": ["clamp(2.5rem, 1.6rem + 4.4vw, 5.25rem)", { lineHeight: "1.02", letterSpacing: "-0.025em" }],
        "display-lg": ["clamp(2.1rem, 1.5rem + 2.8vw, 3.75rem)", { lineHeight: "1.06", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(1.75rem, 1.35rem + 1.8vw, 2.75rem)", { lineHeight: "1.12", letterSpacing: "-0.015em" }],
        "display-sm": ["clamp(1.4rem, 1.2rem + 0.9vw, 1.9rem)", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        lead: ["clamp(1.05rem, 1rem + 0.3vw, 1.25rem)", { lineHeight: "1.7" }],
      },
      spacing: { section: "clamp(4rem, 3rem + 5vw, 8rem)", gutter: "clamp(1rem, 0.5rem + 2vw, 2rem)" },
      maxWidth: { page: "76rem", prose: "40rem" },
      borderRadius: { sm: "0.375rem", md: "0.625rem", lg: "1rem", xl: "1.5rem", "2xl": "2rem" },
      boxShadow: {
        hairline: "0 0 0 1px rgb(10 26 53 / 0.07)",
        card: "0 1px 2px rgb(10 26 53 / 0.04), 0 0 0 1px rgb(10 26 53 / 0.06)",
        lift: "0 18px 40px -18px rgb(10 26 53 / 0.28)",
        elevated: "0 18px 40px -18px rgb(10 26 53 / 0.28)",
        soft: "0 18px 40px -18px rgb(10 26 53 / 0.2)",
      },
      transitionTimingFunction: { out: "cubic-bezier(0.22, 1, 0.36, 1)" },
      animation: {
        scroll: "scroll 60s linear infinite",
        fade: "fade 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        "menu-in": "menu-in 0.22s cubic-bezier(0.22, 1, 0.36, 1) both",
        "scroll-up": "scroll-up 18s linear infinite",
        "scroll-down": "scroll-down 18s linear infinite",
      },
      keyframes: {
        scroll: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        fade: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "fade-up": { "0%": { opacity: "0", transform: "translateY(14px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "menu-in": { "0%": { opacity: "0", transform: "translateY(-6px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "scroll-up": { "0%": { transform: "translateY(0)" }, "100%": { transform: "translateY(-50%)" } },
        "scroll-down": { "0%": { transform: "translateY(-50%)" }, "100%": { transform: "translateY(0)" } },
      },
    },
  },
  plugins: [],
};
export default config;
