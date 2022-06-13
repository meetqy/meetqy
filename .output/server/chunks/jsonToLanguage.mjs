import { defineEventHandler, useBody } from 'h3';
import { jsonInputForTargetLanguage, InputData, quicktype } from 'quicktype-core';

async function quicktypeJSON(targetLanguage, typeName, jsonString) {
  const jsonInput = jsonInputForTargetLanguage(targetLanguage);
  await jsonInput.addSource({
    name: typeName,
    samples: [jsonString]
  });
  const inputData = new InputData();
  inputData.addInput(jsonInput);
  return await quicktype({
    inputData,
    lang: targetLanguage,
    allPropertiesOptional: false,
    rendererOptions: {
      "just-types": "true"
    }
  });
}
const jsonToLanguage = defineEventHandler(async (event) => {
  const body = await useBody(event);
  const { lines } = await quicktypeJSON(body.lang, body.typeName, body.jsonString);
  return lines;
});

export { jsonToLanguage as default };
//# sourceMappingURL=jsonToLanguage.mjs.map
