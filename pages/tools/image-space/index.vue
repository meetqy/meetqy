<template>
  <NuxtLayout name="tools">
    <template #title>Image-Space</template>
    <main class="flex h-full container m-auto px-32">
      <aside class="w-80 h-full rounded-md">
        <p class="py-2 px-2 text-white mb-2">类型</p>
        <ul class="px-2">
          <li
            v-for="(item, index) in types"
            :key="item"
            class="li-item"
            :class="{ active: index === curTypes }"
            @click="curTypes = index"
          >
            <a :href="'#' + item" class="w-full inline-block">
              {{ item }}
            </a>
          </li>
        </ul>
      </aside>
      <div
        class="flex-1 ml-10 bg-white bg-opacity-80 rounded-md !max-w-full prose dark:prose-neutral overflow-y-scroll px-10 py-5"
      >
        <h1>Image Space</h1>

        <p>根据类型随机生成一张图片</p>

        <ul>
          <li>规则: https://wcao.cc/image-space/api/{类型}</li>
          <li>一个页面使用多张: 规则后面加上参数，保证链接不同！！！</li>
        </ul>

        <article v-for="item in types">
          <h2 :id="item" class="capitalize">
            <small class="text-gray-400"># </small>{{ item }}
          </h2>

          <div class="grid grid-cols-4 gap-4">
            <img
              v-for="num in 4"
              class="w-48 rounded-md my-0"
              :src="`https://wcao.cc/image-space/api/${item}?${num}`"
            />
          </div>

          <p>Try</p>
          <pre> https://wcao.cc/image-space/api/{{ item }}?xxx </pre>
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
  return post.value.desciption.split("：")[1].split("/");
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
