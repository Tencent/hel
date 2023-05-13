"use strict";(self.webpackChunkhel_doc=self.webpackChunkhel_doc||[]).push([[622],{8570:(e,t,n)=>{n.d(t,{Zo:()=>s,kt:()=>v});var r=n(79);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),p=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},s=function(e){var t=p(e.components);return r.createElement(l.Provider,{value:t},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,l=e.parentName,s=c(e,["components","mdxType","originalType","parentName"]),u=p(n),d=a,v=u["".concat(l,".").concat(d)]||u[d]||m[d]||i;return n?r.createElement(v,o(o({ref:t},s),{},{components:n})):r.createElement(v,o({ref:t},s))}));function v(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=d;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c[u]="string"==typeof e?e:a,o[1]=c;for(var p=2;p<i;p++)o[p]=n[p];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},4135:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>o,default:()=>m,frontMatter:()=>i,metadata:()=>c,toc:()=>p});var r=n(5675),a=(n(79),n(8570));const i={sidebar_position:3},o="eventBus",c={unversionedId:"api/hel-micro/event-bus",id:"api/hel-micro/event-bus",title:"eventBus",description:"\u4f7f\u7528eventBus\u53ef\u65b9\u4fbf\u7684\u5728\u4e3b\u5e94\u7528\u548c\u5b50\u6a21\u5757\u4e4b\u95f4\u8fdb\u884c\u4e8b\u4ef6\u901a\u4fe1",source:"@site/docs/api/hel-micro/event-bus.md",sourceDirName:"api/hel-micro",slug:"/api/hel-micro/event-bus",permalink:"/hel/docs/api/hel-micro/event-bus",editUrl:"https://github.com/tnfe/hel/doc/docs/api/hel-micro/event-bus.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"api",previous:{title:"preFetchApp",permalink:"/hel/docs/api/hel-micro/prefetch-app"},next:{title:"createInstance",permalink:"/hel/docs/api/hel-micro/create-instance"}},l={},p=[{value:"\u57fa\u7840\u7528\u6cd5",id:"\u57fa\u7840\u7528\u6cd5",level:2},{value:"\u53d1\u5c04\u4e8b\u4ef6",id:"\u53d1\u5c04\u4e8b\u4ef6",level:3},{value:"\u76d1\u542c\u4e8b\u4ef6",id:"\u76d1\u542c\u4e8b\u4ef6",level:3},{value:"\u53d6\u6d88\u76d1\u542c",id:"\u53d6\u6d88\u76d1\u542c",level:3}],s={toc:p},u="wrapper";function m(e){let{components:t,...n}=e;return(0,a.kt)(u,(0,r.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"eventbus"},"eventBus"),(0,a.kt)("p",null,"\u4f7f\u7528",(0,a.kt)("inlineCode",{parentName:"p"},"eventBus"),"\u53ef\u65b9\u4fbf\u7684\u5728\u4e3b\u5e94\u7528\u548c\u5b50\u6a21\u5757\u4e4b\u95f4\u8fdb\u884c\u4e8b\u4ef6\u901a\u4fe1"),(0,a.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,a.kt)("div",{parentName:"div",className:"admonition-heading"},(0,a.kt)("h5",{parentName:"div"},(0,a.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,a.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,a.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"\u4e0d\u540c\u5305\u7684 eventBus \u4e5f\u53ef\u4ee5\u76f8\u4e92\u901a\u4fe1")),(0,a.kt)("div",{parentName:"div",className:"admonition-content"},(0,a.kt)("p",{parentName:"div"},(0,a.kt)("inlineCode",{parentName:"p"},"hel-micro"),"\u5305\u5bfc\u51fa\u7684",(0,a.kt)("inlineCode",{parentName:"p"},"eventBus"),"\u548c",(0,a.kt)("inlineCode",{parentName:"p"},"hel-lib-proxy"),"\u5305\u5bfc\u51fa\u7684",(0,a.kt)("inlineCode",{parentName:"p"},"eventBus"),"\u76f8\u4e92\u95f4\u4e5f\u662f\u53ef\u4ee5\u8fdb\u884c\u4e8b\u4ef6\u901a\u4fe1\u7684"))),(0,a.kt)("h2",{id:"\u57fa\u7840\u7528\u6cd5"},"\u57fa\u7840\u7528\u6cd5"),(0,a.kt)("h3",{id:"\u53d1\u5c04\u4e8b\u4ef6"},"\u53d1\u5c04\u4e8b\u4ef6"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { eventBus } from 'hel-micro';\neventBus.emit('evName', ...args);\n")),(0,a.kt)("h3",{id:"\u76d1\u542c\u4e8b\u4ef6"},"\u76d1\u542c\u4e8b\u4ef6"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"const cb = (...args) => {\n  /** your logic */\n};\neventBus.on('evName', cb);\n")),(0,a.kt)("h3",{id:"\u53d6\u6d88\u76d1\u542c"},"\u53d6\u6d88\u76d1\u542c"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"eventBus.off('evName', cb);\n")),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"\u6587\u6863\u6b63\u5728\u62fc\u547d\u5efa\u8bbe\u4e2d\uff0c\u6709\u7591\u95ee\u53ef\u8054\u7cfb fantasticsoul\uff0c\u5173\u6ce8\u6211\u7684",(0,a.kt)("a",{parentName:"strong",href:"https://juejin.cn/user/1732486056649880/posts"},"\u6398\u91d1\u4e3b\u9875"),"\u4e86\u89e3\u66f4\u591a ....")))}m.isMDXComponent=!0}}]);