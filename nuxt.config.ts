import { defineNuxtConfig } from "nuxt";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/strapi", "~/modules/sitemap"],
  strapi: {
    entities: ["tag"],
    url: "https://wcao.cc/strapi",
  },
  sitemap: {
    hostname: "https://wcao.cc",
  },
  build: {
    cache: true,
    postcss: {
      postcssOptions: {
        "postcss-color-gray": {},
      },
    },
  },

  // (wo caò)、(wò cao)、(wǒ caó)、(wǒ caò)、(wō caō)、(wō caō)
  css: ["~/assets/iconfont.css"],
  app: {
    head: {
      title: " ",
      meta: [
        {
          name: "keywords",
          content: "web前端,flutter,uniapp,模板,template,flutter,前端工具,blog",
        },
        {
          name: "description",
          content:
            "卧槽(wo caò),卧槽(wò cao),卧槽(wǒ caó),卧槽(wǒ caò),卧槽(wō caō),卧槽(wō caō)",
        },
        {
          name: "theme-color",
          content: "#6d327c",
        },
      ],
    },
  },

  vite: {
    esbuild: {},
  },
});
