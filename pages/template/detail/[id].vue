<template>
  <NuxtLayout @change="onChange">
    <main class="main-content flex">
      <aside
        :class="[
          { fixed: asideFixed },
          'top-0 w-96 flex-shrink-0 max-h-screen hidden lg:flex flex-col z-10 ',
        ]"
      >
        <section
          class="w-full xl:pr-10 pr-4 my-5"
          :class="{ hidden: !asideFixed }"
        >
          <div class="p-2 h-min rounded-box">
            <Logo />
          </div>
        </section>

        <section class="w-full xl:pr-10 pr-4 xl:mt-5">
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
        <div class="prose mb-8">
          <h2 class="flex justify-between capitalize">
            {{ post.title }}

            <span>
              <small class="text-info">{{ name[0] }} </small>

              <small class="font-light ml-2 text-base-content text-opacity-50">
                ({{ name[1] }})
              </small>
            </span>
          </h2>
        </div>

        <div
          class="mockup-window border bg-base-300 w-full mb-8"
          :data-theme="curTheme"
        >
          <div
            class="btn btn-sm btn-square btn-primary absolute right-8 top-2 gap-2"
            :class="{ 'btn-link': !activeCode }"
            @click="showCode"
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
            v-html="html"
          />

          <pre class="bg-base-200 px-4" v-show="activeCode">
                <code :id="'pre-' + id" class="rounded-box" >{{html}}</code>
            </pre>
        </div>
      </div>
    </main>
  </NuxtLayout>
</template>

<script setup>
import { useDark } from "@vueuse/core";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
const route = useRoute();

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

const activeCode = ref(false);

const { id } = route.params;

const { data } = await useAsyncData(`posts/${id}`, () =>
  useStrapi4().find(`posts/${id}`, {
    publicationState: useIsProducton() ? "live" : "preview",
    populate: ["tags"],
  })
);

const post = computed(() => {
  return data.value.data.attributes;
});

const tags = computed(() => post.value.tags.data);

const file = post.value.title.split(" Part ");
const { data: html } = await useFetch(
  `/fragments/${file[0].toLowerCase()}/${file[1]}.html`,
  {
    baseURL: useBaseUrl(),
  }
);

const name = computed(() => ultra[post.value.title.split(" Part ")[1]]);

const curTheme = ref("dark");

const showCode = () => {
  activeCode.value = !activeCode.value;

  if (activeCode.value) {
    hljs.highlightBlock(document.querySelector("#pre-" + id));
  }
};

const isDark = useDark({
  selector: "html",
  attribute: "data-theme",
  valueDark: "dark",
  valueLight: "light",
});

onMounted(() => {
  curTheme.value = isDark.value ? "dark" : "light";
});

const onChange = (y) => {
  asideFixed.value = y > 150;
};

const asideFixed = ref(false);

onMounted(() => {
  useHead({
    titleTemplate: `${post.value.title}:${post.value.desciption} - ${tags.value
      .map((item) => item.attributes.name)
      .join(",")}模板`,
  });
});
</script>
