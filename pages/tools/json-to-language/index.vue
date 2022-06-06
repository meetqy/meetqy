<template>
  <NuxtLayout name="tools">
    <template #title>JSON在线转换工具</template>

    <main class="flex json-to-language">
      <div ref="jsonEditorElement" class="w-2/5"></div>
      <div
        class="w-16 flex-shrink-0 bg-white bg-opacity-50 border-r-8 border-r-white border-y-8 border-y-orange-600 flex flex-col items-center"
      >
        <div
          v-for="(item, index) in language"
          @click="changeLang(item, index)"
          :key="item.name"
          :class="[item.className, { active: curLanguage === index }]"
        >
          {{ item.name }}
        </div>
      </div>
      <div class="flex-1 lang-editor" ref="langEditorElement"></div>
    </main>
  </NuxtLayout>
</template>

<script setup lang="ts">
import "codemirror/lib/codemirror.css";
import "codemirror/theme/darcula.css";
import "codemirror/addon/scroll/simplescrollbars.css";

const { $codemirror } = useNuxtApp();

useHead({
  titleTemplate: `JSON在线转换工具 - ${useTitle().title}`,
  meta: [
    {
      name: "description",
      content: "json快速生成ts interface,生成flutter class,生成mock.js模板",
    },
  ],
});

const jsonEditorElement = ref();
const langEditorElement = ref();

const curLanguage = ref(0);

interface LanguageItem {
  className: string;
  name: string;
  quicktype: string;
  codeMirror: string;
}

const language: LanguageItem[] = [
  {
    className:
      "bg-gradient-to-r from-green-400 to-blue-500 language text-white",
    name: "Dart",
    quicktype: "dart",
    codeMirror: "dart",
  },
  {
    className: "text-white language bg-blue-500",
    name: "TS",
    quicktype: "typescript",
    codeMirror: "javascript",
  },
];

const changeLang = (lang: LanguageItem, index: number) => {
  curLanguage.value = index;
  setCodeMirror(jsonValue.value, lang);
};

let _jsonCodeMirror = null;
let _langCodeMirror = null;

const jsonValue = ref(`{
  "name": "张三",
  "age": 23,
  "posts": [
    { "name": "甜心教主 - 王心凌", "desc": "这是我的第一篇文章！" },
    { "name": "少女杀手 - 刘畊宏", "desc": "这是我的第二篇文章！" },
    { "name": "小学儿歌 - 孤勇者", "desc": "这是我的第三篇文章！" }
  ],
  "tag": ["github", "gitee"]
}
`);

const setJsonMirror = (code: string) => {
  _jsonCodeMirror.setValue(code);
  setTimeout(() => {
    _jsonCodeMirror.refresh();
  }, 50);
};

const setCodeMirror = async (code: string, languageItem: LanguageItem) => {
  const res = await formatJson(code, languageItem.quicktype);
  _langCodeMirror.setOption("mode", languageItem.codeMirror);
  _langCodeMirror.setValue(res.join("\n"));

  setTimeout(() => {
    _langCodeMirror.refresh();
  });
};

onMounted(() => {
  _jsonCodeMirror = $codemirror(jsonEditorElement.value, {
    mode: "javascript",
    scrollbarStyle: "overlay",
  });

  _langCodeMirror = $codemirror(langEditorElement.value, {
    mode: "javascript",
    theme: "darcula",
    lineNumbers: true,
    scrollbarStyle: "overlay",
    innerHeight: "auto",
  });

  setJsonMirror(jsonValue.value);
  setCodeMirror(jsonValue.value, language[curLanguage.value]);

  // 监听json输入框失去焦点
  _jsonCodeMirror.on("blur", async (e) => {
    const newValue = e.getValue();
    if (!newValue) {
      return false;
    }

    if (jsonValue === newValue) {
      return false;
    }

    jsonValue.value = newValue;

    setCodeMirror(jsonValue.value, language[curLanguage.value]);
  });
});

const formatJson = async (json, lang) => {
  try {
    const res = await $fetch("/api/tools/jsonToLanguage", {
      method: "post",
      body: {
        lang,
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
  height: calc(100vh - 96px - 64px) !important;
}
</style>

<style lang="postcss" scoped>
.language {
  @apply relative w-10 rounded-full h-10 mt-6 flex justify-center items-center cursor-pointer transition-transform;

  &:hover {
    @apply outline-dotted outline-white outline-2 scale-125;
  }

  &.active {
    &::after {
      content: "";
      @apply absolute bottom-1 w-1.5 h-1.5 rounded-full bg-black;
    }
  }
}
</style>
