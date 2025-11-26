---
sidebar_position: 1
---

# mapNodeMods

映射 node 模块和 hel 微模块关系，入参和[mapAndPreload](./mapAndPreload)一样，此函数是一个同步函数，仅作映射，不会预加载 hel 模块

### 使用方式

多次调用`mapNodeMods`映射不同的 node 模块

```ts
mapNodeMods({
  '@hel-demo/mono-libs': true,
});

mapNodeMods({
  'hel-demo-lib1': true,
});
```

:::caution 不能重复映射

重复映射 node 模块将导致报错

:::


```ts
mapNodeMods({
  '@hel-demo/mono-libs': true,
});

mapNodeMods({
  '@hel-demo/mono-libs': { platform: 'hel' },
});
```
