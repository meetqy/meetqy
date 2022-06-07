export const useJsonToLanguage = async (
  lang: string,
  value: string
): Promise<string> => {
  const res = await $fetch("/api/tools/jsonToLanguage", {
    method: "post",
    body: {
      lang,
      typeName: "Hello",
      jsonString: value,
    },
  });

  return res.join("\n");
};

export const useJsonDefaultValue = () => {
  const _ = JSON.stringify({
    name: "张三",
    age: 23,
    posts: [
      { name: "甜心教主 - 王心凌", desc: "这是我的第一篇文章！" },
      { name: "少女杀手 - 刘畊宏", desc: "这是我的第二篇文章！" },
      { name: "小学儿歌 - 孤勇者", desc: "这是我的第三篇文章！" },
    ],
    tag: ["github", "gitee"],
  });

  try {
    return localStorage.getItem("json-to-language") || _;
  } catch (e) {
    return _;
  }
};

export type CodeOption = {
  // 转换之后的代码
  code: string;
  // 语言 codeMirror language
  codeMirrorMode: string;
};
