import type { Config } from "tailwindcss";
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        main: '#f2bd4c',
        overlay: 'rgba(0,0,0,0.8)', // background color overlay for alert dialogs, modals, etc.

        // light mode
        bg: '#FEF2E8',
        text: '#000',
        border: '#000',

        // dark mode
        darkBg: '#374151',
        darkText: '#f8f4dd',
        darkTextSecondary: '#f9f4da',
        darkBorder: '#000',
        secondaryBlack: '#212121', // opposite of plain white, not used pitch black because borders and box-shadows are that color
      },
      borderRadius: {
        base: '5px'
      },
      boxShadow: {
        light: '4px 4px 0px 0px #000',
        dark: '4px 4px 0px 0px #000',
      },
      translate: {
        boxShadowX: '4px',
        boxShadowY: '4px',
        reverseBoxShadowX: '-4px',
        reverseBoxShadowY: '-4px',
      },
      fontWeight: {
        base: '500',
        heading: '700',
      },
    },
  },
  // plugins: [addVariablesForColors, require("tailwindcss-animate")],
};
export default config;

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}
