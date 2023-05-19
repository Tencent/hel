# hel-html-parser

服务于 hel-micro 里为 html entry 解析出 helMetaJson.version.srcMap 的场景，也可以独立使用

> inspred by https://zhuanlan.zhihu.com/p/338772106, fixed self close tag parse bug.

### 使用方式

[线上 demo](https://codesandbox.io/s/hel-micro-html-parser-kfbo42?file=/src/index.js:0-5153)

```ts
import { parseHtml } from 'hel-html-parser';

const html = `<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="//localhost:61536/cwf-hel-vite-vue3-demo-remote/vite.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vite + Vue + TS</title>
  <script type="module" crossorigin src="//localhost:61536/cwf-hel-vite-vue3-demo-remote/assets/index-37a1df94.js"></script>
  <script type="module">import.meta.url;import("_").catch(()=>1);async function* g(){};if(location.protocol!="file:"){window.__vite_is_modern_browser=true}</script>
  <script type="module">!function(){if(window.__vite_is_modern_browser)return;console.warn("vite: loading legacy chunks, syntax error above and the same error below should be ignored");var e=document.getElementById("vite-legacy-polyfill"),n=document.createElement("script");n.src=e.src,n.onload=function(){System.import(document.getElementById('vite-legacy-entry').getAttribute('data-src'))},document.body.appendChild(n)}();</script>
</head>
<body>
  <div id="app"></div>
  <script nomodule>!function(){var e=document,t=e.createElement("script");if(!("noModule"in t)&&"onbeforeload"in t){var n=!1;e.addEventListener("beforeload",(function(e){if(e.target===t)n=!0;else if(!e.target.hasAttribute("nomodule")||!n)return;e.preventDefault()}),!0),t.type="module",t.src=".",e.head.appendChild(t),t.remove()}}();</script>
  <script nomodule crossorigin id="vite-legacy-polyfill" src="//localhost:61536/cwf-hel-vite-vue3-demo-remote/assets/polyfills-legacy-2fc23d6e.js"></script>
  <script nomodule crossorigin id="vite-legacy-entry" data-src="//localhost:61536/cwf-hel-vite-vue3-demo-remote/assets/index-legacy-123a4e31.js">System.import(document.getElementById('vite-legacy-entry').getAttribute('data-src'))</script>
</body>
</html>`;

const start = Date.now();
const nodes = parseHtml(html, {
  onTagOpen(name) {
    console.log('open', name);
  },
  onTagClose(name, data) {
    console.log('close', name, data);
  },
});

const result = JSON.stringify(nodes, 0, 2);
console.log(result);
```
