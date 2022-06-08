<template>
  <NuxtLayout name="tools">
    <h1>JSON在线转换工具</h1>
  </NuxtLayout>
</template>

<script setup>
useHead({
  titleTemplate: `JSON在线转换工具 - ${useTitle().title}`,
  meta: [
    {
      name: "description",
      content: "json转换生成ts interface,flutter class,mock.js模板",
    },
  ],
});

await navigateTo("/tools/json-to-language/dart", {
  replace: true,
});
</script>
