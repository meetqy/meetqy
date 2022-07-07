<template>
  <footer :class="class">
    <Logo v-show="showLogo" :show-week="false" />
    <p
      class="text-neutral-content text-sm flex flex-col-reverse xl:flex-row justify-center items-center"
      :class="{ 'mt-4': showLogo }"
    >
      <span>Copyright © 2022 wcao.cc</span>
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
