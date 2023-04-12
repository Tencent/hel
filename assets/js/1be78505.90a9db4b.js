"use strict";(self.webpackChunkhel_doc=self.webpackChunkhel_doc||[]).push([[9514,1600],{1118:(e,t,n)=>{n.r(t),n.d(t,{default:()=>X});var a=n(79),l=n(6826),o=n(1105),c=n(829),r=n(9841),i=n(7318),s=n(5675);function d(e){return a.createElement("svg",(0,s.Z)({width:"20",height:"20","aria-hidden":"true"},e),a.createElement("g",{fill:"#7a7a7a"},a.createElement("path",{d:"M9.992 10.023c0 .2-.062.399-.172.547l-4.996 7.492a.982.982 0 01-.828.454H1c-.55 0-1-.453-1-1 0-.2.059-.403.168-.551l4.629-6.942L.168 3.078A.939.939 0 010 2.528c0-.548.45-.997 1-.997h2.996c.352 0 .649.18.828.45L9.82 9.472c.11.148.172.347.172.55zm0 0"}),a.createElement("path",{d:"M19.98 10.023c0 .2-.058.399-.168.547l-4.996 7.492a.987.987 0 01-.828.454h-3c-.547 0-.996-.453-.996-1 0-.2.059-.403.168-.551l4.625-6.942-4.625-6.945a.939.939 0 01-.168-.55 1 1 0 01.996-.997h3c.348 0 .649.18.828.45l4.996 7.492c.11.148.168.347.168.55zm0 0"})))}var m=n(9055);const u={collapseSidebarButton:"collapseSidebarButton_mqu9",collapseSidebarButtonIcon:"collapseSidebarButtonIcon_gjRq"};function b(e){let{onClick:t}=e;return a.createElement("button",{type:"button",title:(0,m.I)({id:"theme.docs.sidebar.collapseButtonTitle",message:"Collapse sidebar",description:"The title attribute for collapse button of doc sidebar"}),"aria-label":(0,m.I)({id:"theme.docs.sidebar.collapseButtonAriaLabel",message:"Collapse sidebar",description:"The title attribute for collapse button of doc sidebar"}),className:(0,r.Z)("button button--secondary button--outline",u.collapseSidebarButton),onClick:t},a.createElement(d,{className:u.collapseSidebarButtonIcon}))}var p=n(1109),h=n(5786),E=n(2535);const f={menuHtmlItem:"menuHtmlItem_ob8W",menuExternalLink:"menuExternalLink_zkXU"};var k=n(9837);function _(e){let{item:t,...n}=e;switch(t.type){case"category":return a.createElement(g,(0,s.Z)({item:t},n));case"html":return a.createElement(v,(0,s.Z)({item:t},n));default:return a.createElement(S,(0,s.Z)({item:t},n))}}function g(e){let{item:t,onItemClick:n,activePath:l,level:o,index:i,...d}=e;const{items:u,label:b,collapsible:h,className:E,href:f}=t,_=function(e){const t=(0,k.Z)();return(0,a.useMemo)((()=>e.href?e.href:!t&&e.collapsible?(0,c.Wl)(e):void 0),[e,t])}(t),g=(0,c._F)(t,l),v=(0,c.Mg)(f,l),{collapsed:S,setCollapsed:T}=(0,c.uR)({initialState:()=>!!h&&(!g&&t.collapsed)});!function(e){let{isActive:t,collapsed:n,setCollapsed:l}=e;const o=(0,c.D9)(t);(0,a.useEffect)((()=>{t&&!o&&n&&l(!1)}),[t,o,n,l])}({isActive:g,collapsed:S,setCollapsed:T});const{expandedItem:I,setExpandedItem:N}=(0,c.fP)();function Z(e){void 0===e&&(e=!S),N(e?null:i),T(e)}const{autoCollapseSidebarCategories:M}=(0,c.LU)();return(0,a.useEffect)((()=>{h&&I&&I!==i&&M&&T(!0)}),[h,I,i,T,M]),a.createElement("li",{className:(0,r.Z)(c.kM.docs.docSidebarItemCategory,c.kM.docs.docSidebarItemCategoryLevel(o),"menu__list-item",{"menu__list-item--collapsed":S},E)},a.createElement("div",{className:(0,r.Z)("menu__list-item-collapsible",{"menu__list-item-collapsible--active":v})},a.createElement(p.Z,(0,s.Z)({className:(0,r.Z)("menu__link",{"menu__link--sublist":h,"menu__link--sublist-caret":!f,"menu__link--active":g}),onClick:h?e=>{n?.(t),f?Z(!1):(e.preventDefault(),Z())}:()=>{n?.(t)},"aria-current":v?"page":void 0,"aria-expanded":h?!S:void 0,href:h?_??"#":_},d),b),f&&h&&a.createElement("button",{"aria-label":(0,m.I)({id:"theme.DocSidebarItem.toggleCollapsedCategoryAriaLabel",message:"Toggle the collapsible sidebar category '{label}'",description:"The ARIA label to toggle the collapsible sidebar category"},{label:b}),type:"button",className:"clean-btn menu__caret",onClick:e=>{e.preventDefault(),Z()}})),a.createElement(c.zF,{lazy:!0,as:"ul",className:"menu__list",collapsed:S},a.createElement(C,{items:u,tabIndex:S?-1:0,onItemClick:n,activePath:l,level:o+1})))}function v(e){let{item:t,level:n,index:l}=e;const{value:o,defaultStyle:i,className:s}=t;return a.createElement("li",{className:(0,r.Z)(c.kM.docs.docSidebarItemLink,c.kM.docs.docSidebarItemLinkLevel(n),i&&`${f.menuHtmlItem} menu__list-item`,s),key:l,dangerouslySetInnerHTML:{__html:o}})}function S(e){let{item:t,onItemClick:n,activePath:l,level:o,index:i,...d}=e;const{href:m,label:u,className:b}=t,k=(0,c._F)(t,l),_=(0,h.Z)(m);return a.createElement("li",{className:(0,r.Z)(c.kM.docs.docSidebarItemLink,c.kM.docs.docSidebarItemLinkLevel(o),"menu__list-item",b),key:u},a.createElement(p.Z,(0,s.Z)({className:(0,r.Z)("menu__link",!_&&f.menuExternalLink,{"menu__link--active":k}),"aria-current":k?"page":void 0,to:m},_&&{onClick:n?()=>n(t):void 0},d),u,!_&&a.createElement(E.Z,null)))}function T(e){let{items:t,...n}=e;return a.createElement(c.D_,null,t.map(((e,t)=>a.createElement(_,(0,s.Z)({key:t,item:e,index:t},n)))))}const C=(0,a.memo)(T),I={menu:"menu_eJth",menuWithAnnouncementBar:"menuWithAnnouncementBar_eO2z"};function N(e){let{path:t,sidebar:n,className:l}=e;const o=function(){const{isActive:e}=(0,c.nT)(),[t,n]=(0,a.useState)(e);return(0,c.RF)((t=>{let{scrollY:a}=t;e&&n(0===a)}),[e]),e&&t}();return a.createElement("nav",{className:(0,r.Z)("menu thin-scrollbar",I.menu,o&&I.menuWithAnnouncementBar,l)},a.createElement("ul",{className:(0,r.Z)(c.kM.docs.docSidebarMenu,"menu__list")},a.createElement(C,{items:n,activePath:t,level:1})))}const Z="sidebar_nGH5",M="sidebarWithHideableNavbar_Dsv9",B="sidebarHidden_pd9s",x="sidebarLogo_j2Cj";function y(e){let{path:t,sidebar:n,onCollapse:l,isHidden:o}=e;const{navbar:{hideOnScroll:s},hideableSidebar:d}=(0,c.LU)();return a.createElement("div",{className:(0,r.Z)(Z,s&&M,o&&B)},s&&a.createElement(i.Z,{tabIndex:-1,className:x}),a.createElement(N,{path:t,sidebar:n}),d&&a.createElement(b,{onClick:l}))}const L=a.memo(y),A=e=>{let{sidebar:t,path:n}=e;const l=(0,c.el)();return a.createElement("ul",{className:(0,r.Z)(c.kM.docs.docSidebarMenu,"menu__list")},a.createElement(C,{items:t,activePath:n,onItemClick:e=>{"category"===e.type&&e.href&&l.toggle(),"link"===e.type&&l.toggle()},level:1}))};function w(e){return a.createElement(c.Zo,{component:A,props:e})}const F=a.memo(w);function H(e){const t=(0,c.iP)(),n="desktop"===t||"ssr"===t,l="mobile"===t;return a.createElement(a.Fragment,null,n&&a.createElement(L,e),l&&a.createElement(F,e))}var P=n(1600);const R={backToTopButton:"backToTopButton_zKfx",backToTopButtonShow:"backToTopButtonShow_n3WT"},D=300,W=!1;function z(){const e=(0,a.useRef)(null);return{smoothScrollTop:function(){e.current=W?(window.scrollTo({top:0,behavior:"smooth"}),()=>{}):function(){let e=null;return function t(){const n=document.documentElement.scrollTop;n>0&&(e=requestAnimationFrame(t),window.scrollTo(0,Math.floor(.85*n)))}(),()=>e&&cancelAnimationFrame(e)}()},cancelScrollToTop:()=>e.current?.()}}function q(){const[e,t]=(0,a.useState)(!1),n=(0,a.useRef)(!1),{smoothScrollTop:l,cancelScrollToTop:o}=z();return(0,c.RF)(((e,a)=>{let{scrollY:l}=e;const c=a?.scrollY;if(!c)return;if(n.current)return void(n.current=!1);const r=l<c;if(r||o(),l<D)t(!1);else if(r){const e=document.documentElement.scrollHeight;l+window.innerHeight<e&&t(!0)}else t(!1)})),(0,c.SL)((e=>{e.location.hash&&(n.current=!0,t(!1))})),a.createElement("button",{"aria-label":(0,m.I)({id:"theme.BackToTopButton.buttonAriaLabel",message:"Scroll back to top",description:"The ARIA label for the back to top button"}),className:(0,r.Z)("clean-btn",c.kM.common.backToTopButton,R.backToTopButton,e&&R.backToTopButtonShow),type:"button",onClick:()=>l()})}var U=n(7911);const Y={docPage:"docPage_X3lY",docMainContainer:"docMainContainer_kvxd",docSidebarContainer:"docSidebarContainer__mQf",docMainContainerEnhanced:"docMainContainerEnhanced_BuPd",docSidebarContainerHidden:"docSidebarContainerHidden_yRTE",collapsedDocSidebar:"collapsedDocSidebar_uvUl",expandSidebarButtonIcon:"expandSidebarButtonIcon_es7f",docItemWrapperEnhanced:"docItemWrapperEnhanced_zeK4"};var j=n(7835);function K(e){let{currentDocRoute:t,versionMetadata:n,children:l,sidebarName:i}=e;const s=(0,c.Vq)(),{pluginId:u,version:b}=n,[p,h]=(0,a.useState)(!1),[E,f]=(0,a.useState)(!1),k=(0,a.useCallback)((()=>{E&&f(!1),h((e=>!e))}),[E]);return a.createElement(a.Fragment,null,a.createElement(j.Z,{version:b,tag:(0,c.os)(u,b)}),a.createElement(o.Z,null,a.createElement("div",{className:Y.docPage},a.createElement(q,null),s&&a.createElement("aside",{className:(0,r.Z)(c.kM.docs.docSidebarContainer,Y.docSidebarContainer,p&&Y.docSidebarContainerHidden),onTransitionEnd:e=>{e.currentTarget.classList.contains(Y.docSidebarContainer)&&p&&f(!0)}},a.createElement(H,{key:i,sidebar:s,path:t.path,onCollapse:k,isHidden:E}),E&&a.createElement("div",{className:Y.collapsedDocSidebar,title:(0,m.I)({id:"theme.docs.sidebar.expandButtonTitle",message:"Expand sidebar",description:"The ARIA label and title attribute for expand button of doc sidebar"}),"aria-label":(0,m.I)({id:"theme.docs.sidebar.expandButtonAriaLabel",message:"Expand sidebar",description:"The ARIA label and title attribute for expand button of doc sidebar"}),tabIndex:0,role:"button",onKeyDown:k,onClick:k},a.createElement(d,{className:Y.expandSidebarButtonIcon}))),a.createElement("main",{className:(0,r.Z)(Y.docMainContainer,(p||!s)&&Y.docMainContainerEnhanced)},a.createElement("div",{className:(0,r.Z)("container padding-top--md padding-bottom--lg",Y.docItemWrapper,p&&Y.docItemWrapperEnhanced)},l)))))}function X(e){const{route:{routes:t},versionMetadata:n,location:o}=e,i=t.find((e=>(0,U.LX)(o.pathname,e)));if(!i)return a.createElement(P.default,null);const s=i.sidebar,d=s?n.docsSidebars[s]:null;return a.createElement(c.FG,{className:(0,r.Z)(c.kM.wrapper.docsPages,c.kM.page.docsDocPage,n.className)},a.createElement(c.qu,{version:n},a.createElement(c.bT,{sidebar:d??null},a.createElement(K,{currentDocRoute:i,versionMetadata:n,sidebarName:s},(0,l.H)(t,{versionMetadata:n})))))}},1600:(e,t,n)=>{n.r(t),n.d(t,{default:()=>r});var a=n(79),l=n(1105),o=n(9055),c=n(829);function r(){return a.createElement(a.Fragment,null,a.createElement(c.d,{title:(0,o.I)({id:"theme.NotFound.title",message:"Page Not Found"})}),a.createElement(l.Z,null,a.createElement("main",{className:"container margin-vert--xl"},a.createElement("div",{className:"row"},a.createElement("div",{className:"col col--6 col--offset-3"},a.createElement("h1",{className:"hero__title"},a.createElement(o.Z,{id:"theme.NotFound.title",description:"The title of the 404 page"},"Page Not Found")),a.createElement("p",null,a.createElement(o.Z,{id:"theme.NotFound.p1",description:"The first paragraph of the 404 page"},"We could not find what you were looking for.")),a.createElement("p",null,a.createElement(o.Z,{id:"theme.NotFound.p2",description:"The 2nd paragraph of the 404 page"},"Please contact the owner of the site that linked you to the original URL and let them know their link is broken.")))))))}}}]);