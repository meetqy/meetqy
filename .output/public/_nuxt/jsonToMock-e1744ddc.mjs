function o(r){let t="";for(let i in r){const e=r[i];e.type==="array"?(e.items.type==="object"&&(t+=`"${i}|0-10": [${o(e.items.properties)}],`),e.items.type==="string"&&(t+=`"${i}|0-10": ["@cword(2,10)"],`)):e.type==="string"?t+=`"${i}": "@cword(2,10)",`:e.type==="integer"?t+=`"${i}": "@integer(0,10000)",`:e.type==="boolean"?t+=`"${i}": "@boolean",`:t+=`"${i}": "${e.type}",`}return`{${t}}`.replaceAll(",}","}")}export{o as useJsontoMock};