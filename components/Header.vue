<template>
  <header class="flex justify-between items-center" :class="class">
    <Logo />

    <span class="text-base-100 underline">
      <slot></slot>
    </span>

    <ul class="text-base-100 text-lg md:flex hidden">
      <li class="py-5 pl-12" v-for="item in navs" :key="item.name">
        <nuxt-link :to="item.url">
          {{ item.name }}
        </nuxt-link>
      </li>
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
  //   url: "javascript:;",
  //   children: [],
  // },
  // {
  //   name: "工具",
  //   url: "javascript:;",
  //   children: [
  //     {
  //       name: "JSON在线工具",
  //       url: "/tools/json-to-language",
  //     },
  //     {
  //       name: "Image Space",
  //       url: "/tools/image-space",
  //     },
  //   ],
  // },
];
</script>

<style lang="postcss" scoped></style>
