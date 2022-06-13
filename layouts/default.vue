<template>
  <div id="container" ref="el">
    <div class="container lg:max-w-full xl:container mx-auto p-6">
      <Header class="border-b-2 border-base-100 border-opacity-25 py-8" />

      <slot></slot>

      <Footer class="flex flex-col items-center justify-center mt-20" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useScroll } from "@vueuse/core";

useHead({
  titleTemplate: useTitle().title,
});

const emit = defineEmits<{
  (event: "change", y: number): void;
}>();

const el = ref<HTMLElement | null>(null);
const { y } = useScroll(el);

watch(y, (val) => emit("change", val));
</script>

<style lang="postcss">
.prose {
  max-width: 100%;
}

.swiper {
  user-select: none;

  .swiper-button-next,
  .swiper-button-prev {
    background-color: #e84e89;
    width: 36px;
    height: 36px;
    @apply flex items-center justify-center rounded-full;

    &::after {
      font-size: 18px;
      color: #fff;
    }
  }

  .swiper-button-next {
    &::after {
      position: relative;
      left: 2px;
    }
  }
}
</style>
