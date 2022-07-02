<template>
  <article class="article-b">
    <div class="tags relative z-20">
      <nuxt-link
        :to="category.path"
        :style="`color: ${category.color};${category.bgColor}`"
      >
        {{ category.name }}
      </nuxt-link>
    </div>
    <header>
      <Swiper
        class="rounded-t-2xl"
        :modules="modules"
        :navigation="headerImages && headerImages.length > 1"
      >
        <swiper-slide v-for="item in headerImages" :key="item">
          <div
            class="bg-cover hover:bg-right-bottom transition-all duration-500 ease-linear delay-200 relative"
            :style="`background-image:url(${$cdn + item});height: 225px`"
          >
            <div class="swiper-mask" />
          </div>
        </swiper-slide>
      </Swiper>

      <div
        class="flex justify-center mt-5 flex-col items-center"
        @click.stop="$router.push(toLink)"
      >
        <time class="flex items-center capitalize">
          <i class="text-2xl iconfont" style="color: #e84e89">&#xe8b4;</i>
          <span class="ml-2 text-sm">{{ time }}</span>
        </time>
      </div>
    </header>

    <main class="text-center px-4" @click.stop="$router.push(toLink)">
      <h1 class="title py-2 text-center">
        <nuxt-link :to="toLink">
          {{ title }}
        </nuxt-link>
      </h1>
      <p class="text-opacity-60 text-base-content font-light text-center">
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
      <div class="text-sm text-base-content text-opacity-60">
        <a href="javascript:;">
          <span class="mr-1">{{ visit || 0 }}</span>
          <i class="iconfont" style="color: #e84e89">&#xe8f4;</i>
        </a>
        <a href="javascript:;" class="ml-4">
          <span class="mr-1">{{ comment || 0 }}</span>
          <i class="iconfont" style="color: #e84e89">&#xe8b5;</i>
        </a>
      </div>
    </footer>
  </article>
</template>

<script lang="ts" setup>
import { CategoryItem } from "~~/composables/type";
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
  category: CategoryItem;
  headerImages?: string[];
  to?: string;
}

const props = withDefaults(defineProps<Props>(), {
  visit: 0,
  comment: 0,
});

const toLink = computed(() => (props.to ? props.to : `/posts/${props.id}`));

const $cdn = useCdnUrl();

const modules = [Navigation];
</script>

<style lang="postcss" scoped>
.article-b {
  @apply rounded-2xl relative bg-base-100 z-10 cursor-pointer shadow-md;

  .tags {
    @apply absolute w-full -top-4 right-0 text-center;

    a {
      @apply rounded-3xl  font-semibold py-2 px-6;
    }
  }

  .title {
    @apply text-2xl mb-3 mt-3 font-semibold text-center;
    letter-spacing: 0.6px;
  }

  footer {
    @apply border-t-2 border-base-content border-opacity-5 py-4 px-4;

    .author-image {
      @apply w-9 h-9 rounded-full mr-2 inline-block bg-cover;
    }

    .author-name {
      letter-spacing: 0.5px;
      @apply text-sm;
    }
  }
}
</style>
