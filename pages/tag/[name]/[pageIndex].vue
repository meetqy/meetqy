<template>
  <NuxtLayout name="default">
    <template #title>
      <div class="w-full flex justify-end pr-10">
        <button class="btn rounded-box border-0 bg-opacity-50 capitalize">
          {{ name }}
        </button>
      </div>
    </template>

    <PostList
      :posts="posts"
      :prev-page-prefix="'tag/'"
      :next-page-prefix="'tag/'"
      :pagination="postsRes.meta.pagination"
    />
  </NuxtLayout>
</template>

<script setup>
const { name, pageIndex } = useRoute().params;

const { data: postsRes } = await useAsyncData(`tag/${name}`, () =>
  useStrapi4().find("posts", {
    publicationState: useIsProducton() ? "live" : "preview",
    sort: ["updatedAt:desc"],
    populate: ["tags", "light", "dark"],
    filters: {
      tags: {
        name: {
          $in: name,
        },
      },
    },
    pagination: {
      page: pageIndex,
      pageSize: 15,
    },
  })
);

const posts = computed(() => postsRes.value.data);

useHead({
  titleTemplate: `标签 - ${name}/${pageIndex}`,
});
</script>
