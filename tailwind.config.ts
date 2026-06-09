import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#0A1A35", deep: "#122A52", accent: "#1E3A8A", light: "#2D4FA3" },
        gold: { DEFAULT: "#C9A24B", light: "#D4B06A", muted: "#C9A24B33" },
        off: { white: "#F8FAFC", gray: "#E2E8F0" },
        // Keep legacy ruby colors for Chatbot component compatibility
        ruby: {
          navy: "#0A1A35",
          ink: "#1d2630",
          glacier: "#d9edf4",
          frost: "#f3f8fa",
          sand: "#f4ede2",
          gold: "#C9A24B",
          line: "#E2E8F0",
        },
      },
      fontFamily: {
        display: ["var(--font-manrope)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
        elevated: "0 4px 16px 0 rgb(0 0 0 / 0.08)",
        soft: "0 18px 50px rgba(15, 37, 61, 0.12)",
      },
      borderRadius: { xl: "1rem", "2xl": "1.5rem" },
      animation: {
        scroll: "scroll 30s linear infinite",
        "scroll-up": "scroll-up 18s linear infinite",
      },
      keyframes: {
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "scroll-up": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
