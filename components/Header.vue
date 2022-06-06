<template>
  <header class="flex justify-between items-center py-12" :class="class">
    <div class="flex items-end">
      <div
        class="flex items-center cursor-pointer logo"
        @click="$router.push('/')"
      >
        <div
          class="w-12 h-12 rounded-full transition-all flex items-center justify-center"
        >
          <W :size="30" />
        </div>
        <div
          class="h-12 text-2xl uppercase inline-flex items-center px-2 rounded-full"
        >
          <span class="font-serif font-semibold">{{ cao }} ,</span>
        </div>
      </div>

      <div class="inline-flex h-12 items-center text-white text-2xl">
        <span class="text-yellow-400">今天星期{{ week }} </span>
      </div>
    </div>

    <span class="text-white underline">
      <slot></slot>
    </span>

    <ul class="text-white text-lg md:flex hidden">
      <li class="py-5 pl-12" v-for="item in navs" :key="item.name">
        <nuxt-link :to="item.url">
          {{ item.name }}
        </nuxt-link>
      </li>

      <!-- <div class="dropdown dropdown-hover" v-for="(item, index) in navs">
        <nuxt-link :to="item.url">
          <label :tabindex="index" class="py-5 pl-2.5 pr-4 mr-4 cursor-pointer">
            {{ item.name }}
          </label>
        </nuxt-link>

        <template v-if="item.children && item.children.length > 0">
          <ul
            :tabindex="index"
            class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li v-for="child in item.children">
              <nuxt-link class="text-base-content" :to="child.url">
                {{ child.name }}
              </nuxt-link>
            </li>
          </ul>
        </template>
      </div> -->
    </ul>
  </header>
</template>

<script lang="ts" setup>
interface Props {
  height?: number;
  class?: string;
}

withDefaults(defineProps<Props>(), {});

interface NavItem {
  name: string;
  url: string;
  children?: NavItem[];
}

const { cao, week } = useTitle();

const navs: NavItem[] = [
  {
    name: "首页",
    url: "/",
    children: [],
  },
  // {
  //   name: "模板",
  //   url: "/template",
  //   children: [],
  // },
  {
    name: "工具",
    url: "javascript:;",
    children: [
      {
        name: "JSON在线工具",
        url: "/tools/json-to-language",
      },
      {
        name: "Image Space",
        url: "/tools/image-space",
      },
    ],
  },
];
</script>

<style lang="postcss" scoped></style>
