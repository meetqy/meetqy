import{_ as z}from"./Logo-f34aa24b.mjs";import{_ as T,r as g,w as F,c as v,i as N,u as S,N as j,o as n,b as B,d as u,e as D,k as e,z as p,m as b,j as l,q as m,F as h,O as w,Q as V,p as k,y as L,t as x,f as A}from"./entry-8204318d.mjs";import{u as I,a as O}from"./useStrapi4-8fb4a3ac.mjs";const R={__name:"index",async setup(C,{expose:f}){f();let c,t;const y=g(0),{data:r}=([c,t]=F(()=>I("tools/random-image",()=>O().find("tools/4"))),c=await c,t(),c),a=v(()=>r.value.data.attributes);N(()=>{S({titleTemplate:`${a.value.title} - ${a.value.description}`,meta:[{name:"description",content:`${a.value.description}`}]})});const d=v(()=>a.value.extend),_=o=>{i.value=o>150},i=g(!1),s={curTypes:y,data:r,post:a,types:d,onChange:_,asideFixed:i};return Object.defineProperty(s,"__isScriptSetup",{enumerable:!1,value:!0}),s}},$=e("div",{class:"w-full flex justify-end pr-10"},[e("button",{class:"btn rounded-box border-0 bg-opacity-50 capitalize"}," Random Image ")],-1),q={class:"flex"},E={class:"p-2 h-min rounded-box"},H={class:"w-full xl:mr-10 pr-4"},M={class:"menu bg-base-100 p-2 w-full rounded-box overflow-y-scroll h-96 scrollbar"},P=e("li",{class:"menu-title py-2"},[e("span",null,"Type")],-1),Q=["onClick"],G=["href"],J={class:"w-96 opacity-0 hidden lg:flex"},K={class:"flex-1 max-w-full px-5 py-10 bg-base-100 rounded-md prose prose-neutral prose-a:text-blue-500"},U=e("h1",null,"Random Image",-1),W=k("\u6F14\u793A1"),X=e("p",null,"\u6839\u636E\u7C7B\u578B\u968F\u673A\u751F\u6210\u4E00\u5F20\u56FE\u7247",-1),Y=e("ul",null,[e("li",null,"\u89C4\u5219: https://wcao.cc/image-space/api/{\u7C7B\u578B}"),e("li",null,"\u4E00\u4E2A\u9875\u9762\u4F7F\u7528\u591A\u5F20: \u89C4\u5219\u540E\u9762\u52A0\u4E0A\u53C2\u6570\uFF0C\u4FDD\u8BC1\u94FE\u63A5\u4E0D\u540C\uFF01\uFF01\uFF01")],-1),Z=["id"],ee=e("small",{class:"text-base-300"},"# ",-1),se=["href"],te={class:"grid grid-cols-4 gap-4"},ae={class:"w-48 rounded-md my-0"},oe=e("p",null,"Try",-1);function ne(C,f,c,t,y,r){const a=z,d=L,_=D,i=j("lazy");return n(),B(_,{onChange:t.onChange},{title:u(()=>[$]),default:u(()=>[e("div",q,[e("aside",{class:p([{fixed:t.asideFixed},"top-0 w-96 max-h-screen hidden lg:flex flex-col z-10 "])},[e("section",{class:p(["w-full xl:mr-10 pr-5 my-5",{hidden:!t.asideFixed}])},[e("div",E,[b(a)])],2),e("section",H,[e("ul",M,[P,(n(!0),l(h,null,m(t.types,(s,o)=>(n(),l("li",{class:"text-xl",key:s,onClick:le=>t.curTypes=o},[e("a",{href:"#"+s.name,class:p({active:t.curTypes===o,capitalize:t.curTypes===o})},x(s.name),11,G)],8,Q))),128))])])],2),w(e("aside",J,null,512),[[V,t.asideFixed]]),e("div",K,[U,e("p",null,[b(d,{to:"/tools/image-space/1"},{default:u(()=>[W]),_:1})]),X,Y,(n(!0),l(h,null,m(t.types,s=>(n(),l("article",null,[e("h2",{id:s.name,class:"capitalize flex justify-between"},[e("span",null,[ee,k(x(s.name),1)]),s.link?(n(),l("a",{key:0,href:s.link,target:"_blank",class:"font-normal text-base"}," \u6570\u636E\u6765\u6E90 \u{1F449}\u{1F3FB} ",8,se)):A("",!0)],8,Z),e("div",te,[(n(),l(h,null,m(4,o=>w(e("img",ae,null,512),[[i,{src:`https://wcao.cc/image-space/api/${s.name}?${o}`,loading:"/loading.svg"}]])),64))]),oe,e("pre",null," https://wcao.cc/image-space/api/"+x(s.name)+"?xxx ",1)]))),256))])])]),_:1})}var de=T(R,[["render",ne]]);export{de as default};