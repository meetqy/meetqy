<template>
  <NuxtLayout>
    <PostList
      :posts="posts"
      :prev-page-prefix="'page/'"
      :next-page-prefix="'page/'"
      :pagination="postsRes.meta.pagination"
    />
  </NuxtLayout>
</template>

<script setup>
useHead({
  titleTemplate: `${useTitle().title} - 今天星期${useTitle().week}`,
});

const { data: postsRes } = await useAsyncData("index/1", () =>
  useStrapi4().find("posts", {
    publicationState: useIsProducton() ? "live" : "preview",
    sort: ["updatedAt:desc"],
    pagination: {
      page: 1,
      pageSize: 15,
    },
  })
);

const posts = computed(() => postsRes.value.data);
</script>
