import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ruby: {
          navy: "#0f253d",
          ink: "#1d2630",
          glacier: "#d9edf4",
          frost: "#f3f8fa",
          sand: "#f4ede2",
          gold: "#b7924a",
          line: "#d7dfe4",
        },
      },
      boxShadow: {
        soft: "0 18px 50px rgba(15, 37, 61, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
