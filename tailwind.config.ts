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
        // Dusty-blue palette anchored on #8398B7. Big dark sections use
        // a deeper shade of the same hue (#4c6385) so cream text passes
        // WCAG AA (~5.5:1) while reading clearly as dusty-blue, not
        // gray-navy. `sky` keeps the exact chosen hue for accents,
        // borders, and highlights so #8398B7 stays visibly "the color."
        navy: "#1c2940",
        "navy-deep": "#4c6385",
        // Accents come from the attire motif (lib/config.ts): Silver Gray is
        // the metallic, Warm Gray the neutral. `silver-pale` is for small
        // text on navy-deep, where plain silver falls under 4.5:1.
        silver: "#b9bec6",
        "silver-pale": "#e1e4e9",
        warm: "#b3a89b",
        sky: "#8398b7",
        "sky-pale": "#c5d2e3",
        sand: "#e9dcc2",
        cream: "#f6efe0",
        kraft: "#cdb98a",
        rouge: "#a23a2a",
        ink: "#1a1a1a",
        // legacy aliases kept for safety
        blush: "#e9dcc2",
        "blush-deep": "#cdb98a",
        sage: "#8398b7",
      },
      fontFamily: {
        script: ["var(--font-script)", "cursive"],
        serif: ["var(--font-serif)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      animation: {
        "fade-in": "fadeIn 1.2s ease-out forwards",
        "fade-up": "fadeUp 0.9s ease-out forwards",
        "hero-up": "heroUp 1.1s cubic-bezier(0.16, 1, 0.3, 1) both",
        "zoom-in": "zoomIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in-fast": "fadeIn 0.3s ease-out both",
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
        heroUp: {
          "0%": { opacity: "0", transform: "translateY(28px)", filter: "blur(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)", filter: "blur(0)" },
        },
        zoomIn: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
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
