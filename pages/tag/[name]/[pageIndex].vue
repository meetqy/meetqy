<template>
  <NuxtLayout>
    <PostList
      :posts="posts"
      :prev-page-prefix="'tag/'"
      :next-page-prefix="'tag/'"
      :pagination="postsRes.meta.pagination"
    >
      <template #title>{{ name }}</template>
    </PostList>
  </NuxtLayout>
</template>

<script setup>
const { name, pageIndex } = useRoute().params;

const { data: postsRes } = await useAsyncData(`tag/${name}`, () =>
  useStrapi4().find("posts", {
    publicationState: useIsProducton() ? "live" : "preview",
    sort: ["updatedAt:desc"],
    populate: ["tags"],
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
</script>
