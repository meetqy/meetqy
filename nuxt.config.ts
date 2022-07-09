import { defineNuxtConfig } from "nuxt";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  typescript: {
    shim: false,
  },
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/strapi", "@nuxt/image-edge"],
  image: {
    strapi: {
      baseURL: "https://strapi.wcao.cc/uploads/f_webp/",
    },
  },

  strapi: {
    entities: ["tag"],
    url: "https://strapi.wcao.cc",
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
          content: "web前端,flutter,uniapp,模板,template,前端工具,blog",
        },
        {
          name: "description",
          content: "收集的多主题模板，模板、前端相关在线工具 - 卧槽(wo caò)",
        },
        {
          name: "viewport",
          content:
            "width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0",
        },
      ],
    },
  },
});
