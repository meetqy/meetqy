import{_ as z}from"./Logo-5f9179f7.mjs";import{_ as U,U as P,r as m,g as y,h,Q as C,u as V,o as j,c as A,w as R,a as E,b as e,z as i,d as I,k as J,x as O,F as Q,W as L,X as T,l as c,t as r,s as W}from"./entry-b77ad367.mjs";import{u as X,a as G}from"./useStrapi4-f295eb9c.mjs";import{u as K}from"./fetch-2b1e7e1d.mjs";import{u as B}from"./ultra-45387058.mjs";import{u as F}from"./index-d7b3f138.mjs";import{H as S}from"./index-ed8b9815.mjs";const Y={__name:"[id]",async setup(D,{expose:p}){p();let s,t;const u=P(),b=["light","dark","cupcake","bumblebee","emerald","corporate","synthwave","retro","cyberpunk","valentine","halloween","garden","forest","aqua","lofi","pastel","fantasy","wireframe","black","luxury","dracula","cmyk","autumn","business","acid","lemonade","night","coffee","winter"],o=m(!1),{id:n}=u.params,{data:a}=([s,t]=y(()=>X(`posts/${n}`,()=>G().find(`posts/${n}`,{publicationState:"live",populate:["tags"]}))),s=await s,t(),s),l=h(()=>a.value.data.attributes),f=h(()=>l.value.tags.data),d=l.value.title.split(" Part "),{data:M}=([s,t]=y(()=>K(`/fragments/${d[0].toLowerCase()}/${d[1]}.html`,{baseURL:W()})),s=await s,t(),s),H=h(()=>B[l.value.title.split(" Part ")[1]]),v=m("dark"),N=()=>{o.value=!o.value,o.value&&S.highlightBlock(document.querySelector("#pre-"+n))},g=F({selector:"html",attribute:"data-theme",valueDark:"dark",valueLight:"light"});C(()=>{v.value=g.value?"dark":"light"});const q=_=>{x.value=_>150},x=m(!1),w=h(()=>B[d[1]]);C(()=>{V({titleTemplate:`${l.value.title}:${w.value[1]} - ${f.value.map(_=>_.attributes.name).join(",")}\u6A21\u677F`})});const k={route:u,themes:b,activeCode:o,id:n,data:a,post:l,tags:f,file:d,html:M,name:H,curTheme:v,showCode:N,isDark:g,onChange:q,asideFixed:x,ultraName:w,useDark:F,hljs:S};return Object.defineProperty(k,"__isScriptSetup",{enumerable:!1,value:!0}),k}},Z={class:"main-content flex"},$={class:"p-2 h-min rounded-box"},ee={class:"menu bg-base-100 p-2 w-full h-96 overflow-y-scroll rounded-box scrollbar"},te=e("li",{class:"menu-title py-2"},[e("span",{class:"flex justify-between items-center"},[c(" Change Theme "),e("span",null,[c(" use: "),e("a",{class:"btn btn-link btn-xs",href:"https://daisyui.com/",target:"_blank"}," DaisyUI ")])])],-1),se=["data-theme"],ae=["onClick"],oe=e("div",{class:"flex gap-1 h-4"},[e("div",{class:"bg-primary w-2 rounded"}),e("div",{class:"bg-secondary w-2 rounded"}),e("div",{class:"bg-accent w-2 rounded"}),e("div",{class:"bg-neutral w-2 rounded"})],-1),ne={class:"w-96 flex-shrink-0 opacity-0 hidden lg:flex"},le={class:"flex-1 relative overflow-hidden px-5 bg-base-100 py-10 rounded-box"},ie={class:"prose mb-8"},re={class:"flex justify-between capitalize"},ce={class:"text-info"},de={class:"font-light ml-2 text-base-content text-opacity-50"},he=["data-theme"],ue={class:"flex absolute right-4 top-2"},_e=e("svg",{xmlns:"http://www.w3.org/2000/svg",class:"h-6 w-6",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor","stroke-width":"2"},[e("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"})],-1),me=[_e],pe=["href"],be=e("svg",{xmlns:"http://www.w3.org/2000/svg",class:"h-6 w-6",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor","stroke-width":"2"},[e("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"})],-1),fe=[be],ve=["innerHTML"],ge={class:"bg-base-200 px-4"},xe=c("                "),we=["id"],ke=c(`
            `);function ye(D,p,s,t,u,b){const o=z,n=E;return j(),A(n,{onChange:t.onChange},{default:R(()=>[e("main",Z,[e("aside",{class:i([{fixed:t.asideFixed},"top-0 w-96 flex-shrink-0 max-h-screen hidden lg:flex flex-col z-10 "])},[e("section",{class:i(["w-full xl:pr-10 pr-4 my-5",{hidden:!t.asideFixed}])},[e("div",$,[I(o)])],2),e("section",{class:i(["w-full xl:pr-10 pr-4",{"xl:mt-5":t.asideFixed}])},[e("ul",ee,[te,(j(),J(Q,null,O(t.themes,a=>e("li",{key:a,"data-theme":a,class:i(["my-2 shadow rounded-box",{"outline-dashed":t.curTheme===a}])},[e("a",{href:"javascript:;",class:"flex justify-between hover:bg-transparent active:bg-transparent focus:bg-transparent",onClick:l=>t.curTheme=a},[e("span",null,r(a),1),oe],8,ae)],10,se)),64))])],2)],2),L(e("aside",ne,null,512),[[T,t.asideFixed]]),e("div",le,[e("div",ie,[e("h2",re,[c(r(t.post.title)+" ",1),e("span",null,[e("small",ce,r(t.name[0]),1),e("small",de," ("+r(t.name[1])+") ",1)])])]),e("div",{class:"mockup-window border bg-base-300 w-full mb-8","data-theme":t.curTheme},[e("div",ue,[e("div",{class:i(["btn btn-sm btn-square btn-primary mr-4",{"btn-link":!t.activeCode}]),title:"\u67E5\u770B\u6E90\u7801",onClick:t.showCode},me,2),e("a",{href:t.post.link,target:"_blank",class:"btn btn-sm btn-square btn-ghost",title:"\u6A21\u677F\u6765\u6E90"},fe,8,pe)]),e("div",{class:"flex justify-center px-4 lg:pt-16 lg:pb-10 pt-8 pb-5 bg-base-200",innerHTML:t.html},null,8,ve),L(e("pre",ge,[xe,e("code",{id:"pre-"+t.id,class:"rounded-box"},r(t.html),9,we),ke],512),[[T,t.activeCode]])],8,he)])])]),_:1})}var De=U(Y,[["render",ye]]);export{De as default};