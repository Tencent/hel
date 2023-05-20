"use strict";(self.webpackChunkhel_doc=self.webpackChunkhel_doc||[]).push([[7056],{8570:(e,t,n)=>{n.d(t,{Zo:()=>m,kt:()=>k});var r=n(79);function l(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){l(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function p(e,t){if(null==e)return{};var n,r,l=function(e,t){if(null==e)return{};var n,r,l={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(l[n]=e[n]);return l}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(l[n]=e[n])}return l}var o=r.createContext({}),u=function(e){var t=r.useContext(o),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},m=function(e){var t=u(e.components);return r.createElement(o.Provider,{value:t},e.children)},c="mdxType",s={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,l=e.mdxType,a=e.originalType,o=e.parentName,m=p(e,["components","mdxType","originalType","parentName"]),c=u(n),d=l,k=c["".concat(o,".").concat(d)]||c[d]||s[d]||a;return n?r.createElement(k,i(i({ref:t},m),{},{components:n})):r.createElement(k,i({ref:t},m))}));function k(e,t){var n=arguments,l=t&&t.mdxType;if("string"==typeof e||l){var a=n.length,i=new Array(a);i[0]=d;var p={};for(var o in t)hasOwnProperty.call(t,o)&&(p[o]=t[o]);p.originalType=e,p[c]="string"==typeof e?e:l,i[1]=p;for(var u=2;u<a;u++)i[u]=n[u];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},9306:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>o,contentTitle:()=>i,default:()=>s,frontMatter:()=>a,metadata:()=>p,toc:()=>u});var r=n(5675),l=(n(79),n(8570));const a={sidebar_position:2},i="\u6a21\u5757\u5f00\u53d1-js \u5e93",p={unversionedId:"tutorial/helmod-dev",id:"tutorial/helmod-dev",title:"\u6a21\u5757\u5f00\u53d1-js \u5e93",description:"\u76ee\u6807\uff1a",source:"@site/i18n/en/docusaurus-plugin-content-docs/current/tutorial/helmod-dev.md",sourceDirName:"tutorial",slug:"/tutorial/helmod-dev",permalink:"/hel/en/docs/tutorial/helmod-dev",draft:!1,editUrl:"https://github.com/tnfe/hel/doc/docs/tutorial/helmod-dev.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"tutorial",previous:{title:"\u6a21\u5757\u4f7f\u7528",permalink:"/hel/en/docs/tutorial/intro"},next:{title:"\u6a21\u5757\u5f00\u53d1-react \u7ec4\u4ef6",permalink:"/hel/en/docs/tutorial/helmod-dev-react"}},o={},u=[{value:"\u5f00\u53d1\u8fdc\u7a0b\u5e93",id:"\u5f00\u53d1\u8fdc\u7a0b\u5e93",level:2},{value:"\u514b\u9686\u6a21\u677f\u5e93",id:"\u514b\u9686\u6a21\u677f\u5e93",level:3},{value:"\u6539 package.json",id:"\u6539-packagejson",level:3},{value:"\u6539 subApp",id:"\u6539-subapp",level:3},{value:"\u5f00\u53d1\u4e1a\u52a1\u4ee3\u7801",id:"\u5f00\u53d1\u4e1a\u52a1\u4ee3\u7801",level:3},{value:"\u6267\u884c\u5355\u6d4b",id:"\u6267\u884c\u5355\u6d4b",level:3},{value:"\u53d1\u5e03\u7ec4\u4ef6",id:"\u53d1\u5e03\u7ec4\u4ef6",level:3}],m={toc:u},c="wrapper";function s(e){let{components:t,...n}=e;return(0,l.kt)(c,(0,r.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("h1",{id:"\u6a21\u5757\u5f00\u53d1-js-\u5e93"},"\u6a21\u5757\u5f00\u53d1-js \u5e93"),(0,l.kt)("p",null,"\u76ee\u6807\uff1a"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\u5b66\u4f1a\u57fa\u4e8e\u6a21\u5757\u6a21\u677f\u9879\u76ee\u5feb\u53d1\u5f00\u53d1\u4e00\u4e2a\u65b0\u7684 hel \u6a21\u5757")),(0,l.kt)("p",null,"\u53ef\u4ee5\u88ab\u522b\u7684\u9879\u76ee\u52a8\u6001\u5f15\u7528\uff0c\u4e5f\u53ef\u5e94\u7528\u5176\u4ed6\u52a8\u6001\u6a21\u5757\u4f5c\u4e3a\u81ea\u5df1\u7684\u4f9d\u8d56"),(0,l.kt)("h2",{id:"\u5f00\u53d1\u8fdc\u7a0b\u5e93"},"\u5f00\u53d1\u8fdc\u7a0b\u5e93"),(0,l.kt)("h3",{id:"\u514b\u9686\u6a21\u677f\u5e93"},"\u514b\u9686\u6a21\u677f\u5e93"),(0,l.kt)("p",null,"\u514b\u9686\u8fdc\u7a0b\u5e93\u6a21\u677f\u4e3a",(0,l.kt)("inlineCode",{parentName:"p"},"my-xx-lib"),"\uff08\u540d\u5b57\u8bf7\u6309\u5b9e\u9645\u9700\u8981\u4fee\u6539\uff0c\u6b64\u5904\u4ec5\u505a\u793a\u4f8b\uff09"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"npx degit https://github.com/hel-eco/hel-tpl-remote-lib my-xx-lib\n")),(0,l.kt)("admonition",{title:"npm degit",type:"tip"},(0,l.kt)("p",{parentName:"admonition"},"npm degit \u547d\u4ee4\u662f\u4e3a\u4e86\u68c0\u51fa\u4e00\u4efd\u4e0d\u5305\u542b\u4efb\u4f55 git \u4fe1\u606f\u7684\u76ee\u5f55\uff0c\u7b49\u540c\u4e8e git clone xxx_url && cd xxx_url && rm- rf ./.gitinfo")),(0,l.kt)("h3",{id:"\u6539-packagejson"},"\u6539 package.json"),(0,l.kt)("p",null,"\u5c06",(0,l.kt)("inlineCode",{parentName:"p"},"name"),"\u548c",(0,l.kt)("inlineCode",{parentName:"p"},"appGroupName"),"\u6539\u4e3a\u81ea\u5df1\u60f3\u8981\u8bbe\u5b9a\u7684 hel \u6a21\u5757\u7ec4\u540d"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},'  "name": "my-xx-lib",\n  "appGroupName": "my-xx-lib",\n')),(0,l.kt)("h3",{id:"\u6539-subapp"},"\u6539 subApp"),(0,l.kt)("p",null,(0,l.kt)("inlineCode",{parentName:"p"},"src/configs/subApp.ts"),"\u6539\u4e3a\u4f60 hel \u6a21\u5757\u7ec4\u540d\uff0c\u4ee5\u4fbf\u8ba9\u6784\u5efa\u5143\u6570\u636e\u65f6\u80fd\u591f\u6821\u9a8c\u901a\u8fc7"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"export const LIB_NAME = 'my-xx-lib';\n")),(0,l.kt)("h3",{id:"\u5f00\u53d1\u4e1a\u52a1\u4ee3\u7801"},"\u5f00\u53d1\u4e1a\u52a1\u4ee3\u7801"),(0,l.kt)("p",null,"\u5728",(0,l.kt)("inlineCode",{parentName:"p"},"utils"),"\u76ee\u5f55\u4e0b\u65b0\u589e\u4efb\u610f\u6a21\u5757\uff0c\u6216\u5bfc\u5165\u5df2\u6709\u7684\u7b2c\u4e09\u65b9 npm \u6a21\u5757\uff08\u5373\u662f\u5c06 npm \u6a21\u5757\u63d0\u5347\u4e3a hel \u52a8\u6001\u6a21\u5757\uff09\uff0c\u5e76\u5728",(0,l.kt)("inlineCode",{parentName:"p"},"utils/index.ts"),"\u91cc\u5bfc\u51fa\u5373\u53ef"),(0,l.kt)("h3",{id:"\u6267\u884c\u5355\u6d4b"},"\u6267\u884c\u5355\u6d4b"),(0,l.kt)("p",null,"\u5df2\u5185\u7f6e",(0,l.kt)("inlineCode",{parentName:"p"},"jest"),"\uff0c\u6267\u884c",(0,l.kt)("inlineCode",{parentName:"p"},"npm run test"),"\u5373\u53ef"),(0,l.kt)("h3",{id:"\u53d1\u5e03\u7ec4\u4ef6"},"\u53d1\u5e03\u7ec4\u4ef6"),(0,l.kt)("p",null,"\u5148\u4fee\u6539",(0,l.kt)("inlineCode",{parentName:"p"},"package.json"),"\u91cc\u7684",(0,l.kt)("inlineCode",{parentName:"p"},"version"),"\u503c"),(0,l.kt)("p",null,"\u7136\u540e\u53d1\u5e03\u6e90\u7801\u548c\u6258\u7ba1\u5230",(0,l.kt)("inlineCode",{parentName:"p"},"unpkg"),"\u6587\u4ef6\u670d\u52a1\u7684\u8fd0\u884c\u4ee3\u7801"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"npm run build\nnpm publish\n")),(0,l.kt)("p",null,"\u6216\u53d1\u5e03\u53ef\u4f9b\u6869\u51fd\u6570 mock \u7684\u8fd0\u884c\u4ee3\u7801\u3001\u6e90\u7801\u548c\u6258\u7ba1\u5230",(0,l.kt)("inlineCode",{parentName:"p"},"unpkg"),"\u6587\u4ef6\u670d\u52a1\u7684\u8fd0\u884c\u4ee3\u7801"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"npm run build_stub\nnpm publish\n")),(0,l.kt)("admonition",{type:"tip"},(0,l.kt)("p",{parentName:"admonition"},(0,l.kt)("inlineCode",{parentName:"p"},"build_stub"),"\u662f\u53ef\u9009\u7684\u6267\u884c\u9879\uff0c\u4ec5\u662f\u4e3a\u4e86\u65b9\u4fbf\u6a21\u5757\u4f7f\u7528\u65b9\u7684\u9879\u76ee\u6267\u884c\u5355\u6d4b\u65f6\uff0c",(0,l.kt)("inlineCode",{parentName:"p"},"jest"),"\u53ef\u901a\u8fc7 npm \u7684 cjs \u6a21\u5757\u6765\u505a\u51fd\u6570\u6253\u6869\uff0c",(0,l.kt)("inlineCode",{parentName:"p"},"npm run build")," \u548c ",(0,l.kt)("inlineCode",{parentName:"p"},"npm run build_stub")," \u4e8c\u8005\u6267\u884c\u5176\u4e2d\u4e00\u4e2a\u5373\u53ef"),(0,l.kt)("pre",{parentName:"admonition"},(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"import entry from 'my-xx-lib/hel_bundle/entry';\n\njest.doMock('my-xx-lib', () => {\n  return entry['my-xx-lib'];\n});\n"))),(0,l.kt)("p",null,"\u6709\u5173",(0,l.kt)("inlineCode",{parentName:"p"},"\u5982\u4f55\u53d1\u5e03\u5230\u81ea\u5b9a\u4e49\u7684\u6258\u7ba1\u6587\u4ef6\u670d\u52a1"),"\uff0c\u53ef\u8df3\u8f6c\u5230",(0,l.kt)("a",{parentName:"p",href:"/docs/tutorial/helmod-pub"},"\u6a21\u5757\u53d1\u5e03"),"\u67e5\u9605\u4ee5\u4fbf\u4e86\u89e3\u66f4\u591a\u8be6\u60c5"),(0,l.kt)("p",null,"\u5176\u4f59\u6587\u6863\u6b63\u5728\u62fc\u547d\u5efa\u8bbe\u4e2d\uff0c\u6709\u7591\u95ee\u53ef\u8054\u7cfb ",(0,l.kt)("a",{parentName:"p",href:"https://github.com/fantasticsoul"},"fantasticsoul")," \u6216\u63d0 ",(0,l.kt)("a",{parentName:"p",href:"https://github.com/tnfe/hel/issues"},"issue")," ...."))}s.isMDXComponent=!0}}]);