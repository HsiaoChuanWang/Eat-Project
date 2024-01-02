const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      phone: { min: "360px", max: "767px" },

      tablet: { min: "768px", max: "1023px" },

      laptop: { min: "1024px", max: "1279px" },

      desktop: { max: "1280px" },
    },
  },
  darkMode: "class",
  plugins: [nextui(), require("daisyui")],
};
