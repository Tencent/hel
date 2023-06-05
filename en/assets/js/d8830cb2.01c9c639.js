"use strict";(self.webpackChunkhel_doc=self.webpackChunkhel_doc||[]).push([[1147],{8570:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>k});var a=n(79);function p(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){p(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,p=function(e,t){if(null==e)return{};var n,a,p={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(p[n]=e[n]);return p}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(p[n]=e[n])}return p}var o=a.createContext({}),s=function(e){var t=a.useContext(o),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},u=function(e){var t=s(e.components);return a.createElement(o.Provider,{value:t},e.children)},m="mdxType",c={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,p=e.mdxType,r=e.originalType,o=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),m=s(n),d=p,k=m["".concat(o,".").concat(d)]||m[d]||c[d]||r;return n?a.createElement(k,l(l({ref:t},u),{},{components:n})):a.createElement(k,l({ref:t},u))}));function k(e,t){var n=arguments,p=t&&t.mdxType;if("string"==typeof e||p){var r=n.length,l=new Array(r);l[0]=d;var i={};for(var o in t)hasOwnProperty.call(t,o)&&(i[o]=t[o]);i.originalType=e,i[m]="string"==typeof e?e:p,l[1]=i;for(var s=2;s<r;s++)l[s]=n[s];return a.createElement.apply(null,l)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},8201:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>o,contentTitle:()=>l,default:()=>c,frontMatter:()=>r,metadata:()=>i,toc:()=>s});var a=n(5675),p=(n(79),n(8570));const r={sidebar_position:2},l="createLibSubApp",i={unversionedId:"api/hel-dev-utils/create-lib-sub-app",id:"api/hel-dev-utils/create-lib-sub-app",title:"createLibSubApp",description:"\u521b\u5efa\u5b50\u5e94\u7528\u63cf\u8ff0\u5bf9\u8c61\uff0c\u751f\u6210\u7684appInfo\u5bf9\u8c61\u4f1a\u63d0\u4f9b\u7ed9extractHelMetaJson\u63a5\u53e3\u6216\u5176\u4ed6\u573a\u666f\u4f7f\u7528",source:"@site/i18n/en/docusaurus-plugin-content-docs/current/api/hel-dev-utils/create-lib-sub-app.md",sourceDirName:"api/hel-dev-utils",slug:"/api/hel-dev-utils/create-lib-sub-app",permalink:"/hel/en/docs/api/hel-dev-utils/create-lib-sub-app",draft:!1,editUrl:"https://github.com/tnfe/hel/doc/docs/api/hel-dev-utils/create-lib-sub-app.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"api",previous:{title:"extractHelMetaJson",permalink:"/hel/en/docs/api/hel-dev-utils/extract-hel-meta-json"},next:{title:"createReactSubApp",permalink:"/hel/en/docs/api/hel-dev-utils/create-react-sub-app"}},o={},s=[{value:"\u57fa\u7840\u7528\u6cd5",id:"\u57fa\u7840\u7528\u6cd5",level:2},{value:"\u8bbe\u5b9a cdn \u7c7b\u578b",id:"\u8bbe\u5b9a-cdn-\u7c7b\u578b",level:3},{value:"\u8bbe\u5b9a homePage",id:"\u8bbe\u5b9a-homepage",level:3},{value:"\u8bbe\u5b9a externals",id:"\u8bbe\u5b9a-externals",level:3},{value:"\u4e0d\u5904\u7406 homePage",id:"\u4e0d\u5904\u7406-homepage",level:3},{value:"\u63a7\u5236 HelMeta \u7248\u672c\u53f7",id:"\u63a7\u5236-helmeta-\u7248\u672c\u53f7",level:3}],u={toc:s},m="wrapper";function c(e){let{components:t,...n}=e;return(0,p.kt)(m,(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,p.kt)("h1",{id:"createlibsubapp"},"createLibSubApp"),(0,p.kt)("p",null,"\u521b\u5efa\u5b50\u5e94\u7528\u63cf\u8ff0\u5bf9\u8c61\uff0c\u751f\u6210\u7684",(0,p.kt)("inlineCode",{parentName:"p"},"appInfo"),"\u5bf9\u8c61\u4f1a\u63d0\u4f9b\u7ed9",(0,p.kt)("inlineCode",{parentName:"p"},"extractHelMetaJson"),"\u63a5\u53e3\u6216\u5176\u4ed6\u573a\u666f\u4f7f\u7528"),(0,p.kt)("p",null,"\u76ee\u524d\u63d0\u4f9b\u4ee5\u4e0b\u4e09\u4e2a\u5177\u4f53\u7684\u521b\u5efa\u51fd\u6570\u4f9b\u4f7f\u7528"),(0,p.kt)("ul",null,(0,p.kt)("li",{parentName:"ul"},"createLibSubApp")),(0,p.kt)("p",null,"\u521b\u5efa\u65e0\u4efb\u4f55",(0,p.kt)("inlineCode",{parentName:"p"},"externals"),"\u8bbe\u5b9a\u7684\u5e94\u7528"),(0,p.kt)("ul",null,(0,p.kt)("li",{parentName:"ul"},"createReactSubApp")),(0,p.kt)("p",null,"\u521b\u5efa\u9ed8\u8ba4",(0,p.kt)("inlineCode",{parentName:"p"},"externals"),"\u4e3a",(0,p.kt)("inlineCode",{parentName:"p"},"{react:'React', 'react-dom':'ReactDOM', 'react-is':'ReactIs'}")," \u8bbe\u5b9a\u7684 react \u5e94\u7528"),(0,p.kt)("ul",null,(0,p.kt)("li",{parentName:"ul"},"createVueSubApp")),(0,p.kt)("p",null,"\u521b\u5efa\u9ed8\u8ba4",(0,p.kt)("inlineCode",{parentName:"p"},"externals"),"\u4e3a",(0,p.kt)("inlineCode",{parentName:"p"},"{vue:'Vue'}")," \u8bbe\u5b9a\u7684 vue \u5e94\u7528"),(0,p.kt)("admonition",{title:"\u5bf9\u63a5\u5176\u4ed6\u6846\u67b6",type:"tip"},(0,p.kt)("p",{parentName:"admonition"},"\u5bf9\u63a5\u5176\u4ed6\u6846\u67b6(angular, svelte, solid ...)\u7b49\uff0c\u5747\u53ef\u57fa\u4e8e",(0,p.kt)("inlineCode",{parentName:"p"},"createLibSubApp"),"\u900f\u4f20",(0,p.kt)("inlineCode",{parentName:"p"},"externals"),"\u521b\u5efa\u5bf9\u5e94\u7684\u5b50\u5e94\u7528\u63cf\u8ff0\u5bf9\u8c61")),(0,p.kt)("p",null,(0,p.kt)("inlineCode",{parentName:"p"},"appInfo")," \u63cf\u8ff0\u5982\u4e0b"),(0,p.kt)("pre",null,(0,p.kt)("code",{parentName:"pre",className:"language-ts"},"interface ISubAppBuildDesc {\n  platform: string;\n  homePage: string;\n  npmCdnType: string;\n  groupName: string;\n  semverApi: boolean;\n  name: string;\n  externals: Record<string, any>;\n  /** return merged externals */\n  getExternals: (userExternals?: Record<string, any>) => Record<string, any>;\n  jsonpFnName: string;\n  /**\n   * fallbackPathOrUrl default: '/'\n   * ensureEndSlash default: true\n   */\n  getPublicPathOrUrl: (fallbackPathOrUrl: string, ensureEndSlash: boolean) => string;\n  distDir: string;\n}\n")),(0,p.kt)("h2",{id:"\u57fa\u7840\u7528\u6cd5"},"\u57fa\u7840\u7528\u6cd5"),(0,p.kt)("p",null,"\u4ee5\u4e0b\u8bf4\u660e\u5747\u4ee5 ",(0,p.kt)("inlineCode",{parentName:"p"},"createLibSubApp")," \u505a\u793a\u8303\uff0c",(0,p.kt)("inlineCode",{parentName:"p"},"createReactSubApp"),"\uff0c",(0,p.kt)("inlineCode",{parentName:"p"},"createVueSubApp"),"\u4e0e",(0,p.kt)("inlineCode",{parentName:"p"},"createLibSubApp")," \u4f7f\u7528\u65b9\u5f0f\u5b8c\u5168\u4e00\u81f4"),(0,p.kt)("h3",{id:"\u8bbe\u5b9a-cdn-\u7c7b\u578b"},"\u8bbe\u5b9a cdn \u7c7b\u578b"),(0,p.kt)("p",null,(0,p.kt)("strong",{parentName:"p"},"\u53c2\u6570\u540d\u79f0"),"\uff1a",(0,p.kt)("inlineCode",{parentName:"p"},"ICreateSubAppOptions.npmCdnType")," \uff08 \u9ed8\u8ba4\u503c 'unpkg' \uff09"),(0,p.kt)("p",null,"\u8bbe\u5b9a",(0,p.kt)("inlineCode",{parentName:"p"},"npmCdnType"),"\u503c\u6765\u63a7\u5236\u4ea7\u7269\u7684 cdn \u57df\u540d\uff0c\u76ee\u524d\u652f\u6301",(0,p.kt)("inlineCode",{parentName:"p"},"unpkg"),"\u548c",(0,p.kt)("inlineCode",{parentName:"p"},"jsdelivr"),"\u4e24\u79cd\u7c7b\u578b\uff08unpkg: '",(0,p.kt)("a",{parentName:"p",href:"https://unpkg.com',jsdelivr"},"https://unpkg.com',jsdelivr"),": '",(0,p.kt)("a",{parentName:"p",href:"https://cdn.jsdelivr.net/npm'%EF%BC%89"},"https://cdn.jsdelivr.net/npm'\uff09")),(0,p.kt)("pre",null,(0,p.kt)("code",{parentName:"pre",className:"language-ts"},"const helDevUtils = require('hel-dev-utils');\nconst pkg = require('../package.json');\n\nconst appInfo = helDevUtils.createLibSubApp(pkg, { npmCdnType: 'unpkg' });\nmodule.exports = appInfo; // \u66b4\u9732\u5e94\u7528\u63cf\u8ff0\u5bf9\u8c61\n")),(0,p.kt)("h3",{id:"\u8bbe\u5b9a-homepage"},"\u8bbe\u5b9a homePage"),(0,p.kt)("p",null,(0,p.kt)("strong",{parentName:"p"},"\u53c2\u6570\u540d\u79f0"),"\uff1a",(0,p.kt)("inlineCode",{parentName:"p"},"ICreateSubAppOptions.homePage")," \uff08 \u9ed8\u8ba4\u503c undefined \uff09"),(0,p.kt)("p",null,"\u5982\u9700\u8981\u53d1\u5e03\u5230\u81ea\u5df1\u7684 cdn \u5730\u5740\uff0c\u53ef\u8bbe\u5b9a",(0,p.kt)("inlineCode",{parentName:"p"},"homePage"),"\u6765\u66ff\u4ee3 ",(0,p.kt)("inlineCode",{parentName:"p"},"npmCdnType"),"\uff0c\u652f\u6301\u76f8\u5bf9\u8def\u5f84\u5199\u6cd5\uff0c\u8868\u793a\u7531\u4e3b\u7ad9\u70b9\u63d0\u4f9b\u76f8\u5173\u8d44\u6e90"),(0,p.kt)("pre",null,(0,p.kt)("code",{parentName:"pre",className:"language-ts"},"// \u81ea\u5b9a\u4e49 homePage\uff0c\u5f62\u5982\uff1ahttps://youhost.com/aa/bb\u3001 /aa/bb\u3001../aa/bb\nconst appInfo = helDevUtils.createLibSubApp(pkg, { homePage: 'http://127.0.0.1' });\n")),(0,p.kt)("admonition",{title:"homePage \u4f18\u5148\u7ea7\u9ad8\u4e8e npmCdnType",type:"tip"},(0,p.kt)("p",{parentName:"admonition"},"\u5982\u540c\u65f6\u8bbe\u5b9a\u4e86",(0,p.kt)("inlineCode",{parentName:"p"},"npmCdnType"),"\u548c",(0,p.kt)("inlineCode",{parentName:"p"},"homePage"),"\uff0c",(0,p.kt)("inlineCode",{parentName:"p"},"homePage"),"\u7684\u4f18\u5148\u7ea7\u4f1a\u9ad8\u4e8e",(0,p.kt)("inlineCode",{parentName:"p"},"npmCdnType"),"\uff0c\u8bbe\u5b9a",(0,p.kt)("inlineCode",{parentName:"p"},"npmCdnType"),"\u5e76\u4e0d\u4f1a\u5f71\u54cd\u4ea7\u7269\u7684\u90e8\u7f72\u57df\u540d")),(0,p.kt)("h3",{id:"\u8bbe\u5b9a-externals"},"\u8bbe\u5b9a externals"),(0,p.kt)("p",null,(0,p.kt)("strong",{parentName:"p"},"\u53c2\u6570\u540d\u79f0"),"\uff1a",(0,p.kt)("inlineCode",{parentName:"p"},"ICreateSubAppOptions.externals")," \uff08 \u9ed8\u8ba4\u503c undefined \uff09"),(0,p.kt)("p",null,"\u5982\u8be5\u6a21\u5757\u6709\u5176\u4ed6\u516c\u5171\u7684\u8fdc\u7a0b cdn \u4f9d\u8d56\uff0c\u53ef\u8bbe\u5b9a\u6b64\u53c2\u6570"),(0,p.kt)("pre",null,(0,p.kt)("code",{parentName:"pre",className:"language-ts"},"const appInfo = helDevUtils.createLibSubApp(pkg, { externals: { moment: 'moment' } });\n")),(0,p.kt)("h3",{id:"\u4e0d\u5904\u7406-homepage"},"\u4e0d\u5904\u7406 homePage"),(0,p.kt)("p",null,(0,p.kt)("strong",{parentName:"p"},"\u53c2\u6570\u540d\u79f0"),"\uff1a",(0,p.kt)("inlineCode",{parentName:"p"},"ICreateSubAppOptions.handleHomePage")," \uff08 \u9ed8\u8ba4\u503c true \uff09"),(0,p.kt)("p",null,(0,p.kt)("inlineCode",{parentName:"p"},"handleHomePage"),"\u8868\u793a\u6700\u7ec8\u751f\u6210\u7684 homePage \u503c\u662f\u5426\u62fc\u63a5\u4e0a\u6a21\u5757\u540d\u3001\u7248\u672c\u53f7\u3001hel \u5185\u7f6e\u76ee\u5f55\u7b49\u53c2\u6570\uff0c\u5f53 platform \u4e3a unpkg \u4e14\u7528\u6237\u81ea\u5b9a\u4e49\u4e86 homePage \u503c\u65f6\uff0c \u6b64\u53c2\u6570\u624d\u6709\u4f5c\u7528\uff0c\u901a\u5e38\u4f5c\u7528\u4e8e\u79c1\u6709\u90e8\u7f72\u4e14\u9700\u8981\u5b9a\u5236\u81ea\u5df1\u7684\u7248\u672c\u5316\u8bed\u4e49\u8d44\u6e90\u8def\u5f84\u65f6\u53ef\u8c03\u6574\u6b64\u53c2\u6570\u4e3a false"),(0,p.kt)("p",null,"\u4f8b\u5982\u7528\u6237\u8bbe\u5b9a homePage: ",(0,p.kt)("a",{parentName:"p",href:"https://xxx.yyy.com/sub_path"},"https://xxx.yyy.com/sub_path")),(0,p.kt)("ul",null,(0,p.kt)("li",{parentName:"ul"},"handleHomePage \u4e3a true")),(0,p.kt)("p",null,"\u6700\u7ec8\u751f\u6210\u7684 homePage \u5f62\u5982\uff1a",(0,p.kt)("a",{parentName:"p",href:"https://xxx.yyy.com/sub_path/pack-name@1.0.0/hel_dist/"},"https://xxx.yyy.com/sub_path/pack-name@1.0.0/hel_dist/")),(0,p.kt)("ul",null,(0,p.kt)("li",{parentName:"ul"},"handleHomePage \u4e3a false")),(0,p.kt)("p",null,"\u6700\u7ec8\u751f\u6210\u7684 homePage \u5f62\u5982\uff1a",(0,p.kt)("a",{parentName:"p",href:"https://xxx.yyy.com/sub_path/"},"https://xxx.yyy.com/sub_path/")),(0,p.kt)("pre",null,(0,p.kt)("code",{parentName:"pre",className:"language-ts"},"// \u81ea\u5b9a\u4e49 homePage\uff0c\u4e0d\u62fc\u63a5\u540d\u5b57\u548c\u7248\u672c\u53f7\nconst appInfo = helDevUtils.createLibSubApp(pkg, { homePage: './xx', handleHomePage: false });\n")),(0,p.kt)("h3",{id:"\u63a7\u5236-helmeta-\u7248\u672c\u53f7"},"\u63a7\u5236 HelMeta \u7248\u672c\u53f7"),(0,p.kt)("p",null,(0,p.kt)("strong",{parentName:"p"},"\u53c2\u6570\u540d\u79f0"),"\uff1a",(0,p.kt)("inlineCode",{parentName:"p"},"ICreateSubAppOptions.semverApi")," \uff08 \u9ed8\u8ba4\u503c true \uff09"),(0,p.kt)("p",null,"\u662f\u5426\u662f\u8bed\u4e49\u5316 api \u683c\u5f0f\u7684 cdn \u94fe\u63a5\uff0c\u53ef\u7528\u4e8e\u63a7\u5236 HelMeta \u7248\u672c\u53f7\uff0c\u8be5\u503c\u7684\u8bbe\u5b9a\u5f71\u54cd",(0,p.kt)("inlineCode",{parentName:"p"},"extractHelMetaJson"),"\u63a5\u53e3\u751f\u6210\u7684\u5143\u6570\u636e\u7ed3\u679c\u91cc\u7684\u7248\u672c\u53f7"),(0,p.kt)("ul",null,(0,p.kt)("li",{parentName:"ul"},"semverApi \u4e3a true")),(0,p.kt)("p",null,"\u5219\u7248\u672c\u53f7\u4f1a\u4ece ",(0,p.kt)("inlineCode",{parentName:"p"},"package.json")," \u7684 ",(0,p.kt)("inlineCode",{parentName:"p"},"version")," \u83b7\u53d6"),(0,p.kt)("ul",null,(0,p.kt)("li",{parentName:"ul"},"semverApi \u4e3a false")),(0,p.kt)("p",null,"\u5219\u7248\u672c\u53f7\u4f1a\u4ece",(0,p.kt)("inlineCode",{parentName:"p"},"homePage"),"\u503c\u4e0a\u63a8\u5bfc\uff0c\u9ed8\u8ba4\u76f8\u4fe1\u7528\u6237\u7684 ",(0,p.kt)("inlineCode",{parentName:"p"},"homePage")," \u503c\u89c4\u5219\u4e3a\uff1a",(0,p.kt)("inlineCode",{parentName:"p"},"${cdnHost}/${appZone}/${appName}_${dateStr}"),"\uff0c\u63a8\u5bfc\u51fa\u6765\u7684\u7248\u672c\u53f7\u662f",(0,p.kt)("inlineCode",{parentName:"p"},"${appName}_${dateStr}"),"\uff0c\u5f53\u7136\u4e5f\u53ef\u4ee5\u5728\u8c03\u7528 ",(0,p.kt)("inlineCode",{parentName:"p"},"extractHelMetaJson")," \u63a5\u53e3\u65f6\u8bbe\u7f6e",(0,p.kt)("inlineCode",{parentName:"p"},"buildVer"),"\u8df3\u8fc7\u6b64\u63a8\u5bfc"),(0,p.kt)("pre",null,(0,p.kt)("code",{parentName:"pre",className:"language-ts"},"const appInfo = helDevUtils.createLibSubApp(pkg, { semverApi: false });\n")),(0,p.kt)("p",null,(0,p.kt)("strong",{parentName:"p"},"\u6587\u6863\u6b63\u5728\u62fc\u547d\u5efa\u8bbe\u4e2d\uff0c\u6709\u7591\u95ee\u53ef\u8054\u7cfb fantasticsoul\uff0c\u5173\u6ce8\u6211\u7684",(0,p.kt)("a",{parentName:"strong",href:"https://juejin.cn/user/1732486056649880/posts"},"\u6398\u91d1\u4e3b\u9875"),"\u4e86\u89e3\u66f4\u591a ....")))}c.isMDXComponent=!0}}]);