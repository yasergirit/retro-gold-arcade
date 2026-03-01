import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', "monospace"],
      },
      colors: {
        neon: {
          cyan: "#00fff7",
          magenta: "#ff00e6",
          gold: "#ffd700",
        },
        dark: {
          bg: "#0a0a0f",
          card: "#12121a",
          border: "#1e1e2e",
        },
      },
      boxShadow: {
        "neon-cyan": "0 0 10px #00fff7, 0 0 20px #00fff766",
        "neon-magenta": "0 0 10px #ff00e6, 0 0 20px #ff00e666",
        "neon-gold": "0 0 10px #ffd700, 0 0 20px #ffd70066",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        flicker: "flicker 2s linear infinite",
      },
      keyframes: {
        flicker: {
          "0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%": { opacity: "1" },
          "20%, 24%, 55%": { opacity: "0.4" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
