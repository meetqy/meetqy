import { defineNuxtConfig } from "nuxt";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/strapi"],
  strapi: {
    entities: ["tag"],
    url: "https://wcao.cc/strapi",
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
