<template>
  <NuxtLayout name="tools">
    <div class="container h-full m-auto px-32 flex flex-col">
      <div class="px-8 bg-black bg-opacity-25 rounded-md py-4">
        <div class="w-48">
          <select
            class="p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option selected disabled>选择线路</option>
            <option :value="item" v-for="(item, index) in opts">
              解析线路 {{ index + 1 }}
            </option>
          </select>
        </div>
      </div>

      <iframe
        class="m-auto flex-1 w-full border border-white mt-4 rounded-md"
        src="https://jx.playerjy.com/?url=https://v.qq.com/x/cover/m441e3rjq9kwpsc/j00428z3ci0.html"
        frameborder="0"
      />
    </div>
  </NuxtLayout>
</template>

<script setup>
const opts = [
  "//www.ckmov.com/?url=",
  "//www.ckmov.vip/api.php?url=",
  "//jx.playerjy.com/?url=",
  "//pangujiexi.cc/jiexi.php?url=",
  "//jx.xmflv.com/?url=",
  "//jx.aidouer.net/?url=",
  "//jx.m3u8.tv/jiexi/?url=",
  "//jiexi.8old.cn/m3u8tv20210705%60/?url=",
];
</script>
