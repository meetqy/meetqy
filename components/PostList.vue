<template>
  <div>
    <div
      class="multi-columns pt-5 md:pt-10 md:columns-2 xl:columns-3"
      v-if="props.posts"
    >
      <div class="block" v-for="post in props.posts" :key="post.id">
        <grid-item-a
          v-if="getCategory(post).templateType === 'a'"
          :title="post.attributes.title"
          :desciption="post.attributes.desciption"
          :time="post.attributes.updatedAt.split('T')[0]"
          :category="getCategory(post)"
          :header-images="getHeaderImages(post)"
          :to="post.attributes.to"
        />

        <grid-item-b
          v-else
          :title="post.attributes.title"
          :desciption="post.attributes.desciption"
          :time="post.attributes.updatedAt.split('T')[0]"
          :visit="post.attributes.visit"
          :comment="post.attributes.comment"
          :category="getCategory(post)"
          :header-images="getHeaderImages(post)"
          :id="post.id + ''"
          :to="post.attributes.to"
        />
      </div>
    </div>

    <div class="paging md:py-10 py-5">
      <a
        href="javasciprt:;"
        class="btn rounded-full btn-sm btn-info capitalize"
      >
        Prev
      </a>
      <span class="px-5 text-neutral-content">
        {{ pagination.page }} / {{ pagination.pageCount }}
      </span>
      <a
        href="javasciprt:;"
        class="btn rounded-full btn-sm btn-info capitalize"
      >
        Next
      </a>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  posts: Array,
  pagination: Object,
});

const getCategory = (post) => {
  return post.attributes.category.data.attributes;
};

const getHeaderImages = (post) => {
  if (post.attributes.headerImages.data) {
    return post.attributes.headerImages.data.map((item) => item.attributes.url);
  } else {
    return [];
  }
};
</script>

<style scoped lang="postcss">
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
