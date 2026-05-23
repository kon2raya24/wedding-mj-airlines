import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Vintage airline palette
        navy: "#0e2a47",
        "navy-deep": "#081a2e",
        gold: "#c89b3c",
        "gold-soft": "#e6c98a",
        sky: "#7aa9c9",
        "sky-pale": "#cfe2ef",
        sand: "#e9dcc2",
        cream: "#f6efe0",
        kraft: "#cdb98a",
        rouge: "#a23a2a",
        ink: "#1a1a1a",
        // legacy aliases kept for safety
        blush: "#e9dcc2",
        "blush-deep": "#cdb98a",
        champagne: "#c89b3c",
        sage: "#7aa9c9",
      },
      fontFamily: {
        script: ["var(--font-script)", "cursive"],
        serif: ["var(--font-serif)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 1.2s ease-out forwards",
        "fade-up": "fadeUp 0.9s ease-out forwards",
        "float-slow": "float 6s ease-in-out infinite",
        "confetti": "confetti 2.5s ease-out forwards",
        "stamp": "stamp 0.6s cubic-bezier(.22,1.5,.36,1) forwards",
        "fly": "fly 28s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        confetti: {
          "0%": { transform: "translateY(0) rotate(0)", opacity: "1" },
          "100%": { transform: "translateY(400px) rotate(720deg)", opacity: "0" },
        },
        stamp: {
          "0%": { transform: "scale(2) rotate(0deg)", opacity: "0" },
          "100%": { transform: "scale(1) rotate(-8deg)", opacity: "1" },
        },
        fly: {
          "0%": { transform: "translate3d(-10vw, 10vh, 0) rotate(8deg)" },
          "100%": { transform: "translate3d(110vw, -10vh, 0) rotate(8deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
