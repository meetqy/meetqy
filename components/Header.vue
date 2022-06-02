<template>
  <header
    :style="`height: ${height}px`"
    class="flex justify-between items-center"
    :class="class"
  >
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
    url: "/tools/json-to-language",
    children: [],
  },
];
</script>

<style lang="postcss" scoped>
.logo {
  div {
    @apply transition-all;
    &:first-child {
      @apply bg-gradient-to-r from-green-400 to-blue-500 fill-white;
    }

    &:last-child {
      @apply text-white;
    }
  }
}
</style>
