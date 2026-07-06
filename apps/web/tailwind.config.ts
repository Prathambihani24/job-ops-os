import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        sand: "#f8f3e8",
        clay: "#d97757",
        moss: "#365314",
        steel: "#475569"
      },
      boxShadow: {
        card: "0 18px 50px rgba(17, 24, 39, 0.08)"
      },
      fontFamily: {
        sans: [
          "Inter",
          "Segoe UI",
          "Helvetica Neue",
          "Arial",
          "sans-serif"
        ]
      }
    }
  },
  plugins: []
};

export default config;
