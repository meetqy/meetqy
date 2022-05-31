<template>
  <div class="m-auto container px-32">
    <Header />

    <NuxtPage />

    <Footer />
  </div>
</template>

<style lang="postcss">
body {
  @apply font-mono;

  &::before {
    content: "";
    @apply fixed left-0 top-0 w-screen h-screen -z-10;
    background: linear-gradient(
      to right bottom,
      #6d327c,
      #485da6,
      #00a1ba,
      #01b18e,
      #32b37b
    );
  }
}

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
