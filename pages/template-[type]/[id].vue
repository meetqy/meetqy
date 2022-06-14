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
              class="text-xl"
              v-for="(item, index) in fragments"
              :key="index"
              @click="curTemp = index"
            >
              <a
                :href="'#card-a' + index"
                :class="{
                  active: curTemp === index,
                  capitalize: curTemp === index,
                }"
              >
                {{ item.attributes.name }}
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
          <h1>Tailwind CSS - Card</h1>

          <p>
            收集的一些<code>Card</code>样式，所有的模板均改造为
            <code>DaisyUI</code>
            主题样式，可以完美支持主题切换。
          </p>
        </div>

        <div
          :id="'card-a' + index"
          v-for="(item, index) in fragments"
          :key="index"
        >
          <h3
            class="text-base-content font-semibold mt-8 mb-3"
            style="font-size: 1.25em"
          >
            <small class="text-base-300"># </small> {{ item.attributes.name }}
          </h3>
          <div class="mockup-window border bg-base-300 w-full mb-8">
            <div
              class="btn btn-sm btn-square btn-primary absolute right-8 top-2 gap-2"
              :class="{ 'btn-outline': !activeCode[index] }"
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
              v-html="item.attributes.html"
            />

            <pre class="bg-base-200 px-4" v-show="activeCode[index]">
            <code :id="'pre-' + index" class="rounded-box" >{{item.attributes.html}}</code>
          </pre>
          </div>
        </div>
      </div>
    </main>
  </NuxtLayout>
</template>

<script setup>
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
const route = useRoute();

useHead({
  script: [
    {
      src: "https://cdn.tailwindcss.com",
    },
  ],
  link: [
    {
      rel: "stylesheet",
      href: "https://cdn.jsdelivr.net/npm/daisyui@2.15.3/dist/full.css",
    },
  ],
});

const { id } = route.params;

const { data } = await useAsyncData("posts/:id", () =>
  useStrapi4().find(`posts/${id}`, {
    populate: ["fragments"],
  })
);

const activeCode = ref({});

const fragments = computed(() => data.value.data.attributes.fragments.data);

const showCode = (index) => {
  activeCode.value[index] = !activeCode.value[index];

  if (activeCode.value[index]) {
    hljs.highlightBlock(document.querySelector("#pre-" + index));
  }
};

const curTemp = ref(0);

const onChange = (y) => {
  asideFixed.value = y > 150;
};

const asideFixed = ref(false);
</script>
