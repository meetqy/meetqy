<template>
  <Editor @change="change" :json-value="jsonValue" :code-option="codeOption" />
</template>

<script setup lang="ts">
import toJsonSchema from "to-json-schema";
import jsonFormat from "json-format";
import { CodeOption } from "~~/composables/jsonToLanguage";

useHead({
  titleTemplate: `JSON在线转换工具(to json-schema) - ${useTitle().title}`,
  meta: [
    {
      name: "description",
      content: "json转换json-schema, json transform to json-schema",
    },
  ],
});

const change = async (e) => {
  jsonValue.value = e.getValue();

  codeOption.code = formatJson(jsonValue.value);
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
  codeOption.code = formatJson(jsonValue.value);
});

const formatJson = (value: string): string => {
  const res = toJsonSchema(JSON.parse(value));
  return jsonFormat(res);
};
</script>
