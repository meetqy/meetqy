<template>
  <footer :class="class">
    <Logo v-show="showLogo" :show-week="false" />
    <p
      class="text-base-100 text-opacity-70 text-sm"
      :class="{ 'mt-4': showLogo }"
    >
      Copyright © 2022 wcao.cc
    </p>
  </footer>
</template>

<script setup lang="ts">
interface Props {
  class?: string;
  showLogo?: boolean;
}

withDefaults(defineProps<Props>(), {
  showLogo: true,
});

const { cao } = useTitle();
</script>
