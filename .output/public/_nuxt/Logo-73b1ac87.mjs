import{_ as p,d,o as r,c as i,s as h,a as o,b as f,e as m,t as l,q as _}from"./entry-88e59fd0.mjs";import{a as v}from"./hooks-19f787ae.mjs";const x=d({__name:"W",props:{size:{default:16},class:null},setup(t,{expose:s}){s();const e={props:t};return Object.defineProperty(e,"__isScriptSetup",{enumerable:!1,value:!0}),e}}),w=["width","height"],z=o("path",{d:"M928 64H672a32 32 0 0 0-32.00000001 32v327l-106.74-94.92000001a32 32 0 0 0-42.51999998 0L383.99999999 423V96a32 32 0 0 0-31.99999999-32H96a32 32 0 0 0-32 32v832a32 32 0 0 0 32 32h91.50000001a127.86000001 127.86000001 0 0 0 83.33999999-30.85l1.05-0.9L512 714.81000001l239.46000001 212.85999999a127.88 127.88 0 0 0 85 32.33H928a32 32 0 0 0 32-32V96a32 32 0 0 0-32-32z m-96 63.99999999h63.99999999v696.74000002l-58.54999999-52a987.37 987.37 0 0 1-222.34000001-286.27000002l163.63 145.45000001A32 32 0 0 0 832 608z m-128 0h64v408.74000002l-64-56.89000001zM187.49999999 896.00000001H127.99999999V127.99999999h64.00000001v764.37000001c0 1.16 0 2.32 0.13 3.45999999-1.54000001 0.11-3.08 0.17-4.62999999 0.17z m303.29000001-248.00000002h-0.04999999L256 856.74000001V127.99999999h64v526.22000002a32 32 0 0 0 53.21 23.99999998h0.05000001l95.99999998-85.35999998q13.88 25.59 29.08 50.27a31.86000001 31.86000001 0 0 0-7.56 4.99999999zM836.50000001 896.00000001a63.92 63.92 0 0 1-42.50000001-16.17000003l-55.75-49.53A987.52000001 987.52000001 0 0 1 510 532.50000001l-2.64-5.27000001a32 32 0 0 0-42.93-14.31 31.46000001 31.46000001 0 0 0-7 4.77000001L383.99999999 583v-74.41l118.04999999-104.93000001L552.00000001 503.53a1051.24 1051.24 0 0 0 242.94 317L879.83000001 896.00000001z","p-id":"3235"},null,-1),k=[z];function b(t,s,n,e,c,a){return r(),i("svg",{t:"1653486614133",class:h(e.props.class),viewBox:"0 0 1024 1024",version:"1.1",xmlns:"http://www.w3.org/2000/svg","p-id":"3234",width:e.props.size,height:e.props.size},k,10,w)}var g=p(x,[["render",b]]);const $=d({__name:"Logo",props:{showWeek:{type:Boolean,default:!0}},setup(t,{expose:s}){s();const n=t,{cao:e,week:c}=v(),a={props:n,cao:e,week:c};return Object.defineProperty(a,"__isScriptSetup",{enumerable:!1,value:!0}),a}}),V={class:"flex items-end"},y={class:"w-12 h-12 rounded-full transition-all flex items-center justify-center"},L={class:"h-12 text-2xl uppercase inline-flex items-center px-2 rounded-full"},C={class:"font-serif font-semibold text-base-100"},B={key:0},S={key:0,class:"inline-flex h-12 items-center text-base-100 text-2xl"},W={class:"text-warning"};function F(t,s,n,e,c,a){const u=g;return r(),i("div",V,[o("div",{class:"flex items-center cursor-pointer logo",onClick:s[0]||(s[0]=H=>t.$router.push("/"))},[o("div",y,[f(u,{size:30,class:"fill-base-100"})]),o("div",L,[o("span",C,[m(l(e.cao)+" ",1),e.props.showWeek?(r(),i("i",B,"\uFF0C")):_("",!0)])])]),e.props.showWeek?(r(),i("div",S,[o("span",W,"\u4ECA\u5929\u661F\u671F"+l(e.week),1)])):_("",!0)])}var A=p($,[["render",F],["__scopeId","data-v-5d362e96"]]);export{A as _};