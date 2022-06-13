<template>
  <div class="flex items-end">
    <div
      class="flex items-center cursor-pointer logo"
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
        <span class="font-serif font-semibold">
          {{ cao }} <i v-if="props.showWeek">，</i>
        </span>
      </div>
    </div>

    <div
      class="inline-flex h-12 items-center text-white text-2xl"
      v-if="props.showWeek"
    >
      <span class="text-yellow-400">今天星期{{ week }} </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  showWeek?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showWeek: true,
});

const { cao, week } = useTitle();
</script>

<style lang="postcss" scoped>
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
