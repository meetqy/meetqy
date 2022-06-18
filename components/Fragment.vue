<template>
  <NuxtLayout @change="onChange">
    <main class="main-content flex">
      <aside
        :class="[
          { fixed: asideFixed },
          'top-0 w-96 flex-shrink-0 max-h-screen hidden lg:flex flex-col z-10 ',
        ]"
      >
        <section class="w-full lg:pr-10 my-5" :class="{ hidden: !asideFixed }">
          <div class="p-2 h-min rounded-box">
            <Logo />
          </div>
        </section>

        <section class="w-full lg:pr-10">
          <ul class="menu bg-base-100 p-2 w-full h-min rounded-box">
            <li class="menu-title py-2">
              <span>List</span>
            </li>

            <li
              v-for="(item, index) in fragments"
              :key="index"
              @click="curTemp = index"
            >
              <a
                :href="'#' + item.name[0]"
                :class="{
                  active: curTemp === index,
                  capitalize: curTemp === index,
                }"
              >
                {{ item.name[0].replace("·奥特曼", "") }}

                <small class="text-xs flex-1 truncate">
                  ({{ item.name[1] }})
                </small>
              </a>
            </li>
          </ul>
        </section>

        <section class="w-full lg:pr-10 mt-5">
          <ul
            class="menu bg-base-100 p-2 w-full h-96 overflow-y-scroll rounded-box scrollbar"
          >
            <li class="menu-title py-2">
              <span class="flex justify-between items-center">
                Change Theme
                <span>
                  use:
                  <a
                    class="btn btn-link btn-xs"
                    href="https://daisyui.com/"
                    target="_blank"
                  >
                    DaisyUI
                  </a>
                </span>
              </span>
            </li>

            <li
              v-for="item in themes"
              :key="item"
              :data-theme="item"
              class="my-2 shadow rounded-box"
              :class="{ 'outline-dashed': curTheme === item }"
            >
              <a
                href="javascript:;"
                class="flex justify-between hover:bg-transparent active:bg-transparent focus:bg-transparent"
                @click="curTheme = item"
              >
                <span>{{ item }}</span>
                <div class="flex gap-1 h-4">
                  <div class="bg-primary w-2 rounded"></div>
                  <div class="bg-secondary w-2 rounded"></div>
                  <div class="bg-accent w-2 rounded"></div>
                  <div class="bg-neutral w-2 rounded"></div>
                </div>
              </a>
            </li>
          </ul>
        </section>
      </aside>
      <aside
        class="w-96 flex-shrink-0 opacity-0 hidden lg:flex"
        v-show="asideFixed"
      ></aside>

      <div
        class="flex-1 relative overflow-hidden px-5 bg-base-100 py-10 rounded-box"
      >
        <div class="prose">
          <h1>{{ title }}</h1>

          <p>{{ desc }}</p>
        </div>

        <div
          :id="item.name[0]"
          v-for="(item, index) in props.fragments"
          :key="index"
        >
          <h3
            class="text-base-content font-semibold mt-8 mb-3"
            style="font-size: 1.25em"
          >
            <small class="text-info text-opacity-50"># </small>
            {{ item.name[0] }}
            <small class="font-light ml-2 text-base-content text-opacity-70">
              ({{ item.name[1] }})
            </small>
          </h3>
          <div
            class="mockup-window border bg-base-300 w-full mb-8"
            :data-theme="curTheme"
          >
            <div
              class="btn btn-sm btn-square btn-primary absolute right-8 top-2 gap-2"
              :class="{ 'btn-link': !activeCode[index] }"
              @click="showCode(index)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>
            <div
              class="flex justify-center px-4 lg:pt-16 lg:pb-10 pt-8 pb-5 bg-base-200"
              v-html="item.code"
            />

            <pre class="bg-base-200 px-4" v-show="activeCode[index]">
            <code :id="'pre-' + index" class="rounded-box" >{{item.code}}</code>
          </pre>
          </div>
        </div>
      </div>
    </main>
  </NuxtLayout>
</template>

<script setup lang="ts">
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
interface Props {
  fragments: {
    name: string[];
    code: string[];
  }[];
  title: string;
  desc: string;
}

const props = defineProps<Props>();

const themes = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
];

const activeCode = ref({});

const showCode = (index) => {
  activeCode.value[index] = !activeCode.value[index];

  if (activeCode.value[index]) {
    hljs.highlightBlock(document.querySelector("#pre-" + index));
  }
};

const curTheme = ref("dark");

onMounted(() => {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  curTheme.value = media.matches ? "dark" : "light";

  //   useHead({
  //     titleTemplate: `${post.value.title} - ${post.value.desciption}`,
  //     meta: [
  //       {
  //         name: "description",
  //         content: `${post.value.desciption}`,
  //       },
  //     ],
  //   });
});

const onChange = (y) => {
  asideFixed.value = y > 150;
};

const curTemp = ref(0);

const asideFixed = ref(false);
</script>
