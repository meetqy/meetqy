<template>
  <footer :class="class">
    <div class="flex items-end" v-if="showLogo">
      <W class="fill-black" :size="32" />
      <C class="fill-white" :size="24" />
      <A class="fill-white" :size="24" />
      <O class="fill-white" :size="24" />
    </div>
    <p class="text-black text-opacity-50 text-sm" :class="{ 'mt-4': showLogo }">
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
</script>
