import{_ as $}from"./Logo-562595e5.mjs";import{_ as T,d as S,m as L,o as m,c as d,b as h,a as f,a2 as I,F as j,r as A,w as V,e as F,t as O,x as v,g as B,C as x,G as p,W as E,D as C,a3 as M,a4 as N,U as W,V as k,a5 as z}from"./entry-27d0bed7.mjs";const G=S({__name:"Header",props:{height:null,class:null},setup(r,{expose:t}){t();const{cao:e,week:n}=L(),o={cao:e,week:n,navs:[{name:"\u9996\u9875",url:"/",children:[]}]};return Object.defineProperty(o,"__isScriptSetup",{enumerable:!1,value:!0}),o}}),H={class:"text-base-100 underline"},R={class:"text-base-100 text-lg md:flex hidden"};function U(r,t,e,n,a,o){const s=$,u=B;return m(),d("header",{class:v(["flex justify-between items-center",e.class])},[h(s),f("span",H,[I(r.$slots,"default")]),f("ul",R,[(m(),d(j,null,A(n.navs,i=>f("li",{class:"py-5 pl-12",key:i.name},[h(u,{to:i.url},{default:V(()=>[F(O(i.name),1)]),_:2},1032,["to"])])),64))])],2)}var ue=T(G,[["render",U]]);function g(r){return M()?(N(r),!0):!1}var y;const w=typeof window!="undefined",ie=r=>typeof r=="string",le=()=>{};w&&((y=window==null?void 0:window.navigator)==null?void 0:y.userAgent)&&/iP(ad|hone|od)/.test(window.navigator.userAgent);function P(r,t){function e(...n){r(()=>t.apply(this,n),{fn:t,thisArg:this,args:n})}return e}function q(r,t={}){let e,n;return o=>{const s=p(r),u=p(t.maxWait);if(e&&clearTimeout(e),s<=0||u!==void 0&&u<=0)return n&&(clearTimeout(n),n=null),o();u&&!n&&(n=setTimeout(()=>{e&&clearTimeout(e),n=null,o()},u)),e=setTimeout(()=>{n&&clearTimeout(n),n=null,o()},s)}}function J(r,t=!0,e=!0){let n=0,a,o=!0;const s=()=>{a&&(clearTimeout(a),a=void 0)};return i=>{const l=p(r),c=Date.now()-n;if(s(),l<=0)return n=Date.now(),i();c>l&&(e||!o)?(n=Date.now(),i()):t&&(a=setTimeout(()=>{n=Date.now(),o=!0,s(),i()},l)),!e&&!a&&(a=setTimeout(()=>o=!0,l)),o=!1}}function ce(r,t=200,e={}){return P(q(t,e),r)}function fe(r,t=200,e=!0,n=!0){return P(J(t,e,n),r)}function K(r,t=1e3,e={}){const{immediate:n=!0,immediateCallback:a=!1}=e;let o=null;const s=x(!1);function u(){o&&(clearInterval(o),o=null)}function i(){s.value=!1,u()}function l(){p(t)<=0||(s.value=!0,a&&r(),u(),o=setInterval(r,p(t)))}if(n&&w&&l(),E(t)){const c=C(t,()=>{s.value&&w&&l()});g(c)}return g(i),{isActive:s,pause:i,resume:l}}var Q=Object.defineProperty,D=Object.getOwnPropertySymbols,X=Object.prototype.hasOwnProperty,Y=Object.prototype.propertyIsEnumerable,b=(r,t,e)=>t in r?Q(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e,Z=(r,t)=>{for(var e in t||(t={}))X.call(t,e)&&b(r,e,t[e]);if(D)for(var e of D(t))Y.call(t,e)&&b(r,e,t[e]);return r};function ee(r=1e3,t={}){const{controls:e=!1,immediate:n=!0}=t,a=x(0),o=K(()=>a.value+=1,r,{immediate:n});return e?Z({counter:a},o):a}const te=S({__name:"Footer",props:{class:null,showLogo:{type:Boolean,default:!0}},setup(r,{expose:t}){t();const e=ee(1e3),n=x();C(e,s=>{const u=(Date.now()-z)/1e3;n.value=a(u)});const a=s=>{var u,i=Math.floor(s/86400),l=Math.floor(s%86400/3600),c=Math.floor(s%86400%3600/60),_=Math.floor(s%86400%3600%60);return i>0?u=i+"\u5929"+l+"\u65F6"+c+"\u5206"+_+"\u79D2":l>0?u=l+"\u65F6"+c+"\u5206"+_+"\u79D2":c>0?u=c+"\u5206"+_+"\u79D2":_>0&&(u=_+"\u79D2"),u},o={counter:e,time:n,getDuration:a};return Object.defineProperty(o,"__isScriptSetup",{enumerable:!1,value:!0}),o}}),ne=F(" Copyright \xA9 2022 wcao.cc "),re=f("span",{class:"mx-2 text-base-300"},"|",-1);function oe(r,t,e,n,a,o){const s=$;return m(),d("footer",{class:v(e.class)},[W(h(s,{"show-week":!1},null,512),[[k,e.showLogo]]),f("p",{class:v(["text-base-100 text-opacity-70 text-sm",{"mt-4":e.showLogo}])},[ne,re,f("span",null,"\u8FD0\u884C: "+O(n.time),1)],2)],2)}var _e=T(te,[["render",oe]]);export{ue as _,ie as a,ce as b,_e as c,w as i,le as n,g as t,fe as u};