<template>
  <article
    class="article-a"
    :style="`background-image:url(${$cdn}${headerImages[0]})`"
    @click="$router.push('/tools' + link)"
  >
    <div class="bg-base-100 pt-10 rounded-2xl bg-opacity-80">
      <div class="tags">
        <a href="javascript:;">{{ tag }}</a>
      </div>

      <header class="relative flex justify-center items-center flex-col px-4">
        <time class="flex items-center text-base-content capitalize">
          <i class="text-2xl iconfont">&#xe8b4;</i>
          <span class="ml-2 text-sm">{{ time }}</span>
        </time>
      </header>

      <main class="text-base-content text-center px-4">
        <h1 class="title py-2">
          <nuxt-link :to="'/tools' + link">
            {{ title }}
          </nuxt-link>
        </h1>
        <p class="text-opacity-60">
          {{ desciption }}
        </p>
      </main>

      <footer class="flex justify-between items-center mt-10">
        <a href="javascript:;" class="flex items-center">
          <span
            class="author-image"
            style="background-image: url('/avatar.jpg')"
          ></span>
          <span class="author-name">meetqy</span>
        </a>
        <div class="text-base-content text-sm">
          <a href="javascript:;">
            <span class="mr-1">23719</span>
            <i class="iconfont">&#xe8f4;</i>
          </a>
          <a href="javascript:;" class="ml-4">
            <span class="mr-1">23719</span>
            <i class="iconfont">&#xe8b5;</i>
          </a>
        </div>
      </footer>
    </div>
  </article>
</template>

<script lang="ts" setup>
interface Props {
  title: string;
  desciption: string;
  time: string;
  tag: string;
  headerImages: string[];
  link: string;
}

const props = defineProps<Props>();

const $cdn = useCdnUrl();
</script>

<style lang="postcss">
.article-a {
  @apply rounded-2xl relative bg-cover cursor-pointer shadow-md;

  .tags {
    @apply absolute w-full -top-4 right-0 text-center;

    a {
      @apply text-base-100 rounded-3xl  font-semibold py-2 px-6;
      background-color: #ed586c;
    }
  }

  .title {
    @apply text-2xl mb-3 mt-3 font-semibold text-base-content  text-center;
    letter-spacing: 0.6px;
  }

  footer {
    @apply border-t-2 border-base-content border-opacity-5 py-4 px-4;

    .author-name {
      letter-spacing: 0.5px;
      @apply text-base-content text-sm;
    }

    .author-image {
      background-image: url(http://estudiopatagon.com/themes/wordpress/breek/wp-content/uploads/2019/06/avatar-2.jpg);
      @apply w-9 h-9 rounded-full mr-2 inline-block bg-cover;
    }
  }
}
</style>
