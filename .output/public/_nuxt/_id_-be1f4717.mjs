import{_ as N}from"./Logo-5f9179f7.mjs";import{V as z,_ as B,r as M,U as A,g as D,h as m,j as V,Q as E,u as U,o as r,c as k,w as h,a as q,b as e,z as f,d as S,k as v,x as j,F as I,W as J,X as O,t as d,p as P,m as Q}from"./entry-b77ad367.mjs";import{u as R,a as W}from"./useStrapi4-f295eb9c.mjs";import{N as C,S as X,a as G}from"./swiper-slide-692f1dc1.mjs";import{H as g}from"./index-ed8b9815.mjs";var T=z;const K={__name:"[id]",async setup(a,{expose:w}){w();let l,s;const x=_=>{p.value=_>150},p=M(!1),i=new T({highlight:function(_,u){if(u&&g.getLanguage(u))try{return'<pre class="hljs"><code>'+g.highlight(_,{language:u,ignoreIllegals:!0}).value+"</code></pre>"}catch{}return'<pre class="hljs"><code>'+i.utils.escapeHtml(_)+"</code></pre>"}}),{id:c}=A().params,{data:o}=([l,s]=D(()=>R(`posts/${c}`,()=>W().find(`posts/${c}`,{publicationState:"live",populate:["category","tags","previewImages"]}))),l=await l,s(),l),t=m(()=>o.value.data.attributes),y=m(()=>t.value.previewImages.data),L=m(()=>i.render(t.value.content)),F=[C],H=V();E(()=>{U({titleTemplate:`${t.value.title} - ${t.value.desciption}`,meta:[{name:"description",content:`${t.value.desciption}`}]})});const b={onChange:x,asideFixed:p,md:i,id:c,data:o,post:t,previewImages:y,content:L,modules:F,$cdn:H,Navigation:C,Swiper:X,SwiperSlide:G,MarkdownIt:T,hljs:g};return Object.defineProperty(b,"__isScriptSetup",{enumerable:!1,value:!0}),b}},n=a=>(P("data-v-9706bfc2"),a=a(),Q(),a),Y={class:"main-content flex"},Z={class:"p-2 h-min rounded-box"},$={class:"w-full lg:pr-10"},ee={class:"menu bg-base-100 p-2 w-full h-min rounded-box"},se=n(()=>e("li",{class:"menu-title py-2"},[e("span",null,"Type")],-1)),te=["onClick"],ae=["href"],oe={class:"w-96 opacity-0 hidden lg:flex"},ne={class:"flex-1 relative overflow-hidden p-5 bg-base-100 rounded-md"},le=["src"],ie={class:"flex items-center mt-6 flex-wrap mb-10"},ce=n(()=>e("a",{href:"javascript:;",class:"flex items-center justify-center"},[e("img",{class:"w-8 h-8 rounded-full relative -top-0.5",style:{"box-shadow":"2px 2px 5px 1px rgb(0 0 0 / 20%)"},src:"/avatar.jpg"}),e("span",{class:"ml-3"}," meetqy ")],-1)),re={href:"javascript:;",class:"ml-6"},de=n(()=>e("i",{class:"iconfont",style:{color:"#e84e89"}},"\uE8B4",-1)),_e={class:"ml-2"},pe={href:"javascript:;",class:"ml-6"},ue=n(()=>e("i",{class:"iconfont",style:{color:"#e84e89"}},"\uE8F4",-1)),me={class:"ml-2"},he={href:"javascript:;",class:"ml-6"},fe=n(()=>e("i",{class:"iconfont",style:{color:"#e84e89"}},"\uE8B5",-1)),ve={class:"ml-2"},ge=["innerHTML"],we=n(()=>e("div",{class:"divider"},"End",-1)),xe={class:"py-12 flex justify-center items-center flex-wrap"},ye=n(()=>e("span",{class:"text-lg font-semibold mr-4"},"Link:",-1)),be=["href"];function ke(a,w,l,s,x,p){const i=N,c=q;return r(),k(c,{onChange:s.onChange},{default:h(()=>[e("main",Y,[e("aside",{class:f([{fixed:s.asideFixed},"top-0 w-96 max-h-screen hidden lg:flex flex-col z-10 flex-shrink-0"])},[e("section",{class:f(["w-full lg:pr-10 my-5",{hidden:!s.asideFixed}])},[e("div",Z,[S(i)])],2),e("section",$,[e("ul",ee,[se,(r(!0),v(I,null,j(a.types,(o,t)=>(r(),v("li",{class:"text-xl",key:o,onClick:y=>a.curTypes=t},[e("a",{href:"#"+o.name,class:f({active:a.curTypes===t,capitalize:a.curTypes===t})},d(o.name),11,ae)],8,te))),128))])])],2),J(e("aside",oe,null,512),[[O,s.asideFixed]]),e("div",ne,[S(s.Swiper,{class:"swiper w-full rounded-2xl",modules:s.modules,navigation:!0},{default:h(()=>[(r(!0),v(I,null,j(s.previewImages,o=>(r(),k(s.SwiperSlide,{class:"flex justify-center items-center",key:o.id},{default:h(()=>[e("img",{class:"rounded-2xl xl:w-1/5 md:w-1/3 w-1/2",src:s.$cdn+o.attributes.url},null,8,le)]),_:2},1024))),128))]),_:1}),e("div",ie,[ce,e("a",re,[de,e("span",_e,d(s.post.updatedAt.split("T")[0]),1)]),e("a",pe,[ue,e("span",me,d(s.post.visit),1)]),e("a",he,[fe,e("span",ve,d(s.post.comment),1)])]),e("article",{class:"prose prose-neutral prose-a:text-blue-500 break-words mb-20",innerHTML:s.content},null,8,ge),we,e("div",xe,[ye,e("a",{href:s.post.link,class:"underline text-blue-500 break-words inline-block w-full text-center md:w-auto"},d(s.post.link),9,be)])])])]),_:1})}var Fe=B(K,[["render",ke],["__scopeId","data-v-9706bfc2"]]);export{Fe as default};