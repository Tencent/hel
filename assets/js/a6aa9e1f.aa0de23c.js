"use strict";(self.webpackChunkhel_doc=self.webpackChunkhel_doc||[]).push([[3089],{4749:(e,t,a)=>{a.d(t,{Z:()=>c});var l=a(79),r=a(9841),n=a(1105),i=a(1109);const s={sidebar:"sidebar_nf6o",sidebarItemTitle:"sidebarItemTitle_Q6Rb",sidebarItemList:"sidebarItemList_OarG",sidebarItem:"sidebarItem_O8Xt",sidebarItemLink:"sidebarItemLink_sWNi",sidebarItemLinkActive:"sidebarItemLinkActive_Si05"};var m=a(9055);function o(e){let{sidebar:t}=e;return 0===t.items.length?null:l.createElement("nav",{className:(0,r.Z)(s.sidebar,"thin-scrollbar"),"aria-label":(0,m.I)({id:"theme.blog.sidebar.navAriaLabel",message:"Blog recent posts navigation",description:"The ARIA label for recent posts in the blog sidebar"})},l.createElement("div",{className:(0,r.Z)(s.sidebarItemTitle,"margin-bottom--md")},t.title),l.createElement("ul",{className:s.sidebarItemList},t.items.map((e=>l.createElement("li",{key:e.permalink,className:s.sidebarItem},l.createElement(i.Z,{isNavLink:!0,to:e.permalink,className:s.sidebarItemLink,activeClassName:s.sidebarItemLinkActive},e.title))))))}function c(e){const{sidebar:t,toc:a,children:i,...s}=e,m=t&&t.items.length>0;return l.createElement(n.Z,s,l.createElement("div",{className:"container margin-vert--lg"},l.createElement("div",{className:"row"},m&&l.createElement("aside",{className:"col col--3"},l.createElement(o,{sidebar:t})),l.createElement("main",{className:(0,r.Z)("col",{"col--7":m,"col--9 col--offset-1":!m}),itemScope:!0,itemType:"http://schema.org/Blog"},i),a&&l.createElement("div",{className:"col col--2"},a))))}},1956:(e,t,a)=>{a.r(t),a.d(t,{default:()=>u});var l=a(79),r=a(4103),n=a(4749),i=a(793),s=a(3185),m=a(829),o=a(7835),c=a(9841);function g(e){const{metadata:t}=e,{siteConfig:{title:a}}=(0,r.Z)(),{blogDescription:n,blogTitle:i,permalink:s}=t,c="/"===s?a:i;return l.createElement(l.Fragment,null,l.createElement(m.d,{title:c,description:n}),l.createElement(o.Z,{tag:"blog_posts_list"}))}function d(e){const{metadata:t,items:a,sidebar:r}=e;return l.createElement(n.Z,{sidebar:r},a.map((e=>{let{content:t}=e;return l.createElement(i.Z,{key:t.metadata.permalink,frontMatter:t.frontMatter,assets:t.assets,metadata:t.metadata,truncated:t.metadata.truncated},l.createElement(t,null))})),l.createElement(s.Z,{metadata:t}))}function u(e){return l.createElement(m.FG,{className:(0,c.Z)(m.kM.wrapper.blogPages,m.kM.page.blogListPage)},l.createElement(g,e),l.createElement(d,e))}},3185:(e,t,a)=>{a.d(t,{Z:()=>i});var l=a(79),r=a(9055),n=a(2902);function i(e){const{metadata:t}=e,{previousPage:a,nextPage:i}=t;return l.createElement("nav",{className:"pagination-nav","aria-label":(0,r.I)({id:"theme.blog.paginator.navAriaLabel",message:"Blog list page navigation",description:"The ARIA label for the blog pagination"})},l.createElement("div",{className:"pagination-nav__item"},a&&l.createElement(n.Z,{permalink:a,title:l.createElement(r.Z,{id:"theme.blog.paginator.newerEntries",description:"The label used to navigate to the newer blog posts page (previous page)"},"Newer Entries")})),l.createElement("div",{className:"pagination-nav__item pagination-nav__item--next"},i&&l.createElement(n.Z,{permalink:i,title:l.createElement(r.Z,{id:"theme.blog.paginator.olderEntries",description:"The label used to navigate to the older blog posts page (next page)"},"Older Entries")})))}},793:(e,t,a)=>{a.d(t,{Z:()=>_});var l=a(79),r=a(9841),n=a(9055),i=a(1109),s=a(5650),m=a(829),o=a(9949),c=a(2405),g=a(5336);const d={blogPostTitle:"blogPostTitle_Xoh6",blogPostData:"blogPostData_NqyA",blogPostDetailsFull:"blogPostDetailsFull_otdC"};var u=a(607);const p={image:"image_d7RT"};function b(e){return e.href?l.createElement(i.Z,e):l.createElement(l.Fragment,null,e.children)}function h(e){let{author:t}=e;const{name:a,title:r,url:n,imageURL:i,email:s}=t,m=n||s&&`mailto:${s}`||void 0;return l.createElement("div",{className:"avatar margin-bottom--sm"},i&&l.createElement("span",{className:"avatar__photo-link avatar__photo"},l.createElement(b,{href:m},l.createElement("img",{className:p.image,src:i,alt:a}))),a&&l.createElement("div",{className:"avatar__intro",itemProp:"author",itemScope:!0,itemType:"https://schema.org/Person"},l.createElement("div",{className:"avatar__name"},l.createElement(b,{href:m,itemProp:"url"},l.createElement("span",{itemProp:"name"},a))),r&&l.createElement("small",{className:"avatar__subtitle",itemProp:"description"},r)))}const E={authorCol:"authorCol_PwwP",imageOnlyAuthorRow:"imageOnlyAuthorRow_vdtn",imageOnlyAuthorCol:"imageOnlyAuthorCol__CPF"};function v(e){let{authors:t,assets:a}=e;if(0===t.length)return null;const n=t.every((e=>{let{name:t}=e;return!t}));return l.createElement("div",{className:(0,r.Z)("margin-top--md margin-bottom--sm",n?E.imageOnlyAuthorRow:"row")},t.map(((e,t)=>l.createElement("div",{className:(0,r.Z)(!n&&"col col--6",n?E.imageOnlyAuthorCol:E.authorCol),key:t},l.createElement(h,{author:{...e,imageURL:a.authorsImageUrls[t]??e.imageURL}})))))}function _(e){const t=function(){const{selectMessage:e}=(0,m.c2)();return t=>{const a=Math.ceil(t);return e(a,(0,n.I)({id:"theme.blog.post.readingTime.plurals",description:'Pluralized label for "{readingTime} min read". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',message:"One min read|{readingTime} min read"},{readingTime:a}))}}(),{withBaseUrl:a}=(0,s.C)(),{children:p,frontMatter:b,assets:h,metadata:E,truncated:_,isBlogPostPage:f=!1}=e,{date:N,formattedDate:Z,permalink:k,tags:P,readingTime:T,title:I,editUrl:w,authors:L}=E,A=h.image??b.image,y=!f&&_,C=P.length>0,R=f?"h1":"h2";return l.createElement("article",{className:f?void 0:"margin-bottom--xl",itemProp:"blogPost",itemScope:!0,itemType:"http://schema.org/BlogPosting"},l.createElement("header",null,l.createElement(R,{className:d.blogPostTitle,itemProp:"headline"},f?I:l.createElement(i.Z,{itemProp:"url",to:k},I)),l.createElement("div",{className:(0,r.Z)(d.blogPostData,"margin-vert--md")},l.createElement("time",{dateTime:N,itemProp:"datePublished"},Z),void 0!==T&&l.createElement(l.Fragment,null," \xb7 ",t(T))),l.createElement(v,{authors:L,assets:h})),A&&l.createElement("meta",{itemProp:"image",content:a(A,{absolute:!0})}),l.createElement("div",{id:f?o.blogPostContainerID:void 0,className:"markdown",itemProp:"articleBody"},l.createElement(c.Z,null,p)),(C||_)&&l.createElement("footer",{className:(0,r.Z)("row docusaurus-mt-lg",f&&d.blogPostDetailsFull)},C&&l.createElement("div",{className:(0,r.Z)("col",{"col--9":y})},l.createElement(u.Z,{tags:P})),f&&w&&l.createElement("div",{className:"col margin-top--sm"},l.createElement(g.Z,{editUrl:w})),y&&l.createElement("div",{className:(0,r.Z)("col text--right",{"col--3":C})},l.createElement(i.Z,{to:E.permalink,"aria-label":(0,n.I)({message:"Read more about {title}",id:"theme.blog.post.readMoreLabel",description:"The ARIA label for the link to full blog posts from excerpts"},{title:I})},l.createElement("b",null,l.createElement(n.Z,{id:"theme.blog.post.readMore",description:"The label used in blog post item excerpts to link to full blog posts"},"Read More"))))))}},5336:(e,t,a)=>{a.d(t,{Z:()=>c});var l=a(79),r=a(9055),n=a(5675),i=a(9841);const s={iconEdit:"iconEdit_x6Y1"};function m(e){let{className:t,...a}=e;return l.createElement("svg",(0,n.Z)({fill:"currentColor",height:"20",width:"20",viewBox:"0 0 40 40",className:(0,i.Z)(s.iconEdit,t),"aria-hidden":"true"},a),l.createElement("g",null,l.createElement("path",{d:"m34.5 11.7l-3 3.1-6.3-6.3 3.1-3q0.5-0.5 1.2-0.5t1.1 0.5l3.9 3.9q0.5 0.4 0.5 1.1t-0.5 1.2z m-29.5 17.1l18.4-18.5 6.3 6.3-18.4 18.4h-6.3v-6.2z"})))}var o=a(829);function c(e){let{editUrl:t}=e;return l.createElement("a",{href:t,target:"_blank",rel:"noreferrer noopener",className:o.kM.common.editThisPage},l.createElement(m,null),l.createElement(r.Z,{id:"theme.common.editThisPage",description:"The link label to edit the current page"},"Edit this page"))}},2902:(e,t,a)=>{a.d(t,{Z:()=>n});var l=a(79),r=a(1109);function n(e){const{permalink:t,title:a,subLabel:n}=e;return l.createElement(r.Z,{className:"pagination-nav__link",to:t},n&&l.createElement("div",{className:"pagination-nav__sublabel"},n),l.createElement("div",{className:"pagination-nav__label"},a))}},3451:(e,t,a)=>{a.d(t,{Z:()=>s});var l=a(79),r=a(9841),n=a(1109);const i={tag:"tag_HAFa",tagRegular:"tagRegular_QNOE",tagWithCount:"tagWithCount_Uo_K"};function s(e){const{permalink:t,name:a,count:s}=e;return l.createElement(n.Z,{href:t,className:(0,r.Z)(i.tag,s?i.tagWithCount:i.tagRegular)},a,s&&l.createElement("span",null,s))}},607:(e,t,a)=>{a.d(t,{Z:()=>m});var l=a(79),r=a(9841),n=a(9055),i=a(3451);const s={tags:"tags_PJ6u",tag:"tag_RczS"};function m(e){let{tags:t}=e;return l.createElement(l.Fragment,null,l.createElement("b",null,l.createElement(n.Z,{id:"theme.tags.tagsListLabel",description:"The label alongside a tag list"},"Tags:")),l.createElement("ul",{className:(0,r.Z)(s.tags,"padding--none","margin-left--sm")},t.map((e=>{let{label:t,permalink:a}=e;return l.createElement("li",{key:a,className:s.tag},l.createElement(i.Z,{name:t,permalink:a}))}))))}}}]);