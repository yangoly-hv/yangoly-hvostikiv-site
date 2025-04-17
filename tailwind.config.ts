import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        tabxl: "1101px",
        xl: "1366px",
        laptop: "1512px",
        desk: "1920px",
      },
      colors: {
        white: { DEFAULT: "#FFFFFF" },
        dark: {
          DEFAULT: "#18181B",
        },
        orange: {
          DEFAULT: "#EACCAA",
          bright: "#FFD699",
          bg: "#FFF7E5",
        },
        green: {
          DEFAULT: "#4C7B67",
        },
        gray: {
          DEFAULT: "#27272A",
        },
      },
      fontFamily: {
        raleway: ["var(--font-raleway)", "serif"],
        arial: ["Arial Black", "serif"],
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        marquee2: "marquee2 40s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        marquee2: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0%)" },
        },
      },
      boxShadow: {
        blogCard: "0px 4px 24px 3px rgba(104, 104, 104, 0.12)",
        pagination: "0px 10px 56px 2px #7979791F",
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
};
export default config;
