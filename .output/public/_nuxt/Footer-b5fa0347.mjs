import{_ as d}from"./Logo-0807f729.mjs";import{_ as m,d as f,o as _,c as l,b as u,a,Y as w,F as g,r as v,w as y,f as $,t as b,q as i,h as k,Q as S,R as L}from"./entry-64645e6b.mjs";import{a as h}from"./hooks-6ec93a60.mjs";const B=f({name:"Header",props:{height:null,class:null},setup(o,{expose:s}){s();const{cao:e,week:t}=h(),n={cao:e,week:t,navs:[{name:"\u9996\u9875",url:"/",children:[]}]};return Object.defineProperty(n,"__isScriptSetup",{enumerable:!1,value:!0}),n}}),C={class:"text-white underline"},j={class:"text-white text-lg md:flex hidden"};function F(o,s,e,t,p,n){const r=d,x=k;return _(),l("header",{class:i(["flex justify-between items-center",e.class])},[u(r),a("span",C,[w(o.$slots,"default")]),a("ul",j,[(_(),l(g,null,v(t.navs,c=>a("li",{class:"py-5 pl-12",key:c.name},[u(x,{to:c.url},{default:y(()=>[$(b(c.name),1)]),_:2},1032,["to"])])),64))])],2)}var T=m(B,[["render",F]]);const N=f({name:"Footer",props:{class:null,showLogo:{type:Boolean,default:!0}},setup(o,{expose:s}){s();const{cao:e}=h(),t={cao:e};return Object.defineProperty(t,"__isScriptSetup",{enumerable:!1,value:!0}),t}});function V(o,s,e,t,p,n){const r=d;return _(),l("footer",{class:i(e.class)},[S(u(r,{"show-week":!1},null,512),[[L,e.showLogo]]),a("p",{class:i(["text-black text-opacity-70 text-sm",{"mt-4":e.showLogo}])}," Copyright \xA9 2022 wcao.cc ",2)],2)}var q=m(N,[["render",V]]);export{T as _,q as a};