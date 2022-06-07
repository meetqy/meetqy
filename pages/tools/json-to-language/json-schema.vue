<template>
  <Editor @change="change" :json-value="jsonValue" :code-option="codeOption" />
</template>

<script setup lang="ts">
import toJsonSchema from "to-json-schema";
import jsonFormat from "json-format";
import { CodeOption } from "~~/composables/jsonToLanguage";

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
