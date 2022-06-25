<template>
  <NuxtLayout>
    <PostList :posts="posts" :pagination="postsRes.meta.pagination" />

    <BottomAside :tags="tags" />
  </NuxtLayout>
</template>

<script setup>
const route = useRoute();

const { pageIndex } = route.params;

const { data: postsRes } = await useAsyncData("tools/" + pageIndex, () =>
  useStrapi4().find("posts", {
    publicationState: useIsProducton() ? "live" : "preview",
    populate: ["category", "tags", "headerImages"],
    filters: {
      category: {
        id: {
          $eq: 2,
        },
      },
    },
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
