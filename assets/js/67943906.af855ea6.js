"use strict";(self.webpackChunkhel_doc=self.webpackChunkhel_doc||[]).push([[2405],{8570:(e,t,n)=>{n.d(t,{Zo:()=>s,kt:()=>d});var r=n(79);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var p=r.createContext({}),l=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},s=function(e){var t=l(e.components);return r.createElement(p.Provider,{value:t},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},f=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,p=e.parentName,s=o(e,["components","mdxType","originalType","parentName"]),u=l(n),f=a,d=u["".concat(p,".").concat(f)]||u[f]||m[f]||i;return n?r.createElement(d,c(c({ref:t},s),{},{components:n})):r.createElement(d,c({ref:t},s))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,c=new Array(i);c[0]=f;var o={};for(var p in t)hasOwnProperty.call(t,p)&&(o[p]=t[p]);o.originalType=e,o[u]="string"==typeof e?e:a,c[1]=o;for(var l=2;l<i;l++)c[l]=n[l];return r.createElement.apply(null,c)}return r.createElement.apply(null,n)}f.displayName="MDXCreateElement"},2349:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>c,default:()=>m,frontMatter:()=>i,metadata:()=>o,toc:()=>l});var r=n(5675),a=(n(79),n(8570));const i={sidebar_position:4},c="createInstance",o={unversionedId:"api/hel-micro/create-instance",id:"api/hel-micro/create-instance",title:"createInstance",description:"\u4f7f\u7528createInstance\u53ef\u7528\u4e8e\u6309\u9700\u91cd\u8bbe\u7b26\u5408\u81ea\u5df1\u9700\u6c42\u7684IPreFetchOptionsBase\u53c2\u6570\uff0c\u8be5\u63a5\u53e3\u4f1a\u8fd4\u56de\u7684\u4e00\u4e2a api \u5bf9\u8c61\uff0c\u4f7f\u7528\u8be5\u5bf9\u8c61\u8c03\u7528\u7684\u4efb\u4f55\u65b9\u6cd5\u90fd\u5c06\u4f18\u5148\u4f7f\u7528\u9884\u8bbe\u7684\u53c2\u6570\u503c\u4f5c\u4e3a\u9ed8\u8ba4\u503c\uff0c\u53ef\u57fa\u4e8e\u6b64\u63a5\u53e3\u5b9a\u5236\u81ea\u5df1\u7684hel-micro\u5305\u53d1\u5e03\u5230 npm \u65b9\u4fbf\u5176\u4ed6\u9879\u76ee\u590d\u7528\u3002",source:"@site/docs/api/hel-micro/create-instance.md",sourceDirName:"api/hel-micro",slug:"/api/hel-micro/create-instance",permalink:"/hel/docs/api/hel-micro/create-instance",editUrl:"https://github.com/tnfe/hel/doc/docs/api/hel-micro/create-instance.md",tags:[],version:"current",sidebarPosition:4,frontMatter:{sidebar_position:4},sidebar:"api",previous:{title:"eventBus",permalink:"/hel/docs/api/hel-micro/event-bus"},next:{title:"createOriginInstance",permalink:"/hel/docs/api/hel-micro/create-origin-instance"}},p={},l=[{value:"\u5e38\u89c1\u7528\u6cd5",id:"\u5e38\u89c1\u7528\u6cd5",level:2},{value:"\u8bbe\u5b9a\u81ea\u5df1\u7684\u8bf7\u6c42\u57df\u540d",id:"\u8bbe\u5b9a\u81ea\u5df1\u7684\u8bf7\u6c42\u57df\u540d",level:3},{value:"\u8bbe\u5b9a\u81ea\u5df1\u7684\u8bf7\u6c42\u51fd\u6570",id:"\u8bbe\u5b9a\u81ea\u5df1\u7684\u8bf7\u6c42\u51fd\u6570",level:3}],s={toc:l},u="wrapper";function m(e){let{components:t,...n}=e;return(0,a.kt)(u,(0,r.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"createinstance"},"createInstance"),(0,a.kt)("p",null,"\u4f7f\u7528",(0,a.kt)("inlineCode",{parentName:"p"},"createInstance"),"\u53ef\u7528\u4e8e\u6309\u9700\u91cd\u8bbe\u7b26\u5408\u81ea\u5df1\u9700\u6c42\u7684",(0,a.kt)("a",{parentName:"p",href:"/docs/api/types/IPreFetchOptionsBase"},"IPreFetchOptionsBase"),"\u53c2\u6570\uff0c\u8be5\u63a5\u53e3\u4f1a\u8fd4\u56de\u7684\u4e00\u4e2a api \u5bf9\u8c61\uff0c\u4f7f\u7528\u8be5\u5bf9\u8c61\u8c03\u7528\u7684\u4efb\u4f55\u65b9\u6cd5\u90fd\u5c06\u4f18\u5148\u4f7f\u7528\u9884\u8bbe\u7684\u53c2\u6570\u503c\u4f5c\u4e3a\u9ed8\u8ba4\u503c\uff0c\u53ef\u57fa\u4e8e\u6b64\u63a5\u53e3\u5b9a\u5236\u81ea\u5df1\u7684",(0,a.kt)("inlineCode",{parentName:"p"},"hel-micro"),"\u5305\u53d1\u5e03\u5230 npm \u65b9\u4fbf\u5176\u4ed6\u9879\u76ee\u590d\u7528\u3002"),(0,a.kt)("h2",{id:"\u5e38\u89c1\u7528\u6cd5"},"\u5e38\u89c1\u7528\u6cd5"),(0,a.kt)("h3",{id:"\u8bbe\u5b9a\u81ea\u5df1\u7684\u8bf7\u6c42\u57df\u540d"},"\u8bbe\u5b9a\u81ea\u5df1\u7684\u8bf7\u6c42\u57df\u540d"),(0,a.kt)("p",null,"\u5bf9\u6307\u5b9a\u5e73\u53f0\u8bbe\u5b9a\u81ea\u5df1\u7684\u8bf7\u6c42\u57df\u540d"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { createInstance } from 'hel-micro';\n\nconst ins = helMicro.createOriginInstance('myplat', {\n  getApiPrefix() {\n    return 'https://myhost.com';\n  },\n});\n")),(0,a.kt)("h3",{id:"\u8bbe\u5b9a\u81ea\u5df1\u7684\u8bf7\u6c42\u51fd\u6570"},"\u8bbe\u5b9a\u81ea\u5df1\u7684\u8bf7\u6c42\u51fd\u6570"),(0,a.kt)("p",null,"\u76f8\u6bd4\u8bbe\u5b9a\u8bf7\u6c42\u57df\u540d\uff0c\u8bbe\u5b9a\u8bf7\u6c42\u51fd\u6570\u4f1a\u66f4\u7075\u6d3b"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { createInstance } from 'hel-micro';\n\nconst ins = helMicro.createOriginInstance('myplat', {\n  getSubAppAndItsVersionFn(params) {\n    if (params.appName === 'xxx') {\n      return fetch('xxxMetaUrl');\n    }\n    return params.innerRequest();\n  },\n});\n")),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"\u6587\u6863\u6b63\u5728\u62fc\u547d\u5efa\u8bbe\u4e2d\uff0c\u6709\u7591\u95ee\u53ef\u8054\u7cfb fantasticsoul\uff0c\u5173\u6ce8\u6211\u7684",(0,a.kt)("a",{parentName:"strong",href:"https://juejin.cn/user/1732486056649880/posts"},"\u6398\u91d1\u4e3b\u9875"),"\u4e86\u89e3\u66f4\u591a ....")))}m.isMDXComponent=!0}}]);