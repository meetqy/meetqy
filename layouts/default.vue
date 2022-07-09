<template>
  <div id="container" ref="el">
    <div class="container lg:max-w-full xl:container mx-auto px-3">
      <Header class="border-b-2 border-base-100 border-opacity-25 py-8">
        <slot name="title"></slot>
      </Header>

      <main class="w-full">
        <slot></slot>
      </main>

      <Footer class="flex flex-col items-center justify-center mt-20 mb-12" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useScroll } from "@vueuse/core";
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

const emit = defineEmits<{
  (event: "change", y: number): void;
}>();

const el = ref<HTMLElement | null>(null);
const { y } = useScroll(el);

const ps = ref();

onMounted(async () => {
  await nextTick();
  ps.value = new PerfectScrollbar(el.value);
});

onUnmounted(() => {
  ps.value && ps.value.destroy();
});

watch(y, (val) => emit("change", val));
</script>
