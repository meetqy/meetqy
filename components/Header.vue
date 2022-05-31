<template>
  <header
    style="height: 170px"
    class="flex justify-between items-center border-b-2 border-white border-opacity-25"
  >
    <div class="flex items-end cursor-pointer" @click="$router.push('/')">
      <W class="fill-black" :size="32" />
      <C class="fill-white" :size="24" />
      <A class="fill-white" :size="24" />
      <O class="fill-white" :size="24" />
    </div>

    <ul class="text-white text-lg flex">
      <li class="py-5 pl-2.5 pr-4 mr-4" v-for="item in navs" :key="item.name">
        <a href="/">{{ item.name }}</a>
      </li>
    </ul>
  </header>
</template>

<script lang="ts" setup>
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
  {
    name: "模板",
    url: "/template",
    children: [],
  },
  {
    name: "工具",
    url: "/tools",
    children: [],
  },
];
</script>
