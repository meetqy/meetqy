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
const route = useRoute();
const { pageIndex } = route.params;

useHead({
  titleTemplate: `${useTitle().title} - 今天星期${useTitle().week}`,
});

const { data: postsRes } = await useAsyncData(`index/${pageIndex}`, () =>
  useStrapi4().find("posts", {
    publicationState: useIsProducton() ? "live" : "preview",
    sort: ["updatedAt:desc"],
    populate: ["tags", "light"],
    pagination: {
      page: pageIndex,
      pageSize: 15,
    },
  })
);

const posts = computed(() => postsRes.value.data);
</script>
