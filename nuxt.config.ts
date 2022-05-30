import { defineNuxtConfig } from "nuxt";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/strapi"],
  strapi: {
    entities: ["tag"],
    url: "http://35.220.250.52:1337",
  },
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
