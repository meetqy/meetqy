import{_ as u}from"./PostList-95bd278e.mjs";import{_ as d,J as l,w as m,c as f,o as g,b as x,d as _,e as b,j as i,t as y,f as v}from"./entry-c582e40b.mjs";import{u as S,a as h}from"./useStrapi4-1bf67afe.mjs";import"./fetch-532bf91b.mjs";const w={__name:"[pageIndex]",async setup(c,{expose:p}){p();let e,t;const{name:a,pageIndex:o}=l().params,{data:s}=([e,t]=m(()=>S(`tag/${a}`,()=>h().find("posts",{publicationState:"live",sort:["updatedAt:desc"],populate:["tags"],filters:{tags:{name:{$in:a}}},pagination:{page:o,pageSize:15}}))),e=await e,t(),e),n=f(()=>s.value.data),r={name:a,pageIndex:o,postsRes:s,posts:n};return Object.defineProperty(r,"__isScriptSetup",{enumerable:!1,value:!0}),r}},$={class:"w-full flex justify-end pr-10"},j={class:"btn rounded-box border-0 bg-opacity-50 capitalize"};function A(c,p,e,t,a,o){const s=u,n=b;return g(),x(n,{name:"default"},{title:_(()=>[i("div",$,[i("button",j,y(t.name),1)])]),default:_(()=>[v(s,{posts:t.posts,"prev-page-prefix":"tag/","next-page-prefix":"tag/",pagination:t.postsRes.meta.pagination},null,8,["posts","pagination"])]),_:1})}var k=d(w,[["render",A]]);export{k as default};