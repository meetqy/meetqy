import{u as c,a as r,_ as l}from"./Editor-4d1e925d.mjs";import{_,d as i,l as p,C as m,D as f,Y as v,O as g,o as j,i as x,T as h}from"./entry-27d0bed7.mjs";const C=i({__name:"index",setup(u,{expose:n}){n(),p({titleTemplate:"JSON\u5728\u7EBF\u8F6C\u6362\u5DE5\u5177(to dart)",meta:[{name:"description",content:"json\u8F6C\u6362\u4E3Adart class, json transform to dart"}]});const s=async o=>{e.value=o.getValue();const d=await r("dart",e.value);localStorage.setItem("json-to-language",e.value),a.code=d},e=m(c());f(()=>h(),o=>{e.value=c()});const a=v({code:"",codeMirrorMode:"dart"});g(async()=>{const o=await r("dart",e.value);a.code=o});const t={change:s,jsonValue:e,codeOption:a};return Object.defineProperty(t,"__isScriptSetup",{enumerable:!1,value:!0}),t}});function O(u,n,s,e,a,t){const o=l;return j(),x(o,{onChange:e.change,"json-value":e.jsonValue,"code-option":e.codeOption},null,8,["json-value","code-option"])}var V=_(C,[["render",O]]);export{V as default};