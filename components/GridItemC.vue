<template>
  <article
    class="relative flex flex-col justify-center bg-base-200 pt-4 rounded-lg shadow-md"
    @click="$router.push(`/template/detail/pro-${id}`)"
  >
    <div class="w-full z-40 bg-top px-4 cursor-pointer">
      <div
        class="max-h-[600px] min-h-[200px] w-full rounded-box relative"
        ref="picScroll"
      >
        <picture>
          <source
            v-if="dark"
            preload
            :data-srcset="useAssetUrl(dark.attributes.url, ['f_webp', 'w_500'])"
            media="(prefers-color-scheme: dark)"
          />
          <source
            v-if="light"
            preload
            :data-srcset="
              useAssetUrl(light.attributes.url, ['f_webp', 'w_500'])
            "
            media="(prefers-color-scheme: light)"
          />

          <img
            :alt="post.title"
            class="lazy"
            preload
            :data-src="useAssetUrl(light.attributes.url, ['f_webp', 'w_500'])"
          />
        </picture>
      </div>
    </div>

    <div
      class="absolute pt-10 rounded-lg left-0 top-0 z-30 w-full h-full cursor-pointer"
      v-if="!post.to"
    >
      <div class="tags">
        <a
          href="javascript:;"
          class="text-xs"
          :style="`color: ${category.color};${category.bgColor}`"
        >
          完善中
        </a>
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
      class="flex justify-between items-center relative z-50 py-4 px-4 bg-base-100 mt-4 rounded-b-lg"
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
import "perfect-scrollbar/css/perfect-scrollbar.css";

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

const { $lazyLoadInstance } = useNuxtApp();
if ($lazyLoadInstance) {
  setTimeout(() => {
    $lazyLoadInstance.update();
  }, 1000);
}

const light = computed(() => props.post.light.data);
const dark = computed(() => props.post.dark.data);

const picScroll = ref();

onMounted(() => {
  picScroll.value && new PerfectScrollbar(picScroll.value);

  $lazyLoadInstance.update();
});
</script>

<style lang="postcss" scoped>
img:not([src]):not([srcset]) {
  @apply relative;
  &::after {
    content: url("/loading.svg");
    @apply absolute left-0 top-0 z-50 w-full h-full bg-base-200 flex justify-center;
  }
}

.tags {
  @apply absolute w-full -top-4 right-0 text-center;

  a {
    @apply text-base-100 rounded-box py-2 px-6;
  }
}
</style>
