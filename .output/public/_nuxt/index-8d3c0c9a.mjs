import{u as c,j as i,_ as d}from"./Editor-19284597.mjs";import{_ as l,g as m,u as f,r as j,D as v,X as k,h,Y as x,o as J,b as O,J as g}from"./entry-20d52372.mjs";import{useJsontoMock as M}from"./jsonToMock.client-bf35b3a9.mjs";const S=m({__name:"index",setup(u,{expose:a}){a(),f({titleTemplate:"JSON\u5728\u7EBF\u8F6C\u6362\u5DE5\u5177(to mockjs)",meta:[{name:"description",content:"json\u8F6C\u6362mockjs, json transform to mockjs"}]});const r=async t=>{e.value=t.getValue(),o.code=n(e.value)},e=j(c());v(()=>g(),t=>{e.value=c()});const o=k({code:"",codeMirrorMode:"mockjs"});h(async()=>{o.code=n(e.value)});const n=t=>{const p=x(JSON.parse(t)),_=M(p.properties);return i(JSON.parse(_))},s={change:r,jsonValue:e,codeOption:o,toMockjs:n};return Object.defineProperty(s,"__isScriptSetup",{enumerable:!1,value:!0}),s}});function b(u,a,r,e,o,n){const s=d;return J(),O(s,{onChange:e.change,"json-value":e.jsonValue,"code-option":e.codeOption},null,8,["json-value","code-option"])}var y=l(S,[["render",b]]);export{y as default};