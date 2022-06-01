<template>
  <header
    :style="`height: ${height}px`"
    class="flex justify-between items-center"
    :class="class"
  >
    <div class="flex items-end cursor-pointer" @click="$router.push('/')">
      <W class="fill-black" :size="32" />
      <C class="fill-white" :size="24" />
      <A class="fill-white" :size="24" />
      <O class="fill-white" :size="24" />
    </div>

    <ul class="text-white text-lg flex">
      <li class="py-5 pl-2.5 pr-4 mr-4" v-for="item in navs" :key="item.name">
        <nuxt-link :to="item.url">{{ item.name }}</nuxt-link>
      </li>
    </ul>
  </header>
</template>

<script lang="ts" setup>
interface Props {
  height?: number;
  class?: string;
}

withDefaults(defineProps<Props>(), {
  height: 170,
});

interface NavItem {
  name: string;
  url: string;
  children?: NavItem[];
}

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
    url: "/tools/json-to-language",
    children: [],
  },
];
</script>
