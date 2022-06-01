import {
  quicktype,
  InputData,
  jsonInputForTargetLanguage,
} from "quicktype-core";

async function quicktypeJSON(targetLanguage, typeName, jsonString) {
  const jsonInput = jsonInputForTargetLanguage(targetLanguage);

  // We could add multiple samples for the same desired
  // type, or many sources for other types. Here we're
  // just making one type from one piece of sample JSON.
  await jsonInput.addSource({
    name: typeName,
    samples: [jsonString],
  });

  const inputData = new InputData();
  inputData.addInput(jsonInput);

  return await quicktype({
    inputData,
    lang: targetLanguage,
    // 全部可选
    allPropertiesOptional: false,
    rendererOptions: {
      "just-types": "true",
    },
  });
}

export default defineEventHandler(async (event) => {
  const body: Body = await useBody(event);

  interface Body {
    lang: string;
    typeName: string;
    jsonString: string;
  }

  const { lines } = await quicktypeJSON(
    body.lang,
    body.typeName,
    body.jsonString
  );

  return lines;
});
