<template>
  <NuxtLayout name="default">
    <!-- <button @click="$router.push('/posts/1')">/posts/1</button> -->
    <div class="multi-columns" v-if="posts">
      <div class="block" v-for="post in posts" :key="post.id">
        <grid-item-b
          v-if="getCategory(post).name === '模板'"
          :title="post.attributes.title"
          :desciption="post.attributes.desciption"
          :time="post.attributes.updatedAt.split('T')[0]"
          :visit="post.attributes.visit"
          :comment="post.attributes.comment"
          :tag="getTags(post)"
          :header-images="getHeaderImages(post)"
          :id="post.id + ''"
        />

        <grid-item-a
          v-if="getCategory(post).name === '工具'"
          :title="post.attributes.title"
          :desciption="post.attributes.desciption"
          :time="post.attributes.updatedAt.split('T')[0]"
          :tag="getCategory(post).name"
          :header-images="getHeaderImages(post)"
          :link="post.attributes.link"
        />
      </div>
    </div>

    <div class="paging">
      <a href="javasciprt:;" class="btn">Prev</a>
      <span class="px-5">Page 1 of 2</span>
      <a href="javasciprt:;" class="btn">Next</a>
    </div>

    <div class="bottom-aside">
      <!-- post -->
      <div>
        <p class="bottom-title">Recent posts</p>
        <ul>
          <li class="flex mt-5" v-for="item in 3">
            <img
              src="http://estudiopatagon.com/themes/wordpress/breek/wp-content/uploads/2019/06/480016-PGKTGR-852-120x120.jpg"
              alt=""
            />
            <div class="flex flex-col justify-center ml-5">
              <span class="text-sm text-white text-opacity-50"
                >June 5, 2019</span
              >
              <p class="text-base font-semibold text-white">
                Mars is the fourth planet from the Sun
              </p>
            </div>
          </li>
        </ul>
      </div>

      <!-- tag -->
      <div>
        <p class="bottom-title">Tag Cloud</p>
        <div class="flex mt-5 flex-wrap">
          <a
            href="javascript:;"
            class="px-4 py-2 text-white rounded-full mr-2 mb-4"
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

      <!-- about me -->
      <div>
        <p class="bottom-title">关于我</p>
        <div class="mt-5">
          <div class="flex">
            <img
              class="w-24 h-24 rounded-full border-4 border-cyan-500"
              src="/avatar.jpg"
              alt="meetqy"
            />
            <div class="ml-5 flex flex-col justify-center">
              <p class="text-lg font-semibold text-white">
                meetqy
                <sup
                  class="inline-block line-through decoration-red-500 decoration-4"
                >
                  都{{ new Date().getFullYear() - 1996 }}了
                </sup>
              </p>
              <p class="text-white text-opacity-70 text-sm my-1">
                前端CV工程师 - 擅长CV大法
              </p>
            </div>
          </div>

          <p class="text-white mt-5 text-base text-opacity-90">
            摸鱼、养狗、干饭、找模板、写模板，生活就是如此的朴实无华！
          </p>
          <p class="mt-4">
            <span
              class="tag sm !text-black uppercase"
              style="background-color: #e5d836"
            >
              js
            </span>
            <span
              class="tag sm ml-2 uppercase"
              style="background-color: #4266bb"
            >
              ts
            </span>
            <span
              class="tag sm ml-2 capitalize"
              style="
                background: linear-gradient(to bottom right, #69bcf0, #28468a);
              "
            >
              flutter
            </span>
            <span
              class="tag sm ml-2 capitalize"
              style="
                background: linear-gradient(to bottom right, #8bb840, #35362d);
              "
              >node
            </span>
          </p>
          <p class="mt-4">
            <span
              class="tag sm shadow !text-black"
              style="
                background: linear-gradient(to bottom right, #4ea1c5, #55b3a8);
              "
            >
              Tailwind CSS
            </span>

            <span
              class="tag sm ml-2 shadow"
              style="
                background: linear-gradient(to bottom right, #c15029, #cf642d);
              "
            >
              HTML
            </span>
            <span
              class="tag sm ml-2 shadow"
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
const { data } = await useAsyncData("posts", () =>
  useStrapi4().find("posts", {
    populate: ["category", "headerImages", "tags"],
  })
);

const posts = computed(() => data.value.data);

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
  @apply grid grid-cols-3 gap-x-10 mt-10;

  .bottom-title {
    font-size: 24px;
    @apply text-white font-semibold border-b border-white border-opacity-20 pb-5;
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

.multi-columns {
  column-count: 3;
  column-gap: 40px;
  padding-top: 40px;

  .block {
    display: block;
    word-wrap: break-word;
    padding: 30px 0;
    page-break-inside: avoid;
  }
}

.paging {
  @apply text-white flex justify-center items-center py-10;

  .btn {
    @apply px-5 py-2 rounded-full text-white;
    background-color: #e84e89;
  }
}
</style>
