<template>
  <div class="flex items-end">
    <div
      class="flex items-center cursor-pointer logo"
      @click="$router.push('/')"
    >
      <nuxt-link to="/" class="flex">
        <div
          class="w-12 h-12 rounded-full transition-all flex items-center justify-center"
        >
          <W :size="30" class="fill-base-100" />
        </div>
        <div
          class="h-12 text-2xl uppercase inline-flex items-center px-2 rounded-full"
        >
          <span class="font-serif font-semibold text-neutral-content">
            {{ cao }} <i v-if="props.showWeek">，</i>
          </span>
        </div>
      </nuxt-link>
    </div>

    <div class="inline-flex h-12 items-center text-xl" v-if="props.showWeek">
      <span class="text-info">今天星期{{ week }} </span>
      <div class="dropdown dropdown-end relative -top-4">
        <label
          tabindex="0"
          class="btn btn-circle btn-ghost text-neutral-content btn-xs"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="w-6 h-6 xl:w-4 xl:h-4 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </label>
        <div
          tabindex="0"
          class="card z-50 compact dropdown-content shadow bg-base-100 rounded-box w-72"
        >
          <div class="card-body">
            <h6 class="card-title mb-2">网站基本信息</h6>
            <p
              class="flex justify-between items-center border-base-200 pb-2 border-b"
            >
              <span class="capitalize">运行</span>
              <span class="capitalize text-info">{{ time }}</span>
            </p>
            <p
              v-for="(item, index) in websiteInfo"
              class="flex justify-between items-center border-base-200 pb-2"
              :class="{ 'border-b': index < websiteInfo.length - 1 }"
            >
              <span class="capitalize">{{ item.name }}</span>
              <span class="capitalize" :class="{ badge: item.badge }">{{
                item.val
              }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useInterval } from "@vueuse/core";
import pkg from "~/package.json";

const websiteInfo = ref([
  { name: "版本", val: pkg.version, badge: true },
  { name: "前端框架", val: "Nuxt3 + Vite", badge: false },
  { name: "UI", val: "TailwindCSS + DaisyUI", badge: false },
  { name: "后端API", val: "Strapi", badge: false },
  { name: "服务器", val: "misaka", badge: false },
  { name: "CDN", val: "cloudflare", badge: false },
  { name: "域名", val: "godaddy", badge: false },
]);

interface Props {
  showWeek?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showWeek: true,
});

const { cao, week } = useTitle();

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
