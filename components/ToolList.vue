<template>
  <div>
    <div class="multi-columns" v-if="props.posts">
      <div class="block" v-for="post in props.posts" :key="post.id">
        <grid-item-a
          :title="post.attributes.title"
          :desciption="post.attributes.desciption"
          :time="post.attributes.updatedAt.split('T')[0]"
          :to="post.attributes.to"
          :header-images="getImage(post)"
          :category="{
            name: '工具',
            sort: 1,
            templateType: 'a',
            color: '#fff',
            bgColor: 'background: linear-gradient(to right, #134e5e, #71b280);',
            path: '/tools/1',
          }"
        />
      </div>
    </div>

    <div class="paging md:py-10 py-5">
      <nuxt-link
        :to="`/${prevPagePrefix}${pagination.page - 1}`"
        class="btn rounded-full btn-sm btn-info capitalize"
        :class="{ 'btn-disabled': pagination.page <= 1 }"
      >
        Prev
      </nuxt-link>

      <span class="px-5 text-neutral-content">
        {{ pagination.page }} / {{ pagination.pageCount }}
      </span>

      <nuxt-link
        :to="`/${nextPagePrefix}${pagination.page + 1}`"
        class="btn rounded-full btn-sm btn-info capitalize"
        :class="{ 'btn-disabled': pagination.page >= pagination.pageCount }"
      >
        Next
      </nuxt-link>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  posts: Array,
  pagination: Object,
  prevPagePrefix: String,
  nextPagePrefix: String,
});

const getImage = (post) => {
  if (post.attributes.image.data) {
    return post.attributes.image.data.map((item) => item.attributes.url);
  } else {
    return [];
  }
};
</script>

<style scoped lang="postcss">
.multi-columns {
  @apply gap-10 pt-5 md:pt-10 md:columns-2 columns-1 xl:columns-3;

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
