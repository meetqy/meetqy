import{u as r,j as i,_ as d}from"./Editor-34e2556f.mjs";import{_ as l,d as m,l as f,C as j,D as v,a0 as k,O,a2 as x,o as h,i as C,T as J}from"./entry-873facc3.mjs";import{useJsontoMock as M}from"./jsonToMock.client-bf35b3a9.mjs";const S=m({__name:"index",setup(u,{expose:a}){a(),f({titleTemplate:"JSON\u5728\u7EBF\u8F6C\u6362\u5DE5\u5177(to mockjs)",meta:[{name:"description",content:"json\u8F6C\u6362mockjs, json transform to mockjs"}]});const c=async t=>{e.value=t.getValue(),o.code=n(e.value)},e=j(r());v(()=>J(),t=>{e.value=r()});const o=k({code:"",codeMirrorMode:"mockjs"});O(async()=>{o.code=n(e.value)});const n=t=>{const p=x(JSON.parse(t)),_=M(p.properties);return i(JSON.parse(_))},s={change:c,jsonValue:e,codeOption:o,toMockjs:n};return Object.defineProperty(s,"__isScriptSetup",{enumerable:!1,value:!0}),s}});function g(u,a,c,e,o,n){const s=d;return h(),C(s,{onChange:e.change,"json-value":e.jsonValue,"code-option":e.codeOption},null,8,["json-value","code-option"])}var y=l(S,[["render",g]]);export{y as default};