import{u as r,a as u,_ as i}from"./Editor-34e2556f.mjs";import{_,d,l as m,C as f,D as g,a0 as j,O as v,T as n,o as y,i as h}from"./entry-873facc3.mjs";const C=d({__name:"typescript",setup(p,{expose:s}){s(),m({titleTemplate:"JSON\u5728\u7EBF\u8F6C\u6362\u5DE5\u5177(to typescript)",meta:[{name:"description",content:"json\u8F6C\u6362\u4E3Atypescript, json transform to typescript"}]});const c=async o=>{e.value=o.getValue();const l=await u(n().path.replace("/tools/json-to-language/",""),e.value);localStorage.setItem("json-to-language",e.value),t.code=l},e=f(r());g(()=>n(),o=>{e.value=r()});const t=j({code:"",codeMirrorMode:"dart"});v(async()=>{const o=await u(n().path.replace("/tools/json-to-language/",""),e.value);t.code=o});const a={change:c,jsonValue:e,codeOption:t};return Object.defineProperty(a,"__isScriptSetup",{enumerable:!1,value:!0}),a}});function O(p,s,c,e,t,a){const o=i;return y(),h(o,{onChange:e.change,"json-value":e.jsonValue,"code-option":e.codeOption},null,8,["json-value","code-option"])}var S=_(C,[["render",O]]);export{S as default};