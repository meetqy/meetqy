import{_ as z}from"./Logo-01fd876a.mjs";import{_ as T,r as g,w as F,c as b,h as N,u as S,Y as j,o,b as B,d as u,e as D,k as e,z as p,f as v,j as l,q as m,F as h,M as w,N as V,m as k,y as L,t as x,p as A}from"./entry-b0a9524b.mjs";import{u as I,a as M}from"./useStrapi4-a3ce42f2.mjs";const R={__name:"index",async setup(C,{expose:f}){f();let c,t;const y=g(0),{data:r}=([c,t]=F(()=>I("tools/random-image",()=>M().find("tools/4"))),c=await c,t(),c),a=b(()=>r.value.data.attributes);N(()=>{S({titleTemplate:`${a.value.title} - ${a.value.description}`,meta:[{name:"description",content:`${a.value.description}`}]})});const d=b(()=>a.value.extend),_=n=>{i.value=n>150},i=g(!1),s={curTypes:y,data:r,post:a,types:d,onChange:_,asideFixed:i};return Object.defineProperty(s,"__isScriptSetup",{enumerable:!1,value:!0}),s}},$=e("div",{class:"w-full flex justify-end pr-10"},[e("button",{class:"btn rounded-box border-0 bg-opacity-50 capitalize"}," Random Image ")],-1),q={class:"main-content flex"},E={class:"p-2 h-min rounded-box"},H={class:"w-full xl:pr-10 pr-4"},O={class:"menu bg-base-100 p-2 w-full rounded-box overflow-y-scroll h-96 scrollbar"},P=e("li",{class:"menu-title py-2"},[e("span",null,"Type")],-1),Y=["onClick"],G=["href"],J={class:"w-96 opacity-0 hidden lg:flex"},K={class:"flex-1 px-5 py-10 bg-base-100 rounded-md prose prose-neutral prose-a:text-blue-500"},Q=e("h1",null,"Random Image",-1),U=k("\u6F14\u793A1"),W=e("p",null,"\u6839\u636E\u7C7B\u578B\u968F\u673A\u751F\u6210\u4E00\u5F20\u56FE\u7247",-1),X=e("ul",null,[e("li",null,"\u89C4\u5219: https://wcao.cc/image-space/api/{\u7C7B\u578B}"),e("li",null,"\u4E00\u4E2A\u9875\u9762\u4F7F\u7528\u591A\u5F20: \u89C4\u5219\u540E\u9762\u52A0\u4E0A\u53C2\u6570\uFF0C\u4FDD\u8BC1\u94FE\u63A5\u4E0D\u540C\uFF01\uFF01\uFF01")],-1),Z=["id"],ee=e("small",{class:"text-base-300"},"# ",-1),se=["href"],te={class:"grid grid-cols-4 gap-4"},ae={class:"w-48 rounded-md my-0"},ne=e("p",null,"Try",-1);function oe(C,f,c,t,y,r){const a=z,d=L,_=D,i=j("lazy");return o(),B(_,{onChange:t.onChange},{title:u(()=>[$]),default:u(()=>[e("main",q,[e("aside",{class:p([{fixed:t.asideFixed},"top-0 w-96 max-h-screen hidden lg:flex flex-col z-10 "])},[e("section",{class:p(["w-full xl:pr-10 pr-5 my-5",{hidden:!t.asideFixed}])},[e("div",E,[v(a)])],2),e("section",H,[e("ul",O,[P,(o(!0),l(h,null,m(t.types,(s,n)=>(o(),l("li",{class:"text-xl",key:s,onClick:le=>t.curTypes=n},[e("a",{href:"#"+s.name,class:p({active:t.curTypes===n,capitalize:t.curTypes===n})},x(s.name),11,G)],8,Y))),128))])])],2),w(e("aside",J,null,512),[[V,t.asideFixed]]),e("div",K,[Q,e("p",null,[v(d,{to:"/tools/image-space/1"},{default:u(()=>[U]),_:1})]),W,X,(o(!0),l(h,null,m(t.types,s=>(o(),l("article",null,[e("h2",{id:s.name,class:"capitalize flex justify-between"},[e("span",null,[ee,k(x(s.name),1)]),s.link?(o(),l("a",{key:0,href:s.link,target:"_blank",class:"font-normal text-base"}," \u6570\u636E\u6765\u6E90 \u{1F449}\u{1F3FB} ",8,se)):A("",!0)],8,Z),e("div",te,[(o(),l(h,null,m(4,n=>w(e("img",ae,null,512),[[i,{src:`https://wcao.cc/image-space/api/${s.name}?${n}`,loading:"/loading.gif"}]])),64))]),ne,e("pre",null," https://wcao.cc/image-space/api/"+x(s.name)+"?xxx ",1)]))),256))])])]),_:1})}var de=T(R,[["render",oe]]);export{de as default};