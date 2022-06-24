<template>
  <NuxtLayout @change="onChange">
    <template #title>Random Image</template>
    <main class="main-content flex">
      <aside
        :class="[
          { fixed: asideFixed },
          'top-0 w-96 max-h-screen hidden lg:flex flex-col z-10 ',
        ]"
      >
        <section
          class="w-full xl:pr-10 pr-5 my-5"
          :class="{ hidden: !asideFixed }"
        >
          <div class="p-2 h-min rounded-box">
            <Logo />
          </div>
        </section>

        <section class="w-full xl:pr-10 pr-4">
          <ul
            class="menu bg-base-100 p-2 w-full rounded-box overflow-y-scroll h-96 scrollbar"
          >
            <li class="menu-title py-2">
              <span>Type</span>
            </li>

            <li
              class="text-xl"
              v-for="(item, index) in types"
              :key="item"
              @click="curTypes = index"
            >
              <a
                :href="'#' + item.name"
                :class="{
                  active: curTypes === index,
                  capitalize: curTypes === index,
                }"
              >
                {{ item.name }}
              </a>
            </li>
          </ul>
        </section>
      </aside>

      <aside class="w-96 opacity-0 hidden lg:flex" v-show="asideFixed"></aside>

      <div
        class="flex-1 px-5 py-10 bg-base-100 rounded-md prose prose-neutral prose-a:text-blue-500"
      >
        <h1>Random Image</h1>

        <p>根据类型随机生成一张图片</p>

        <ul>
          <li>规则: https://wcao.cc/image-space/api/{类型}</li>
          <li>一个页面使用多张: 规则后面加上参数，保证链接不同！！！</li>
        </ul>

        <article v-for="item in types">
          <h2 :id="item.name" class="capitalize flex justify-between">
            <span><small class="text-base-300"># </small>{{ item.name }}</span>
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
              v-lazy="{
                src: `https://wcao.cc/image-space/api/${item.name}?${num}`,
                loading: '/loading.gif',
              }"
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
const curTypes = ref(0);

const { data } = await useAsyncData("image-space", () =>
  useStrapi4().find(`posts/4`)
);

const post = computed(() => {
  return data.value.data.attributes;
});

onMounted(() => {
  useHead({
    titleTemplate: `${post.value.title} - ${post.value.desciption}`,
    meta: [
      {
        name: "description",
        content: `${post.value.desciption}`,
      },
    ],
  });
});

const types = computed(() => {
  return post.value.imageSpace;
});

const onChange = (y) => {
  asideFixed.value = y > 150;
};

const asideFixed = ref(false);
</script>
