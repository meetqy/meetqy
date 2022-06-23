<template>
  <footer :class="class" class="py-8">
    <Logo v-show="showLogo" :show-week="false" />
    <p
      class="text-neutral-content text-sm flex flex-col-reverse justify-center items-center"
      :class="{ 'mt-4': showLogo }"
    >
      <span>Copyright © 2022 wcao.cc</span>
      <span
        class="mx-2 text-neutral-content text-opacity-20 hidden xl:inline-block"
        >|</span
      >
      <span>运行: {{ time }}</span>
    </p>
  </footer>
</template>

<script setup lang="ts">
import { useInterval } from "@vueuse/core";
interface Props {
  class?: string;
  showLogo?: boolean;
}

withDefaults(defineProps<Props>(), {
  showLogo: true,
});

const counter = useInterval(1000);

const time = ref();

watch(counter, (val) => {
  const t = (Date.now() - startTime) / 1000;

  time.value = getDuration(t);
});

const getDuration = (second) => {
  var duration;
  var days = Math.floor(second / 86400);
  var hours = Math.floor((second % 86400) / 3600);
  var minutes = Math.floor(((second % 86400) % 3600) / 60);
  var seconds = Math.floor(((second % 86400) % 3600) % 60);
  if (days > 0)
    duration = days + "天" + hours + "时" + minutes + "分" + seconds + "秒";
  else if (hours > 0) duration = hours + "时" + minutes + "分" + seconds + "秒";
  else if (minutes > 0) duration = minutes + "分" + seconds + "秒";
  else if (seconds > 0) duration = seconds + "秒";
  return duration;
};
</script>
