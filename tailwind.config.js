module.exports = {
  content: [
    "./layouts/*.vue",
    "./pages/index/*.{vue,jsx,tsx,js}",
    "./pages/posts/*.{vue,jsx,tsx,js}",
    "./pages/tools/*.{vue,jsx,tsx,js}",
    "./public/**/*.html",
  ],
  darkMode: "media",
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
