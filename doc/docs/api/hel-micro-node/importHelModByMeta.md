---
sidebar_position: 11
---

# importHelModByMeta

传入 meta 数据，获取 meta 对应的模块


## 简单使用

```ts
const myMeta = await fetch('https://unpkg.com/@hel-demo/mono-libs@1.1.1/hel_dist/hel-meta.json');
const modIns = await importHelModByMeta(myMeta);
modIns.hello();
```
