import{u as r,j as _,_ as m}from"./Editor-6d7a71a8.mjs";import{_ as p,i as d,u as i,r as j,E as f,a0 as h,Q as v,a3 as g,o as S,c as O,U as x}from"./entry-8348314a.mjs";const C=d({__name:"json-schema",setup(u,{expose:t}){t(),i({titleTemplate:"JSON\u5728\u7EBF\u8F6C\u6362\u5DE5\u5177(to json-schema)",meta:[{name:"description",content:"json\u8F6C\u6362json-schema, json transform to json-schema"}]});const c=async s=>{e.value=s.getValue(),localStorage.setItem("json-to-language",e.value),o.code=a(e.value)},e=j(r());f(()=>x(),s=>{e.value=r()});const o=h({code:"",codeMirrorMode:"dart"});v(async()=>{o.code=a(e.value)});const a=s=>{const l=g(JSON.parse(s));return _(l)},n={change:c,jsonValue:e,codeOption:o,formatJson:a};return Object.defineProperty(n,"__isScriptSetup",{enumerable:!1,value:!0}),n}});function E(u,t,c,e,o,a){const n=m;return S(),O(n,{onChange:e.change,"json-value":e.jsonValue,"code-option":e.codeOption},null,8,["json-value","code-option"])}var V=p(C,[["render",E]]);export{V as default};