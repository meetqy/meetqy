<template>
  <nuxt-layout name="tools">
    <template #title>
      <div class="w-full flex justify-end pr-10">
        <button class="btn rounded-box border-0 bg-opacity-50 capitalize">
          快速把 Tailwind 转换为 DaisyUI 主题
        </button>
      </div>
    </template>

    <div class="hidden lg:block h-full">
      <main class="h-full flex tailwind-to-daisyui">
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
  function varClassFromTo(classname, from, to) {
    const reg = new RegExp(`[a-z]+-${from}(-[0-9]+)?`);

    return classname.map((item) => {
      return item.replace(reg, (e) => {
        const n = e.match(/[0-9]+/);
        const prefix = e.split(`-${from}`)[0];

        if (n) {
          return `${prefix}${to} ${prefix}-opacity-${+n[0] / 10}`;
        } else {
          return `${prefix}${to}`;
        }
      });
    });
  }

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

      // white
      classname = varClassFromTo(classname, "white", "-base-100");

      // blue
      classname = varClassFromTo(classname, "blue", "-primary");

      // green
      classname = varClassFromTo(classname, "green", "-success");

      // gray
      classname = varClassFromTo(classname, "gray", "-base-content");

      // slate
      classname = varClassFromTo(classname, "slate", "-accent-focus");

      // violet
      classname = varClassFromTo(classname, "violet", "-primary");

      return `class="${classname.join(" ")}"`;
    })
    .replace(/src=('|").*?("|')/g, (e) => {
      if (e.includes("https://wcao.cc")) return e;
      return `src='https://wcao.cc/r/a/xxx'`;
    });
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
