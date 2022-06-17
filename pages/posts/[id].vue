<template>
  <NuxtLayout @change="onChange">
    <main class="main-content flex">
      <aside
        :class="[
          { fixed: asideFixed },
          'top-0 w-96 max-h-screen hidden lg:flex flex-col z-10 flex-shrink-0',
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
              <span>Type</span>
            </li>
            <li
              class="text-xl"
              v-for="(item, index) in types"
              :key="item"
              @click="curTypes = index"
            >
              <a
                :href="'#' + item.name"
                :class="{
                  active: curTypes === index,
                  capitalize: curTypes === index,
                }"
              >
                {{ item.name }}
              </a>
            </li>
          </ul>
        </section>
      </aside>

      <aside class="w-96 opacity-0 hidden lg:flex" v-show="asideFixed"></aside>

      <div class="flex-1 relative overflow-hidden p-5 bg-base-100 rounded-md">
        <Swiper
          class="swiper w-full bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl"
          :modules="modules"
          :navigation="true"
        >
          <swiper-slide
            class="flex justify-center items-center"
            v-for="item in previewImages"
            :key="item.id"
          >
            <img
              class="rounded-2xl xl:w-1/5 md:w-1/3 w-1/2"
              :src="$cdn + item.attributes.url"
            />
          </swiper-slide>
        </Swiper>

        <div class="flex items-center mt-6 flex-wrap mb-10">
          <a href="javascript:;" class="flex items-center justify-center">
            <img
              class="w-8 h-8 rounded-full relative -top-0.5"
              style="box-shadow: 2px 2px 5px 1px rgb(0 0 0 / 20%)"
              src="/avatar.jpg"
            />
            <span class="ml-3"> meetqy </span>
          </a>

          <a href="javascript:;" class="ml-6">
            <i class="iconfont" style="color: #e84e89">&#xe8b4;</i>
            <span class="ml-2">{{ post.updatedAt.split("T")[0] }}</span>
          </a>

          <a href="javascript:;" class="ml-6">
            <i class="iconfont" style="color: #e84e89">&#xe8f4;</i>
            <span class="ml-2">{{ post.visit }}</span>
          </a>

          <a href="javascript:;" class="ml-6">
            <i class="iconfont" style="color: #e84e89">&#xe8b5;</i>
            <span class="ml-2">{{ post.comment }}</span>
          </a>
        </div>

        <article
          class="prose prose-neutral prose-a:text-blue-500 break-words"
          v-html="content"
        />

        <div
          class="py-16 mt-12 flex justify-center items-center flex-wrap"
          style="
            border-top: 1px solid #f4f4f4;
            border-bottom: 1px solid #f4f4f4;
          "
        >
          <span class="text-lg font-semibold mr-4">Link:</span>
          <a
            :href="post.link"
            class="underline text-blue-500 break-words inline-block w-full text-center md:w-auto"
          >
            {{ post.link }}
          </a>
        </div>
      </div>
    </main>
  </NuxtLayout>
</template>

<script setup>
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import "swiper/css";
import "swiper/css/navigation";
import "highlight.js/styles/atom-one-dark.css";

const onChange = (y) => {
  asideFixed.value = y > 150;
};

const asideFixed = ref(false);

const md = new MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre class="hljs"><code>' +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          "</code></pre>"
        );
      } catch (__) {}
    }

    return (
      '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + "</code></pre>"
    );
  },
});

const { id } = useRoute().params;

const { data } = await useAsyncData("posts/:id", () =>
  useStrapi4().find(`posts/${id}`, {
    populate: ["category", "tags", "previewImages"],
  })
);

const post = computed(() => {
  // console.log(data, "compited");
  return data.value.data.attributes;
});

const previewImages = computed(() => post.value.previewImages.data);

const content = computed(() => md.render(post.value.content));

const modules = [Navigation];

const $cdn = useCdnUrl();

onMounted(() => {
  useHead({
    titleTemplate: `${post.value.title} - ${post.value.desciption}`,
    meta: [
      {
        name: "description",
        content: `${post.value.desciption}`,
      },
    ],
  });
});
</script>
