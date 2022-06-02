<template>
  <NuxtLayout>
    <main class="mt-16 flex">
      <div class="w-8/12 bg-white rounded-2xl post-article p-10">
        <header>
          <Swiper
            class="swiper bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl"
            :modules="modules"
            :navigation="true"
          >
            <swiper-slide
              class="flex justify-center p-5 items-center"
              v-for="item in previewImages"
              :key="item.id"
            >
              <img
                class="rounded-2xl w-1/3"
                :src="$cdn + item.attributes.url"
              />
            </swiper-slide>
          </Swiper>

          <div class="flex items-center mt-6">
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
        </header>

        <article
          class="4/12 mt-10 prose prose-neutral prose-a:text-blue-500"
          v-html="content"
        />

        <div
          class="py-16 mt-12 flex justify-center items-center"
          style="
            border-top: 1px solid #f4f4f4;
            border-bottom: 1px solid #f4f4f4;
          "
        >
          <span class="text-lg font-semibold mr-4">Link:</span>
          <div class="inline-block bg-opacity-50 text-blue-500 underline">
            <a :href="post.link">{{ post.link }}</a>
          </div>
        </div>
      </div>

      <aside class="flex-1 ml-10">
        <section class="aside-card">
          <h1>Related Articles</h1>

          <p>123123</p>
          <p>123123</p>
          <p>123123</p>
          <p>123123</p>
          <p>123123</p>
          <p>123123</p>
          <p>123123</p>
        </section>
      </aside>
    </main>
  </NuxtLayout>
</template>

<script setup>
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";
import MarkdownIt from "markdown-it";
import { useClipboard } from "@vueuse/core";
import hljs from "highlight.js";
import "swiper/css";
import "swiper/css/navigation";
import "highlight.js/styles/atom-one-dark.css";

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
  console.log(data, "compited");
  return data.value.data.attributes;
});

const previewImages = computed(() => post.value.previewImages.data);

const content = computed(() => md.render(post.value.content));

const modules = [Navigation];

const $cdn = useCdnUrl();

const copy = () => {
  useClipboard({ source: post.link }).copy();
};
</script>

<style lang="postcss" scoped>
.aside-card {
  box-shadow: 0px 0px 6px 0px rgb(0 0 0 / 15%);
  @apply bg-white rounded-2xl p-7 mb-7 w-full;

  h1 {
    line-height: 1.6;
    @apply font-semibold text-2xl mb-10;

    &::after {
      display: block;
      content: "";
      width: 100%;
      height: 2px;
      background: #f4f4f4;
      margin-top: 20px;
    }
  }
}
</style>
