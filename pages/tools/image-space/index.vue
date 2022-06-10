<template>
  <NuxtLayout name="tools">
    <template #title>Image-Space</template>
    <main class="flex h-full container m-auto xl:px-32">
      <aside class="w-80 h-full rounded-md hidden xl:block">
        <p class="py-2 px-2 text-white mb-2">类型</p>
        <ul class="px-2">
          <li
            v-for="(item, index) in types"
            :key="item"
            class="li-item"
            :class="{ active: index === curTypes }"
            @click="curTypes = index"
          >
            <a :href="'#' + item.name" class="w-full inline-block">
              {{ item.name }}
            </a>
          </li>
        </ul>
      </aside>

      <div
        class="flex-1 px-10 mx-5 xl:mr-0 xl:ml-10 bg-white bg-opacity-80 rounded-md !max-w-full prose prose-neutral prose-a:text-blue-500 overflow-y-scroll py-5"
      >
        <h1>Image Space</h1>

        <p>根据类型随机生成一张图片</p>

        <ul>
          <li>规则: https://wcao.cc/image-space/api/{类型}</li>
          <li>一个页面使用多张: 规则后面加上参数，保证链接不同！！！</li>
        </ul>

        <article v-for="item in types">
          <h2 :id="item.name" class="capitalize flex justify-between">
            <span><small class="text-gray-400"># </small>{{ item.name }}</span>
            <a
              :href="item.link"
              target="_blank"
              class="font-normal text-base"
              v-if="item.link"
            >
              数据来源 👉🏻
            </a>
          </h2>

          <div class="grid grid-cols-4 gap-4">
            <img
              v-for="num in 4"
              class="w-48 rounded-md my-0"
              :src="`https://wcao.cc/image-space/api/${item.name}?${num}`"
            />
          </div>

          <p>Try</p>
          <pre> https://wcao.cc/image-space/api/{{ item.name }}?xxx </pre>
        </article>
      </div>
    </main>
  </NuxtLayout>
</template>

<script setup>
// const types = ["avatar", "coffee", "girls", "dog", "national-flag"];
const curTypes = ref(0);

useHead({
  titleTemplate: `Image Space - ${useTitle().title}`,
  meta: [
    {
      name: "description",
      content:
        "根据类型随机生成图片，可以理解为有真实图片的占位图，支持类型：avatar/coffee/dog/girls...",
    },
  ],
});

const { data } = await useAsyncData("image-space", () =>
  useStrapi4().find(`posts/4`)
);

const post = computed(() => {
  return data.value.data.attributes;
});

const types = computed(() => {
  return post.value.imageSpace;
});
</script>

<style scoped lang="postcss">
.prose {
  @apply tools-body;

  &::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
}

.li-item {
  @apply px-4 py-2 rounded-xl text-black text-opacity-80 text-2xl cursor-pointer hover:bg-white hover:bg-opacity-20 transition-all;

  &.active {
    @apply bg-pink-500 text-white capitalize;
  }
}
</style>
