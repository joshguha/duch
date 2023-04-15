const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    colors: {
      green: {
        DEFAULT: "#17ff49",
        100: "#13a83d",
      },
      dark: "#010501",
      white: "#ebebeb",
      offWhite: "#eaede8",
      offBlack: {
        10: "rgb(var(--color-dark-overlay) / 0.08)",
      },
      red: { DEFAULT: "#fa1100", 100: "#b00017" },
    },
    fontFamily: {
      sans: [fontFamily.sans],
      heading: ["var(--font-russo)", fontFamily.sans],
    },
    keyframes: {
      fadeInUp: {
        "0%": { transform: "translateY(10px)", opacity: "0" },
        "100%": { transform: "translateY(0)", opacity: "1" },
      },
      fadeIn: {
        "0%": { opacity: "0" },
        "100%": { opacity: "1" },
      },
      fadeOut: {
        "0%": { opacity: "1" },
        "100%": { opacity: "0" },
      },
    },
    animation: {
      fadeInUp: "fadeInUp 1s ease-in-out 1",
      fadeIn: "fadeIn 0.2s ease-in-out 1",
      fadeOut: "fadeOut 0.2s ease-in-out 1",
    },
  },
  plugins: [],
};
