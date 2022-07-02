<template>
  <article
    class="relative flex flex-col justify-center bg-base-200 pt-4 rounded-lg shadow-md"
    @click="$router.push(goTo(id))"
  >
    <div v-html="html" class="flex justify-center px-4 relative z-20" />

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
        查看详情 [pro]
      </nuxt-link>
    </div>

    <footer class="flex justify-between items-center relative z-50">
      <a href="javascript:;" class="flex items-center">
        <span
          class="author-image"
          style="background-image: url('/avatar.jpg')"
        ></span>
        <span class="author-name">meetqy</span>
      </a>
      <div class="text-base-content text-sm">
        <a href="javascript:;">
          <span class="mr-1">23719</span>
          <i class="iconfont">&#xe8f4;</i>
        </a>
        <a href="javascript:;" class="ml-4">
          <span class="mr-1">23719</span>
          <i class="iconfont">&#xe8b5;</i>
        </a>
      </div>
    </footer>
  </article>
</template>

<script lang="ts" setup>
import { CategoryItem } from "~~/composables/type";

interface Props {
  title: string;
  id: string;
  category: CategoryItem;
  to: String;
}

const props = defineProps<Props>();

const goTo = (id: string) => {
  return (props.to || "/template/detail/") + id;
};

const html = ref("");

if (props.category.name === "模板") {
  const file = props.title.split(" Part ");
  const { data } = await useFetch(
    `/fragments/${file[0].toLowerCase()}/${file[1]}.html`,
    {
      baseURL: useBaseUrl(),
    }
  );

  html.value = data.value as string;
}
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
