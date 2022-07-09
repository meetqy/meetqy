<template>
  <article
    class="relative flex flex-col justify-center bg-base-200 pt-4 rounded-lg shadow-md"
    @click="$router.push(`/template/detail/pro-${id}`)"
  >
    <div v-if="light" class="w-full z-40 bg-top px-4 cursor-pointer">
      <div class="max-h-[640px] w-full rounded-box relative" ref="picScroll">
        <picture>
          <source
            :srcset="useAssetUrl(dark.attributes.url)"
            media="(prefers-color-scheme: dark)"
          />
          <source
            :srcset="useAssetUrl(light.attributes.url)"
            media="(prefers-color-scheme: light)"
          />
          <nuxt-img
            :src="light.attributes.url.replace(/\/uploads/, '')"
            :height="random(320, 640)"
            format="webp"
            sizes="xl:360px lg:448px md:360 sm:334px 2xl:445px"
            loading="lazy"
            provider="strapi"
          />
        </picture>
        <!-- <img :src="useAssetUrl(light.attributes.url)" /> -->

        <!-- <nuxt-img
          :src="light.attributes.url"
          :height="random(320, 640)"
          format="webp"
          sizes="xl:360px lg:448px md:360 sm:334px 2xl:445px"
          loading="lazy"
          provider="strapi"
        /> -->
      </div>
    </div>

    <div v-else v-html="html" class="flex justify-center px-4 relative z-20" />

    <div
      class="absolute pt-10 rounded-lg left-0 top-0 z-30 w-full h-full cursor-pointer"
    >
      <div class="tags">
        <nuxt-link
          :to="category.path"
          :style="`color: ${category.color};${category.bgColor}`"
        >
          {{ category.name }}
        </nuxt-link>
      </div>
    </div>

    <div class="w-full flex justify-between absolute left-0 top-0 -z-20">
      <nuxt-link
        :to="`/template/detail/${id}`"
        class="cursor-pointer capitalize btn"
      >
        查看详情
      </nuxt-link>

      <nuxt-link
        :to="`/template/detail/pro-${id}`"
        class="cursor-pointer capitalize btn"
      >
        查看详情 [pro] {{ post.to }}
      </nuxt-link>
    </div>

    <footer
      class="flex justify-between items-center relative z-50"
      @click.stop=""
    >
      <div class="flex-1">
        <nuxt-link
          :to="`/tag/${item.attributes.name}/1`"
          class="badge mr-2"
          :key="item.id"
          v-for="item in tags"
        >
          {{ item.attributes.name }}
        </nuxt-link>
      </div>

      <div class="text-base-content text-sm">
        <a href="javascript:;">
          <span class="mr-1">{{ post.visit || 1 }}</span>
          <i class="iconfont">&#xe8f4;</i>
        </a>
        <a href="javascript:;" class="ml-4">
          <span class="mr-1">{{ post.comment || 1 }}</span>
          <i class="iconfont">&#xe8b5;</i>
        </a>
      </div>
    </footer>
  </article>
</template>

<script lang="ts" setup>
import { CategoryItem } from "~~/composables/type";
import PerfectScrollbar from "perfect-scrollbar";

interface Props {
  id: string;
  post: {
    title: string;
    comment: number;
    visit: number;
    link: string;
    to: string;
    light: any;
    dark: any;
  };
  tags: any[];
  category: CategoryItem;
}

const props = defineProps<Props>();

const light = computed(() => props.post.light.data);
const dark = computed(() => props.post.dark.data);
// console.log(light.value);

const picScroll = ref();

const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

onMounted(() => {
  picScroll.value && new PerfectScrollbar(picScroll.value);
});

const html = ref("");

const file = props.post.title.split(" Part ");
const { data } = await useFetch(`/beauty-template/${file[0]}/${file[1]}`, {
  baseURL: useTemplateUrl(),
});

html.value = (data.value as string).match(/<wcao>([\s\S]*)<\/wcao>/)[1];
</script>

<style lang="postcss" scoped>
.tags {
  @apply absolute w-full -top-4 right-0 text-center;

  a {
    @apply text-base-100 rounded-box py-2 px-6;
  }
}

footer {
  @apply py-4 px-4 bg-base-100 mt-4 rounded-b-lg;

  .author-name {
    letter-spacing: 0.5px;
    @apply text-base-content text-sm;
  }

  .author-image {
    @apply w-9 h-9 rounded-full mr-2 inline-block bg-cover;
  }
}
</style>
