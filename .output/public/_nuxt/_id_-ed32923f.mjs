import{_ as l}from"./PostList-cbfb93b5.mjs";import{_ as m,R as g,w as f,c as p,N as b,u as x,o as v,b as h,d as y,e as S,g as n,t as w,f as N}from"./entry-defda3e4.mjs";import{u as R,a as $}from"./useStrapi4-fa875776.mjs";import"./swiper-slide-4af5e790.mjs";const B={__name:"[id]",async setup(u,{expose:r}){r();let a,t;const{params:i}=g(),{id:e}=i,{data:s}=([a,t]=f(()=>R("posts-tag-"+e,()=>$().find("posts",{publicationState:"live",populate:["category","headerImages","tags"],filters:{tags:{id:{$in:[e]}}},pagination:{page:1,pageSize:15}}))),a=await a,t(),a),o=p(()=>s.value.data),_=p(()=>o.value[0].attributes.tags.data.filter(d=>d.id===+e)[0].attributes);b(()=>{x({titleTemplate:`\u6807\u7B7E-${_.value.name}`})});const c={params:i,id:e,postsRes:s,posts:o,tag:_};return Object.defineProperty(c,"__isScriptSetup",{enumerable:!1,value:!0}),c}},j={class:"mt-12 flex justify-center px-32"},k={class:"navbar bg-base-100 rounded-box bg-opacity-20 h-24"},A={class:"btn btn-ghost normal-case text-2xl m-auto"};function C(u,r,a,t,i,e){const s=l,o=S;return v(),h(o,null,{default:y(()=>[n("div",null,[n("div",j,[n("div",k,[n("a",A,w(t.tag.name),1)])]),N(s,{posts:t.posts,pagination:t.postsRes.meta.pagination},null,8,["posts","pagination"])])]),_:1})}var z=m(B,[["render",C]]);export{z as default};