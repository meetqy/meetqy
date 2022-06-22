<template>
  <NuxtLayout>
    <div
      class="multi-columns pt-5 md:pt-10 md:columns-2 xl:columns-3"
      v-if="posts"
    >
      <div class="block" v-for="post in posts" :key="post.id">
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
      <span class="px-5 text-neutral-content">Page 1 of 2</span>
      <a
        href="javasciprt:;"
        class="btn rounded-full btn-sm btn-info capitalize"
      >
        Next
      </a>
    </div>

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
        <p class="bottom-title">Tag Cloud</p>
        <div class="flex mt-5 flex-wrap">
          <a
            href="javascript:;"
            class="px-4 py-2 text-base-100 rounded-full mr-2 mb-4"
            :class="item"
            v-for="item in [
              'bg-blue-400',
              'bg-red-500',
              'bg-yellow-500',
              'bg-green-500',
              'bg-orange-500',
            ]"
          >
            Astronomy
          </a>
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
useHead({
  titleTemplate: `${useTitle().title} - 今天星期${useTitle().week}`,
});

const { data } = await useAsyncData("posts", () =>
  useStrapi4().find("posts", {
    publicationState: useIsProducton() ? "live" : "preview",
    populate: ["category", "headerImages", "tags"],
  })
);

const posts = computed(() => data.value.data);

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
