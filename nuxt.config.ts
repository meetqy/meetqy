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

  autoImports: {
    dirs: ["components/", "composables/", "fragments/"],
  },

  // (wo caò)、(wò cao)、(wǒ caó)、(wǒ caò)、(wō caō)、(wō caō)
  css: ["~/assets/iconfont.css"],
  app: {
    head: {
      meta: [
        {
          name: "keywords",
          content: "web前端,flutter,uniapp,模板,template,flutter,前端工具,blog",
        },
        {
          name: "description",
          content: "收集的多主题模板，模板、前端相关在线工具 - 卧槽(wo caò)",
        },
        {
          name: "theme-color",
          content: "#6d327c",
        },
      ],
    },
  },
});
