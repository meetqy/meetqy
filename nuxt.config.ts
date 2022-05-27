import { defineNuxtConfig } from "nuxt";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss"],
  build: {
    postcss: {
      postcssOptions: {
        "postcss-color-gray": {},
      },
    },
  },
  css: ["~/assets/iconfont.css"],
  app: {},
});
