<template>
  <NuxtLayout>
    <ToolList :posts="posts" :pagination="postsRes.meta.pagination" />
  </NuxtLayout>
</template>

<script setup>
const route = useRoute();

const { pageIndex } = route.params;

const { data: postsRes } = await useAsyncData("tools/" + pageIndex, () =>
  useStrapi4().find("tools", {
    publicationState: useIsProducton() ? "live" : "preview",
    populate: ["image"],
    pagination: {
      page: 1,
      pageSize: 15,
    },
  })
);

onMounted(() => {
  useHead({
    titleTemplate: `工具合集 - 第${pageIndex}页`,
  });
});

const posts = computed(() => postsRes.value.data);
</script>
