---
sidebar_position: 8
---

# getNodeModVer

同步函数，获取映射了 hel 模块的 node 模块的版本号，需要获取更完整的描述信息时可调用 [getNodeModDesc](./getNodeModDesc)

:::caution

如果模块未映射，会报错 Unmapped node module xxx

如果模块未预加载，会报错 Mapped hel module xxx not preloaded

:::

## 简单使用

```ts
// ver may like 1.0.1
const ver = getNodeModVer('@hel-demo/mono-libs');
```
