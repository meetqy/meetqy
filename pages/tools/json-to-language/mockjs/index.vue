<template>
  <Editor @change="change" :json-value="jsonValue" :code-option="codeOption" />
</template>

<script setup lang="ts">
import toJsonSchema from "to-json-schema";
import jsonFormat from "json-format";
import { CodeOption } from "~~/composables/jsonToLanguage";
import { useJsontoMock } from "./jsonToMock";

useHead({
  titleTemplate: `JSON在线转换工具(to mockjs) - ${useTitle().title}`,
  meta: [
    {
      name: "description",
      content: "json转换mockjs, json transform to mockjs",
    },
  ],
});

const change = async (e) => {
  jsonValue.value = e.getValue();

  codeOption.code = toMockjs(jsonValue.value);
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
  codeMirrorMode: "mockjs",
});

onMounted(async () => {
  codeOption.code = toMockjs(jsonValue.value);
});

const toMockjs = (value: string): string => {
  const res = toJsonSchema(JSON.parse(value));

  const str = useJsontoMock(res.properties);
  console.log(str);

  return jsonFormat(JSON.parse(str));
};
</script>
