import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        primary: {
          DEFAULT: "var(--color-primary)",
          light: "var(--color-primary-light)",
        },
      },
      animation: {
        "ken-burns": "kenBurns 30s ease-in-out infinite",
        "float": "float 8s ease-in-out infinite",
        "float-delayed": "floatDelayed 10s ease-in-out infinite",
        "float-slow": "floatSlow 12s ease-in-out infinite",
        "pulse-slow": "pulseSlow 4s ease-in-out infinite",
      },
      keyframes: {
        kenBurns: {
          "0%": { transform: "scale(1) translate(0, 0)" },
          "50%": { transform: "scale(1.1) translate(-2%, -2%)" },
          "100%": { transform: "scale(1) translate(0, 0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "25%": { transform: "translateY(-20px) translateX(10px)" },
          "50%": { transform: "translateY(-10px) translateX(-10px)" },
          "75%": { transform: "translateY(-30px) translateX(5px)" },
        },
        floatDelayed: {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "25%": { transform: "translateY(-15px) translateX(-10px)" },
          "50%": { transform: "translateY(-25px) translateX(10px)" },
          "75%": { transform: "translateY(-10px) translateX(-5px)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0) translateX(0) scale(1)" },
          "33%": { transform: "translateY(-10px) translateX(15px) scale(1.1)" },
          "66%": { transform: "translateY(-20px) translateX(-10px) scale(0.9)" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "0.1" },
          "50%": { opacity: "0.2" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

