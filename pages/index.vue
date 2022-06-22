<template>
  <NuxtLayout>
    <PostList :posts="posts" />

    <div class="bottom-aside lg:grid-cols-3 md:grid-cols-2">
      <div>
        <p class="bottom-title">Recent posts</p>
        <ul>
          <li class="flex mt-5" v-for="item in 3">
            <img :src="'https://wcao.cc/r/a/avatar?' + item" alt="" />
            <div class="flex flex-col justify-center ml-5">
              <span class="text-md text-base-content"> June 5, 2019 </span>
              <p class="text-xl text-base-300">
                Mars is the fourth planet from the Sun
              </p>
            </div>
          </li>
        </ul>
      </div>

      <div>
        <p class="bottom-title">标签</p>
        <div class="flex mt-5 flex-wrap">
          <nuxt-link
            :to="`/tag/${item.id}`"
            class="btn btn-sm border-0 shadow-md capitalize mr-2 mb-4"
            :style="{
              color: item.attributes.color,
              backgroundColor: item.attributes.bgColor,
            }"
            v-for="item in tags"
            :key="item.id"
          >
            {{ item.attributes.name }}
            <span class="ml-1">
              ({{ item.attributes.posts.data.length }})
            </span>
          </nuxt-link>
        </div>
      </div>

      <div>
        <p class="bottom-title">关于我</p>
        <div class="mt-5">
          <div class="flex">
            <img
              class="w-24 h-24 rounded-full border-4 border-info"
              src="/avatar.jpg"
              alt="meetqy"
            />
            <div class="ml-5 flex flex-col justify-center">
              <p class="text-neutral-content">
                <span class="text-xl font-semibold">meetqy</span>
                <sup
                  class="inline-block line-through decoration-error decoration-2 relative -top-3"
                >
                  都{{ new Date().getFullYear() - 1996 }}了
                </sup>
              </p>
              <p class="text-neutral-content text-opacity-80 text-sm my-1">
                前端CV工程师 - 擅长CV大法
              </p>
            </div>
          </div>

          <p class="text-neutral-content mt-5">
            摸鱼、养狗、干饭、找模板、写模板，生活就是如此的朴实无华！
          </p>
          <p class="mt-4 about">
            <span
              class="badge badge-lg border-0 uppercase shadow text-black"
              style="background-color: #e5d836"
            >
              js
            </span>
            <span
              class="badge badge-lg border-0 uppercase"
              style="background-color: #4266bb"
            >
              ts
            </span>
            <span
              class="badge badge-lg border-0 capitalize"
              style="
                background: linear-gradient(to bottom right, #69bcf0, #28468a);
              "
            >
              flutter
            </span>
            <span
              class="badge badge-lg border-0 capitalize"
              style="
                background: linear-gradient(to bottom right, #8bb840, #35362d);
              "
              >node
            </span>
            <span
              class="badge badge-lg border-0 shadow text-black"
              style="
                background: linear-gradient(to bottom right, #4ea1c5, #55b3a8);
              "
            >
              Tailwind CSS
            </span>

            <span
              class="badge badge-lg border-0 shadow"
              style="
                background: linear-gradient(to bottom right, #c15029, #cf642d);
              "
            >
              HTML
            </span>
            <span
              class="badge badge-lg border-0 shadow"
              style="
                background: linear-gradient(to bottom right, #335ca4, #5697de);
              "
            >
              CSS
            </span>
          </p>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
// useHead({
//   titleTemplate: `${useTitle().title} - 今天星期${useTitle().week}`,
// });

const { data: postsRes } = await useAsyncData("posts", () =>
  useStrapi4().find("posts", {
    publicationState: useIsProducton() ? "live" : "preview",
    populate: ["category", "headerImages", "tags"],
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

<style lang="postcss" scoped>
.bottom-aside {
  @apply grid gap-x-10 mt-10;

  > div {
    &:not(:last-child) {
      @apply mb-10;
    }
  }

  .bottom-title {
    @apply text-neutral-content font-semibold border-b border-neutral-content border-opacity-20  pb-5 text-2xl;
  }

  ul {
    @apply px-4;
    img {
      @apply w-20 h-20 rounded-full shadow-md;
    }
  }
}

.about {
  > span {
    @apply mb-2 mr-2;
  }
}
</style>
