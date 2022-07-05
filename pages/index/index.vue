<template>
  <NuxtLayout>
    <PostList
      :posts="posts"
      :prev-page-prefix="'page/'"
      :next-page-prefix="'page/'"
      :pagination="postsRes.meta.pagination"
    />

    <!-- <BottomAside :tags="tags" /> -->
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

const { data: tagsRes } = await useAsyncData("tags", () =>
  useStrapi4().find("tags", {
    publicationState: useIsProducton() ? "live" : "preview",
    populate: ["posts"],
  })
);
const tags = computed(() => tagsRes.value.data);
</script>
