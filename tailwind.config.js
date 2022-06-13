module.exports = {
  content: [
    "./layouts/**/*.vue",
    "./pages/**/*.{vue,jsx,tsx,js}",
    "./templates/**/*.js",
  ],
  darkMode: "media",
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
