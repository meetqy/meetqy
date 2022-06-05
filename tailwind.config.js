module.exports = {
  content: ["./layouts/**/*.vue", "./pages/**/*.{vue,jsx,tsx}"],
  darkMode: "media",
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
