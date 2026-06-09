import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#13243a", deep: "#0c1827" },
        cream: { DEFAULT: "#f5efe6", deep: "#ede4d6" },
        paper: "#fffdf9",
        gold: { DEFAULT: "#bd9a5f", soft: "#d8bd8a" },
        glacier: { DEFAULT: "#7fa9c0", soft: "#cfe0e9" },
        anthracite: "#2a2f36",
        muted: "#5d6675",
        line: "#e3d9c9",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1140px",
      },
      boxShadow: {
        soft: "0 1px 3px rgba(19,36,58,.06), 0 8px 24px rgba(19,36,58,.05)",
        lift: "0 12px 40px rgba(19,36,58,.10)",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "none" },
        },
        fade: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "none" },
        },
      },
      animation: {
        rise: "rise .8s cubic-bezier(.2,.7,.3,1) forwards",
        fade: "fade .5s ease",
      },
    },
  },
  plugins: [],
};

export default config;
