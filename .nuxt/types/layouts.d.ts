import { ComputedRef, Ref } from 'vue'
export type LayoutKey = "default" | "tools"
declare module "/Users/meetqy/Desktop/my-template/nuxt-wcao.cc/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    layout?: false | LayoutKey | Ref<LayoutKey> | ComputedRef<LayoutKey>
  }
}