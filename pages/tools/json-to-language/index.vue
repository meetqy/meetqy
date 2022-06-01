<template>
  <NuxtLayout name="tools">
    <main class="flex json-to-language">
      <div ref="jsonEditor" class="w-1/3"></div>
      <div class="flex-1 lang-editor" ref="langEditor"></div>
    </main>
  </NuxtLayout>
</template>

<script setup>
import "codemirror/lib/codemirror.css";
import "codemirror/theme/darcula.css";
import "codemirror/addon/scroll/simplescrollbars.css";
const { $codemirror } = useNuxtApp();

const jsonEditor = ref();
const langEditor = ref();

let _jsonCodeMirror = null;
let _langCodeMirror = null;

const _code = `{
  "name": "张三",
  "age": 23,
  "posts": [
    { "name": "甜心教主 - 王心凌", "desc": "这是我的第一篇文章！" },
    { "name": "少女杀手 - 刘畊宏", "desc": "这是我的第二篇文章！" }
  ],
  "tag": ["github", "gitee"]
}
`;

let jsonValue = _code;

onMounted(() => {
  _jsonCodeMirror = $codemirror(jsonEditor.value, {
    mode: "javascript",
    scrollbarStyle: "overlay",
  });

  _langCodeMirror = $codemirror(langEditor.value, {
    mode: "javascript",
    theme: "darcula",
    lineNumbers: true,
    scrollbarStyle: "overlay",
    innerHeight: "auto",
  });

  // 首次加载
  async function first() {
    const result = await formatJson(_code);
    _jsonCodeMirror.setValue(_code);
    _langCodeMirror.setValue(result.join("\n"));
  }

  first();

  // 监听json输入框失去焦点
  _jsonCodeMirror.on("blur", async (e) => {
    const newValue = e.getValue();
    if (!newValue) {
      return false;
    }

    if (jsonValue === newValue) {
      return false;
    }

    jsonValue = newValue;

    const result = await formatJson(e.getValue());

    _langCodeMirror.setValue(result.join("\n"));
  });
});

const formatJson = async (json) => {
  try {
    const res = await $fetch("/api/tools/jsonToLanguage", {
      method: "post",
      body: {
        lang: "typescript",
        typeName: "Hello",
        jsonString: json,
      },
    });
    return res;
  } catch (e) {
    alert(e.response._data.message);
  }
};
</script>

<style lang="postcss">
.json-to-language .CodeMirror {
  height: calc(100vh - 64px - 56px) !important;
}
</style>
