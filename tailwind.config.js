/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "sans-serif"],
        serif: ["'Playfair Display'", "serif"],
      },
      colors: {
        navy: {
          DEFAULT: "#0d2240",
          light: "#163459",
        },
        accent: {
          DEFAULT: "#1e60c8",
          hover: "#1751a8",
        },
      },
      keyframes: {
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.25s ease-out",
      },
    },
  },
  plugins: [],
};
