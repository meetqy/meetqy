<template>
  <header style="height: 170px" class="flex justify-between items-center">
    <div class="flex items-end">
      <W class="fill-white" :size="32" />
      <C class="fill-white" :size="24" />
      <A class="fill-white" :size="24" />
      <O class="fill-white" :size="24" />
    </div>

    <ul class="text-white font-sans font-semibold text-lg flex">
      <li class="py-5 pl-2.5 pr-4 mr-4" v-for="item in navs" :key="item.name">
        <a href="">{{ item.name }}</a>
      </li>
    </ul>
  </header>
</template>

<script lang="ts" setup>
const navs = [
  {
    name: "Home",
    children: [],
  },
  {
    name: "Header Styles",
    children: [],
  },
  {
    name: "Post Features",
    children: [],
  },
  {
    name: "#Tag",
    children: [],
  },
  {
    name: "Features",
    children: [],
  },
  {
    name: "Contact",
    children: [],
  },
];
</script>
