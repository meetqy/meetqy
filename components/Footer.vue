<template>
  <footer :class="class">
    <div
      class="flex items-center cursor-pointer logo"
      v-if="showLogo"
      @click="$router.push('/')"
    >
      <div
        class="w-12 h-12 rounded-full transition-all flex items-center justify-center"
      >
        <W :size="30" />
      </div>
      <div
        class="h-12 text-2xl uppercase inline-flex items-center px-2 rounded-full"
      >
        <span class="font-serif font-semibold">{{ cao }}</span>
      </div>
    </div>
    <p class="text-black text-opacity-70 text-sm" :class="{ 'mt-4': showLogo }">
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
