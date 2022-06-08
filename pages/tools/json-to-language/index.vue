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
useRouter().replace("json-to-language/dart");
</script>
