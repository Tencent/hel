"use strict";(self.webpackChunkhel_doc=self.webpackChunkhel_doc||[]).push([[4534],{8570:(e,t,n)=>{n.d(t,{Zo:()=>m,kt:()=>h});var r=n(79);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function p(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var i=r.createContext({}),s=function(e){var t=r.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},m=function(e){var t=s(e.components);return r.createElement(i.Provider,{value:t},e.children)},u="mdxType",c={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,i=e.parentName,m=p(e,["components","mdxType","originalType","parentName"]),u=s(n),d=a,h=u["".concat(i,".").concat(d)]||u[d]||c[d]||o;return n?r.createElement(h,l(l({ref:t},m),{},{components:n})):r.createElement(h,l({ref:t},m))}));function h(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,l=new Array(o);l[0]=d;var p={};for(var i in t)hasOwnProperty.call(t,i)&&(p[i]=t[i]);p.originalType=e,p[u]="string"==typeof e?e:a,l[1]=p;for(var s=2;s<o;s++)l[s]=n[s];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},4806:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>i,contentTitle:()=>l,default:()=>c,frontMatter:()=>o,metadata:()=>p,toc:()=>s});var r=n(5675),a=(n(79),n(8570));const o={sidebar_position:2},l="useRemoteComp",p={unversionedId:"api/hel-micro-react/useRemoteComp",id:"api/hel-micro-react/useRemoteComp",title:"useRemoteComp",description:"\u901a\u8fc7 useRemoteComp \u83b7\u53d6\u6307\u5b9a\u540d\u5b57\u7684\u8fdc\u7a0b\u6a21\u5757\u66b4\u9732\u7684\u7ec4\u4ef6",source:"@site/docs/api/hel-micro-react/useRemoteComp.md",sourceDirName:"api/hel-micro-react",slug:"/api/hel-micro-react/useRemoteComp",permalink:"/hel/docs/api/hel-micro-react/useRemoteComp",editUrl:"https://github.com/tnfe/hel/doc/docs/api/hel-micro-react/useRemoteComp.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"api",previous:{title:"hel-micro-react",permalink:"/hel/docs/api/hel-micro-react/"},next:{title:"hel-micro-vue",permalink:"/hel/docs/api/hel-micro-vue/"}},i={},s=[{value:"\u57fa\u672c\u7528\u6cd5",id:"\u57fa\u672c\u7528\u6cd5",level:2},{value:"\u6307\u5b9a\u7248\u672c\u53f7",id:"\u6307\u5b9a\u7248\u672c\u53f7",level:2},{value:"IUseRemoteCompOptions",id:"iuseremotecompoptions",level:2}],m={toc:s},u="wrapper";function c(e){let{components:t,...n}=e;return(0,a.kt)(u,(0,r.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"useremotecomp"},"useRemoteComp"),(0,a.kt)("p",null,"\u901a\u8fc7 ",(0,a.kt)("inlineCode",{parentName:"p"},"useRemoteComp")," \u83b7\u53d6\u6307\u5b9a\u540d\u5b57\u7684\u8fdc\u7a0b\u6a21\u5757\u66b4\u9732\u7684\u7ec4\u4ef6"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"function useRemoteComp<T extends any = React.ForwardRefExoticComponent<any>>(\n  name: string,\n  compName: string,\n  options?: IUseRemoteCompOptions,\n): T;\n")),(0,a.kt)("h2",{id:"\u57fa\u672c\u7528\u6cd5"},"\u57fa\u672c\u7528\u6cd5"),(0,a.kt)("p",null,"\u83b7\u53d6\u8fdc\u7a0b\u7ec4\u4ef6\uff0c\u5982\u679c\u5f53\u524d\u7528\u6237\u672a\u5728\u7070\u5ea6\u540d\u5355\u91cc\uff0c\u5219\u8fd4\u56de\u6700\u65b0\u7248\u672c\u6a21\u5757\u66b4\u9732\u7684\u7ec4\u4ef6\uff0c\u53cd\u4e4b\u5219\u8fd4\u56de\u7070\u5ea6\u7248\u672c\u6a21\u5757\u66b4\u9732\u7684\u7ec4\u4ef6"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-jsx"},"const Comp = useRemoteComp('remote-tdesign-react', 'Button');\nreturn <Comp ref={someRef} label=\"any props you want\" />;\n")),(0,a.kt)("h2",{id:"\u6307\u5b9a\u7248\u672c\u53f7"},"\u6307\u5b9a\u7248\u672c\u53f7"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"useRemoteComp('remote-tdesign-react', 'Button', {\n  versionId: 'remote-tdesign-react_20220611094219',\n});\n")),(0,a.kt)("h2",{id:"iuseremotecompoptions"},"IUseRemoteCompOptions"),(0,a.kt)("table",null,(0,a.kt)("thead",{parentName:"table"},(0,a.kt)("tr",{parentName:"thead"},(0,a.kt)("th",{parentName:"tr",align:null},(0,a.kt)("div",{style:{width:"150px"}},"\u5c5e\u6027")),(0,a.kt)("th",{parentName:"tr",align:null},(0,a.kt)("div",{style:{width:"150px"}},"\u7c7b\u578b")),(0,a.kt)("th",{parentName:"tr",align:null},(0,a.kt)("div",{style:{width:"200px"}},"\u9ed8\u8ba4\u503c")),(0,a.kt)("th",{parentName:"tr",align:null},(0,a.kt)("div",{style:{width:"355px"}},"\u63cf\u8ff0")))),(0,a.kt)("tbody",{parentName:"table"},(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"shadow"),(0,a.kt)("td",{parentName:"tr",align:null},"boolean"),(0,a.kt)("td",{parentName:"tr",align:null},"true"),(0,a.kt)("td",{parentName:"tr",align:null},"\u662f\u5426\u4f7f\u7528\u91c7\u6837 shaw-dom \u6a21\u5f0f\u6e32\u67d3")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"appendCss"),(0,a.kt)("td",{parentName:"tr",align:null},"boolean"),(0,a.kt)("td",{parentName:"tr",align:null},"\u672a\u663e\u5f0f\u8bbe\u7f6e appendCss \u65f6\uff0c\u5b83\u7684\u9ed8\u8ba4\u53d7\u8bbe\u7f6e shadow \u5f71\u54cd",(0,a.kt)("br",null)," false ","[when shadow true]"," ",(0,a.kt)("br",null),"true ","[when shadow false]"),(0,a.kt)("td",{parentName:"tr",align:null},"\u662f\u5426\u5411 document \u6216 shadow-root \u4e0a\u9644\u52a0\u6837\u5f0f\u5916\u8054\u6837\u5f0f\u6807\u7b7e")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"getStyleStr"),(0,a.kt)("td",{parentName:"tr",align:null},"(styleStr: string) => string"),(0,a.kt)("td",{parentName:"tr",align:null},"undefined"),(0,a.kt)("td",{parentName:"tr",align:null},"\u66ff\u6362\u6216\u6539\u9020\u9ed8\u8ba4\u89e3\u6790\u51fa\u6765\u7684\u5b57\u7b26\u4e32")))),(0,a.kt)("p",null,"\u6587\u6863\u6b63\u5728\u62fc\u547d\u5efa\u8bbe\u4e2d\uff0c\u6709\u7591\u95ee\u53ef\u8054\u7cfb ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/fantasticsoul"},"fantasticsoul")," \u6216\u63d0 ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/tnfe/hel/issues"},"issue"),"\uff0c\u5173\u6ce8\u6211\u7684",(0,a.kt)("a",{parentName:"p",href:"https://juejin.cn/user/1732486056649880/posts"},"\u6398\u91d1\u4e3b\u9875"),"\u4e86\u89e3\u66f4\u591a ....** ...."))}c.isMDXComponent=!0}}]);