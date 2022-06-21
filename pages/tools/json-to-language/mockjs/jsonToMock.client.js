export function useJsontoMock(json) {
  let str = "";
  for (let k in json) {
    const v = json[k];

    if (v.type === "array") {
      if (v.items.type === "object") {
        str += `"${k}|0-10": [${useJsontoMock(v.items.properties)}],`;
      }

      if (v.items.type === "string") {
        str += `"${k}|0-10": ["@cword(2,10)"],`;
      }
    } else if (v.type === "string") {
      str += `"${k}": "@cword(2,10)",`;
    } else if (v.type === "integer") {
      str += `"${k}": "@integer(0,10000)",`;
    } else if (v.type === "boolean") {
      str += `"${k}": "@boolean",`;
    } else {
      str += `"${k}": "${v.type}",`;
    }
  }

  return `{${str}}`.replaceAll(",}", "}");
}
