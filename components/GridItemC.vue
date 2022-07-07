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
        v-if="post.to"
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

interface Props {
  id: string;
  post: {
    title: string;
    comment: number;
    visit: number;
    link: string;
    to: string;
  };
  tags: any[];
  category: CategoryItem;
}

const props = defineProps<Props>();

const goTo = (id: string) => {
  return (props.post.to || "/template/detail/") + id;
};

const html = ref("");

if (props.category.name === "模板") {
  const file = props.post.title.split(" Part ");
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
