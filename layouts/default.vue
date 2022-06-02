<template>
  <div class="m-auto container px-32">
    <Header class="border-b-2 border-white border-opacity-25" />

    <slot></slot>

    <Footer class="mt-40 pb-20 flex flex-col items-center justify-center" />
  </div>
</template>

<script setup>
useHead({
  titleTemplate: useTitle().title,
});
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
