<template>
  <nuxt-layout name="tools">
    <template #title>快速把 Tailwind 转换为 DaisyUI 主题 </template>

    <div class="hidden lg:block">
      <main class="tailwind-to-daisyui flex">
        <div ref="leftEditorElement" class="w-1/2"></div>

        <div class="w-1/2 lang-editor" ref="rightEditorElement"></div>
      </main>
    </div>

    <div class="prose flex justify-center items-center h-full lg:hidden">
      <h2 class="text-white">工具类不适合在手机端上显示</h2>
    </div>
  </nuxt-layout>
</template>

<script setup>
import "codemirror/lib/codemirror.css";
import "codemirror/addon/scroll/simplescrollbars.css";
import defaultCode from "./default.client";

useHead({
  titleTemplate: `快速把 Tailwind 转换为 DaisyUI 主题`,
  meta: [
    {
      name: "description",
      content: "快速把 Tailwind 转换为 DaisyUI 主题",
    },
  ],
});

const leftEditorElement = ref();
const rightEditorElement = ref();

const { $codemirror } = useNuxtApp();

let _leftCodeMirror = null;
let _rightCodeMirror = null;

const setLeftMirror = (code) => {
  if (!code) return;
  _leftCodeMirror.setValue(code);
  setTimeout(() => {
    _leftCodeMirror.refresh();
  }, 50);
};

const setRightMirror = async (code) => {
  _rightCodeMirror.setValue(code);

  setTimeout(() => {
    _rightCodeMirror.refresh();
  }, 50);
};

// 转换daisyui
const toDaisyUI = (str) => {
  return str
    .replace(/class=('|").*?("|')/g, (e) => {
      let classname = e.split("class=")[1].replace(/'|"/g, "").split(" ");
      // 按钮
      const btn = classname.filter((item) => /hover|focus/.test(item));
      if (btn.length > 1) {
        classname = ["btn", "capitalize", "btn-primary"];
      }
      // 移除 dark:xxx
      classname = classname.filter((item) => !/dark:/.test(item));

      // bg-white 替换为 bg-base-100
      classname = classname.map((item) =>
        item.replace(/bg-white/, "bg-base-100")
      );

      // *-blue-*  => primary
      classname = classname.map((item) =>
        item.replace(/blue-(\d)+/, "primary")
      );

      // *-green-*  => success
      classname = classname.map((item) =>
        item.replace(/green-(\d)+/, "success")
      );

      // gray
      classname = classname.map((item) => {
        return item.replace(/[a-z]+-gray-[0-9]+/, (e) => {
          const n = e.match(/[0-9]+/)[0];
          const prefix = e.split("-gray")[0];
          return `${prefix}-base-content ${prefix}-opacity-${+n / 10}`;
        });
      });

      // slate
      classname = classname.map((item) => {
        return item.replace(/[a-z]+-slate-[0-9]+/, (e) => {
          const n = e.match(/[0-9]+/)[0];
          const prefix = e.split("-slate")[0];
          return `${prefix}-accent-focus ${prefix}-opacity-${+n / 10}`;
        });
      });

      return `class="${classname.join(" ")}"`;
    })
    .replace(/src=('|").*?("|')/g, `src='https://wcao.cc/r/a/xxx'`);
};

onMounted(async () => {
  await import("codemirror/mode/xml/xml.js");

  _leftCodeMirror = $codemirror(leftEditorElement.value, {
    mode: "text/html",
    scrollbarStyle: "overlay",
    lineNumbers: true,
    htmlMode: true,
  });

  _rightCodeMirror = $codemirror(rightEditorElement.value, {
    mode: "text/html",
    lineNumbers: true,
    scrollbarStyle: "overlay",
    innerHeight: "auto",
  });

  let t;

  setLeftMirror(defaultCode);
  setRightMirror(toDaisyUI(defaultCode));

  // 监听json输入框失去焦点
  _leftCodeMirror.on("change", async (e) => {
    if (t) {
      clearTimeout(t);
    }

    t = setTimeout(() => {
      const res = toDaisyUI(e.getValue());
      setRightMirror(res);
    }, 500);
  });
});
</script>

<style lang="postcss">
.tailwind-to-daisyui .CodeMirror {
  @apply tools-body text-base;
}
</style>
