---
sidebar_position: 6
---

# requireNodeMod

同步函数，获取映射了 hel 模块的 node 模块（对齐 require）

:::caution

如果模块未映射，会报错 Unmapped node module xxx

如果模块未预加载，会报错 Mapped hel module xxx not preloaded

:::

## 简单使用

```ts
const mod = requireNodeMod('@hel-demo/mono-libs');
```
