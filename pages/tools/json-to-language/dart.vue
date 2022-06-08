<template>
  <Editor @change="change" :json-value="jsonValue" :code-option="codeOption" />
</template>

<script setup lang="ts">
import { CodeOption } from "~~/composables/jsonToLanguage";

useHead({
  titleTemplate: `JSON在线转换工具(to dart) - ${useTitle().title}`,
  meta: [
    {
      name: "description",
      content: "json转换为dart class, json transform to dart",
    },
  ],
});

const change = async (e) => {
  jsonValue.value = e.getValue();

  const code = await useJsonToLanguage(
    useRoute().path.replace("/tools/json-to-language/", ""),
    jsonValue.value
  );

  codeOption.code = code;
};

const jsonValue = ref<string>(useJsonDefaultValue());

watch(
  () => useRoute(),
  (e) => {
    jsonValue.value = useJsonDefaultValue();
  }
);

const codeOption = reactive<CodeOption>({
  code: "",
  codeMirrorMode: "dart",
});

onMounted(async () => {
  const code = await useJsonToLanguage(
    useRoute().path.replace("/tools/json-to-language/", ""),
    jsonValue.value
  );

  codeOption.code = code;
});
</script>
