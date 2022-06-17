<template>
  <NuxtLayout> 321321 </NuxtLayout>
</template>

<script setup>
const { data } = await useAsyncData("posts", () =>
  useStrapi4().find("posts", {
    populate: ["category", "headerImages", "tags"],
  })
);

const el = ref();

onMounted(() => {
  console.log(el.value);
});

useHead({
  titleTemplate: `${useTitle().title} - 今天星期${useTitle().week}`,
});

const posts = computed(() => data.value.data);

// console.log(posts.value);

const getTags = (post) => {
  const tags = post.attributes.tags.data;
  return tags.length > 0 ? tags[0].attributes : "";
};

const getCategory = (post) => {
  return post.attributes.category.data.attributes;
};

const getHeaderImages = (post) => {
  return post.attributes.headerImages.data.map((item) => item.attributes.url);
};
</script>

<style lang="postcss" scoped>
.bottom-aside {
  @apply grid gap-x-10 mt-10;

  > div {
    &:not(:last-child) {
      @apply mb-10;
    }
  }

  .bottom-title {
    font-size: 24px;
    @apply text-base-100 font-semibold border-b border-white border-opacity-20 pb-5;
  }

  ul {
    @apply px-4;
    img {
      box-shadow: 0 3px 12px -1px rgb(7 10 25 / 20%),
        0 22px 27px -20px rgb(7 10 25 / 20%);
      @apply w-20 h-20 rounded-full;
    }
  }
}

.about {
  > span {
    @apply mb-2 mr-2;
  }
}

.multi-columns {
  column-gap: 40px;

  .block {
    display: block;
    word-wrap: break-word;
    padding: 30px 0;
    page-break-inside: avoid;
  }
}

.paging {
  @apply text-base-100 flex justify-center items-center;
}
</style>
