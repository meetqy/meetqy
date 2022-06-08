<template>
  <NuxtLayout name="tools">
    <template #title>JSON在线转换工具</template>

    <main class="flex json-to-language">
      <div ref="jsonEditorElement" class="w-2/5"></div>
      <div
        class="w-16 flex-shrink-0 bg-white bg-opacity-50 border-r-8 border-r-white border-y-8 border-y-orange-600 flex flex-col items-center"
      >
        <nuxt-link
          v-for="(item, index) in language"
          :key="item.name"
          :to="item.quicktype"
        >
          <div
            :class="[item.className, { active: curLanguageIndex === index }]"
          >
            {{ item.name }}
          </div>
        </nuxt-link>
      </div>
      <div class="flex-1 lang-editor" ref="langEditorElement"></div>
    </main>
  </NuxtLayout>
</template>

<script setup lang="ts">
import "codemirror/lib/codemirror.css";
import "codemirror/theme/darcula.css";
import "codemirror/addon/scroll/simplescrollbars.css";
import jsonFormat from "json-format";

import { CodeOption } from "~~/composables/jsonToLanguage";

interface Props {
  jsonValue: string;
  codeOption: CodeOption;
}

const props = defineProps<Props>();

watch(
  () => props.jsonValue,
  (val) => setJsonMirror(val)
);

watch(props.codeOption, (val) => setCodeMirror(val));

const emit = defineEmits<{
  (event: "change", e: unknown): void;
}>();

const { $codemirror } = useNuxtApp();

const curLanguageIndex = computed(() => {
  const lang = useRoute().path.replace("/tools/json-to-language/", "");
  return language.findIndex((item) => item.quicktype === lang);
});

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
  {
    name: "{√x}",
    className: "bg-white language text-black",
    quicktype: "json-schema",
    codeMirror: "javascript",
  },
];

let _jsonCodeMirror = null;
let _langCodeMirror = null;

const setJsonMirror = (code: string) => {
  if (!code) return;
  _jsonCodeMirror.setValue(jsonFormat(JSON.parse(code)));
  setTimeout(() => {
    _jsonCodeMirror.refresh();
  }, 50);
};

const setCodeMirror = async (codeOption: CodeOption) => {
  _langCodeMirror.setOption("mode", codeOption.codeMirrorMode);
  _langCodeMirror.setValue(codeOption.code);

  setTimeout(() => {
    _langCodeMirror.refresh();
  }, 50);
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

  setJsonMirror(props.jsonValue);
  setCodeMirror(props.codeOption);

  // 监听json输入框失去焦点
  _jsonCodeMirror.on("blur", async (e) => emit("change", e));
});

onUnmounted(() => {
  localStorage.setItem("json-to-language", props.jsonValue);
});
</script>

<style lang="postcss">
.json-to-language .CodeMirror {
  @apply tools-body;
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
