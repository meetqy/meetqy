<template>
  <NuxtLayout name="tools">
    <template #title>
      to {{ curLanguageIndex > -1 && language[curLanguageIndex].language }}
    </template>

    <div class="hidden lg:block">
      <main class="json-to-language flex">
        <div ref="jsonEditorElement" class="w-2/5"></div>
        <div
          class="w-16 flex-shrink-0 bg-white bg-opacity-50 border-r-8 border-r-white border-y-8 border-y-orange-600 flex flex-col items-center"
        >
          <nuxt-link
            v-for="(item, index) in language"
            :key="item.name"
            :to="'/tools/json-to-language/' + item.language"
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
    </div>

    <div class="prose flex justify-center items-center h-full lg:hidden">
      <h2 class="text-white">工具类不适合在手机端上显示</h2>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import "codemirror/lib/codemirror.css";
import "codemirror/theme/mdn-like.css";
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

const language = allLanguage;

const curLanguageIndex = computed(() => {
  let lang = useRoute().path.replace("/tools/json-to-language/", "");
  if (lang === "/tools/json-to-language") lang = "dart";
  return language.findIndex((item) => item.language === lang);
});

const jsonEditorElement = ref();
const langEditorElement = ref();

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
  _langCodeMirror.setValue(codeOption.code);

  setTimeout(() => {
    _langCodeMirror.refresh();
  }, 50);
};

let t;

onMounted(async () => {
  _jsonCodeMirror = $codemirror(jsonEditorElement.value, {
    mode: "application/ld+json",
    theme: "mdn-like",
    scrollbarStyle: "overlay",
    lineNumbers: true,
  });

  _langCodeMirror = $codemirror(langEditorElement.value, {
    mode: language[curLanguageIndex.value].mode,
    theme: "mdn-like",
    lineNumbers: true,
    scrollbarStyle: "overlay",
    innerHeight: "auto",
  });

  setJsonMirror(props.jsonValue);
  setCodeMirror(props.codeOption);

  // 监听json输入框失去焦点
  _jsonCodeMirror.on("change", async (e) => {
    if (t) {
      clearTimeout(t);
    }

    t = setTimeout(() => {
      emit("change", e);
    }, 1000);
  });
});
</script>

<style lang="postcss">
.json-to-language .CodeMirror {
  @apply tools-body text-base;
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
