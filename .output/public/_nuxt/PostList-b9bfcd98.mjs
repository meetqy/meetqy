import{_ as v,g as S,c as b,r as z,h as w,P as j,o,i,j as e,k as h,f as g,l as _,n as B,d as p,m as f,t as d,F as y,p as k,b as E,q as I,s as N,v as V,x as F,y as C,z as x}from"./entry-b3b501d4.mjs";const O=S({__name:"GridItemC",props:{id:null,post:null,tags:null,category:null},setup(a,{expose:n}){n();const t=a,s=b(()=>t.post.light.data),m=b(()=>t.post.dark.data),u=z();w(()=>{u.value&&new j(u.value)});const l={props:t,light:s,dark:m,picScroll:u};return Object.defineProperty(l,"__isScriptSetup",{enumerable:!1,value:!0}),l}}),P=a=>(N("data-v-a730c9f6"),a=a(),V(),a),$={class:"w-full z-40 bg-top px-4 cursor-pointer"},A={class:"max-h-[600px] min-h-[100px] w-full rounded-box relative",ref:"picScroll"},D=["srcset"],L=["srcset"],M={key:0,class:"absolute pt-10 rounded-lg left-0 top-0 z-30 w-full h-full cursor-pointer"},T={class:"tags"},q={class:"w-full flex justify-between absolute left-0 top-0 -z-20"},G=f(" \u67E5\u770B\u8BE6\u60C5 "),U={class:"flex-1"},H={class:"text-base-content text-sm"},J={href:"javascript:;"},K={class:"mr-1"},Q=P(()=>e("i",{class:"iconfont"},"\uE8F4",-1)),R={href:"javascript:;",class:"ml-4"},W={class:"mr-1"},X=P(()=>e("i",{class:"iconfont"},"\uE8B5",-1));function Y(a,n,t,s,m,u){const l=F,c=C;return o(),i("article",{class:"relative flex flex-col justify-center bg-base-200 pt-4 rounded-lg shadow-md",onClick:n[1]||(n[1]=r=>a.$router.push(`/template/detail/pro-${t.id}`))},[e("div",$,[e("div",A,[e("picture",null,[s.dark?(o(),i("source",{key:0,srcset:h(s.dark.attributes.url),media:"(prefers-color-scheme: dark)"},null,8,D)):g("",!0),s.light?(o(),i("source",{key:1,srcset:h(s.light.attributes.url),media:"(prefers-color-scheme: light)"},null,8,L)):g("",!0),_(l,{src:s.light.attributes.url.replace(/\/uploads/,""),format:"webp",sizes:"xl:360px lg:448px md:360 sm:334px 2xl:445px",loading:"lazy",provider:"strapi"},null,8,["src"])])],512)]),t.post.to?g("",!0):(o(),i("div",M,[e("div",T,[e("a",{href:"javascript:;",class:"text-xs",style:B(`color: ${t.category.color};${t.category.bgColor}`)}," \u5B8C\u5584\u4E2D ",4)])])),e("div",q,[_(c,{to:`/template/detail/${t.id}`,class:"cursor-pointer capitalize btn"},{default:p(()=>[G]),_:1},8,["to"]),_(c,{to:`/template/detail/pro-${t.id}`,class:"cursor-pointer capitalize btn"},{default:p(()=>[f(" \u67E5\u770B\u8BE6\u60C5 [pro] "+d(t.post.to),1)]),_:1},8,["to"])]),e("footer",{class:"flex justify-between items-center relative z-50",onClick:n[0]||(n[0]=I(()=>{},["stop"]))},[e("div",U,[(o(!0),i(y,null,k(t.tags,r=>(o(),E(c,{to:`/tag/${r.attributes.name}/1`,class:"badge mr-2",key:r.id},{default:p(()=>[f(d(r.attributes.name),1)]),_:2},1032,["to"]))),128))]),e("div",H,[e("a",J,[e("span",K,d(t.post.visit||1),1),Q]),e("a",R,[e("span",W,d(t.post.comment||1),1),X])])])])}var Z=v(O,[["render",Y],["__scopeId","data-v-a730c9f6"]]);const tt={__name:"PostList",props:{posts:Array,pagination:Object,prevPagePrefix:String,nextPagePrefix:String},setup(a,{expose:n}){n();const s={props:a};return Object.defineProperty(s,"__isScriptSetup",{enumerable:!1,value:!0}),s}},et={key:0,class:"multi-columns"},st={class:"paging md:py-10 py-5"},at=f(" Prev "),ot={class:"px-5 text-neutral-content"},nt=f(" Next ");function rt(a,n,t,s,m,u){const l=Z,c=C;return o(),i("div",null,[s.props.posts?(o(),i("div",et,[(o(!0),i(y,null,k(s.props.posts,r=>(o(),i("div",{class:"block",key:r.id},[_(l,{post:r.attributes,tags:r.attributes.tags.data,category:{name:"\u6A21\u677F",sort:1,templateType:"b",color:"#fff",bgColor:"background: linear-gradient(to right, #5c258d, #4389a2);",path:""},id:r.id+""},null,8,["post","tags","category","id"])]))),128))])):g("",!0),e("div",st,[_(c,{to:`/${t.prevPagePrefix}${t.pagination.page-1}`,class:x(["btn rounded-full btn-sm btn-info capitalize",{"btn-disabled":t.pagination.page<=1}])},{default:p(()=>[at]),_:1},8,["to","class"]),e("span",ot,d(t.pagination.page)+" / "+d(t.pagination.pageCount),1),_(c,{to:`/${t.nextPagePrefix}${t.pagination.page+1}`,class:x(["btn rounded-full btn-sm btn-info capitalize",{"btn-disabled":t.pagination.page>=t.pagination.pageCount}])},{default:p(()=>[nt]),_:1},8,["to","class"])])])}var lt=v(tt,[["render",rt],["__scopeId","data-v-6cc69c0e"]]);export{lt as _};