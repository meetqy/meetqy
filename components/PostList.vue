<template>
  <div>
    <div class="multi-columns" v-if="props.posts">
      <div class="block" v-for="post in props.posts" :key="post.id">
        <!-- <grid-item-a
          v-if="post.attributes.useTemplate === 'a'"
          :title="post.attributes.title"
          :desciption="post.attributes.desciption"
          :time="post.attributes.updatedAt.split('T')[0]"
          :category="getCategory(post)"
          :header-images="getHeaderImages(post)"
          :to="post.attributes.to"
        /> -->

        <grid-item-c
          :title="post.attributes.title"
          :category="{
            name: '模板',
            sort: 1,
            templateType: 'b',
            color: '#fff',
            bgColor: 'background: linear-gradient(to right, #5c258d, #4389a2);',
            path: '/template/1',
          }"
          :id="post.id + ''"
          :to="post.attributes.to || ''"
        />

        <!-- <grid-item-b
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
        />-->
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
