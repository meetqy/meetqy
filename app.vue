<template>
  <NuxtPage />
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

.tag {
  @apply px-4 py-2 text-white text-center rounded-full inline-block;

  &.sm {
    @apply py-1;
  }
}

.logo {
  div {
    @apply transition-all;
    &:first-child {
      @apply bg-gradient-to-r from-green-400 to-blue-500 fill-white;
    }

    &:last-child {
      @apply text-white;
    }
  }
}
</style>
