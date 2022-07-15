<template>
  <nuxt-layout>
    <!-- <div class="mt-12 mb-8 flex flex-col justify-center xl:px-32">
      <div class="navbar bg-base-100 rounded-box h-24">
        <a class="btn btn-ghost text-2xl m-auto capitalize">
          random image preview
        </a>
      </div>
    </div> -->

    <div class="masonry">
      <div class="grid">
        <nuxt-link
          :to="post.to"
          class="btn btn-ghost mt-4 underline capitalize"
        >
          查看文档 👉🏻
        </nuxt-link>
      </div>
      <div class="grid" v-for="item in post.extend" :key="item.name">
        <img
          class="rounded-md"
          v-lazy="{
            src: `https://wcao.cc/r/a/${item.name}`,
            loading: '/loading.svg',
          }"
        />
        <div class="mask">
          <a
            :href="`https://wcao.cc/r/a/${item.name}`"
            target="_blank"
            class="pl-2 mt-2 text-2xl font-bold text-base-100 cursor-pointer hover:underline"
          >
            {{ item.name }}
          </a>
        </div>
      </div>
    </div>
  </nuxt-layout>
</template>

<script setup>
onMounted(() => {
  useHead({
    titleTemplate: "Random image 随机图片服务 - 展示1",
  });
});

const { data } = await useAsyncData("tools/random-image", () =>
  useStrapi4().find(`tools/4`)
);

const post = computed(() => {
  return data.value.data.attributes;
});
</script>

<style lang="postcss">
.masonry {
  @apply xl:columns-4 lg:columns-3 md:columns-2  gap-4 p-4 mt-4 bg-base-100 rounded-md;

  .grid {
    @apply mb-4 relative flex items-center justify-center rounded-md bg-base-100;
  }

  .mask {
    @apply absolute w-full h-full top-0 left-0 bg-base-content bg-opacity-30 z-10 rounded-md;
  }
}
</style>
