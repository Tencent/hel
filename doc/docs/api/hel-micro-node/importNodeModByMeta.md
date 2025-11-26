---
sidebar_position: 4
---

# importNodeModByMeta

传入 node 模块名称和 meta 数据，对已映射hel模块的node模块导入新版本模块，如 node 模块未映射，调用将报错

## 指定 meta

传入用户自己获取的meta数据，载入对应的新版本模块

:::caution 需自己保证模块实现无问题

此接口具有一定危险性，需用户自己保证元数据对应的模块实现和对应的node模块是一致的，否则会导致运行报错 `xxx function not defined`

:::

```ts
const myMeta = await fetch('https://helmicro.com/openapi/meta/hel-hello-helpack');
// or
const myMeta = await fetch('https://helmicro.com/openapi/meta/hel-hello-helpack@20251124053957');

await importNodeMod('@hel-demo/mono-libs', myMeta);
```
