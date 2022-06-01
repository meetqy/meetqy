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
</style>
