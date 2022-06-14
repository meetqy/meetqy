module.exports = {
  content: ["./layouts/**/*.vue", "./pages/**/*.{vue,jsx,tsx,js}"],
  darkMode: "media",
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
