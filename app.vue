<template>
  <div>
    <NuxtLoadingBar :duration="1000" />

    <NuxtPage />
  </div>
</template>

<script setup>
onMounted(() => {
  const appHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty("--app-height", `${window.innerHeight}px`);
  };
  window.addEventListener("resize", appHeight);
  appHeight();
});
</script>

<style lang="postcss">
:root {
  --app-height: 100%;
}

#container {
  height: var(--app-height);
  @apply overflow-y-scroll;
}

html,
body {
  padding: 0;
  margin: 0;
  overflow: hidden;
  width: 100vw;
  height: var(--app-height);

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
