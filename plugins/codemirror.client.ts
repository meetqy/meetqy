import codemirror from "codemirror/lib/codemirror.js";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/dart/dart.js";
import "codemirror/addon/scroll/simplescrollbars.js";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      codemirror,
    },
  };
});
