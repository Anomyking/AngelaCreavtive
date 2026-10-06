import type { Config } from "tailwindcss";

/* Angela palette — mirrors the @theme block in src/app/globals.css
   (Tailwind v4 reads the CSS file; this keeps the config in sync).
     navy   #051B39 · indigo #302A78 · cream #F7F3EA · white #FFFFFF        */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          950: "#051B39",
          900: "#0A2244",
          800: "#241F66",
          700: "#302A78",
          600: "#F7F3EA",
          500: "#FFFFFF",
          400: "#1E2D4D",
          300: "#051B39",
          100: "#F7F3EA",
          50:  "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        brand:    "0 4px 24px rgba(5, 27, 57, 0.08)",
        "brand-lg": "0 8px 40px rgba(5, 27, 57, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
