import{_ as g}from"./PostList-b9002f5c.mjs";import{_ as f}from"./BottomAside-c2e69e5f.mjs";import{_ as x,u as v,f as _,g as r,h as c,o as w,c as y,w as S,a as h,d as u}from"./entry-0cd650e5.mjs";import{u as l,a as d}from"./useStrapi4-e2dfb412.mjs";import"./fetch-216ef61d.mjs";import"./swiper-slide-e400200e.mjs";const b={__name:"index",async setup(m,{expose:p}){p();let t,e;v({titleTemplate:`${_().title} - \u4ECA\u5929\u661F\u671F${_().week}`});const{data:o}=([t,e]=r(()=>l("index/1",()=>d().find("posts",{publicationState:"live",populate:["category","headerImages","tags"],sort:["updatedAt:desc"],pagination:{page:1,pageSize:15}}))),t=await t,e(),t),i=c(()=>o.value.data),{data:a}=([t,e]=r(()=>l("tags",()=>d().find("tags",{publicationState:"live",populate:["posts"]}))),t=await t,e(),t),n=c(()=>a.value.data),s={postsRes:o,posts:i,tagsRes:a,tags:n};return Object.defineProperty(s,"__isScriptSetup",{enumerable:!1,value:!0}),s}};function A(m,p,t,e,o,i){const a=g,n=f,s=h;return w(),y(s,null,{default:S(()=>[u(a,{posts:e.posts,"prev-page-prefix":"page/","next-page-prefix":"page/",pagination:e.postsRes.meta.pagination},null,8,["posts","pagination"]),u(n,{tags:e.tags},null,8,["tags"])]),_:1})}var N=x(b,[["render",A]]);export{N as default};