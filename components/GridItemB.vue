<template>
  <article class="article-b" @click="$router.push(to || `/posts/${id}`)">
    <div class="tags relative z-10">
      <a
        href="javascript:;"
        :style="`color: ${tag.color};background-color: ${tag.bgColor}`"
      >
        {{ tag.name }}
      </a>
    </div>

    <header>
      <Swiper class="rounded-t-2xl" :modules="modules" navigation>
        <swiper-slide v-for="item in headerImages" :key="item">
          <div
            class="bg-cover hover:bg-bottom transition-all duration-500 ease-linear delay-200"
            :style="`background-image:url(${$cdn + item});height: 225px`"
          />
        </swiper-slide>
      </Swiper>

      <div class="flex justify-center mt-5 flex-col items-center">
        <time class="flex items-center capitalize">
          <i class="text-2xl iconfont" style="color: #e84e89">&#xe8b4;</i>
          <span class="ml-2 text-sm">{{ time }}</span>
        </time>
      </div>
    </header>

    <main class="text-center px-4">
      <h1 class="title py-2 text-center">
        <nuxt-link :to="to || '/posts/' + id">
          {{ title }}
        </nuxt-link>
      </h1>
      <p class="text-opacity-60 text-black font-light text-center">
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
      <div class="text-sm text-black text-opacity-60">
        <a href="javascript:;">
          <span class="mr-1">{{ visit }}</span>
          <i class="iconfont" style="color: #e84e89">&#xe8f4;</i>
        </a>
        <a href="javascript:;" class="ml-4">
          <span class="mr-1">{{ comment }}</span>
          <i class="iconfont" style="color: #e84e89">&#xe8b5;</i>
        </a>
      </div>
    </footer>
  </article>
</template>

<script lang="ts" setup>
import { Tag } from "~~/composables/type";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";

interface Props {
  id: string;
  title: string;
  desciption: string;
  time: string;
  visit?: number;
  comment?: number;
  tag: Tag;
  headerImages: string[];
  to?: string;
}

const props = withDefaults(defineProps<Props>(), {
  visit: 0,
  comment: 0,
});

const $cdn = useCdnUrl();

const modules = [Navigation];
</script>

<style lang="postcss" scoped>
.article-b {
  @apply rounded-2xl relative bg-white z-10;
  cursor: pointer;
  box-shadow: 0 3px 12px -1px rgb(7 10 25 / 5%),
    0 22px 27px -20px rgb(7 10 25 / 5%);

  .tags {
    @apply absolute w-full -top-4 right-0 text-center;

    a {
      @apply rounded-3xl  font-semibold py-2 px-6;
    }
  }

  .title {
    @apply text-2xl mb-3 mt-3 font-semibold   text-center;
    letter-spacing: 0.6px;
  }

  footer {
    @apply border-t-2 border-black border-opacity-5 py-4 px-4;

    .author-image {
      background-image: url(http://estudiopatagon.com/themes/wordpress/breek/wp-content/uploads/2019/06/avatar-2.jpg);
      @apply w-9 h-9 rounded-full mr-2 inline-block bg-cover;
    }

    .author-name {
      letter-spacing: 0.5px;
      @apply text-sm;
    }
  }
}
</style>
