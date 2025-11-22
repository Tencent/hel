---
sidebar_position: 2
---

# mapAndPreload

映射 node 模块和 hel 微模块关系，并预加载 hel 微模块。

## 映射node模块

默认情况下 node 模块和 hel 微模块同名，此时两者是捆绑到一起发布的。

```ts
await mapAndPreload({
  '@hel-demo/mono-libs': true,
});
```

如不同名，需单独填写，需用户自己确保 hel 微模块的实现和 node 模块是保持一致的。

```ts
await mapAndPreload({
  '@hel-demo/mono-libs': 'hel-hello-helpack',
});
// 或写为对象描述
await mapAndPreload({
  '@hel-demo/mono-libs': { helModName: 'hel-hello-helpack' },
});
```

## 指定版本号

指定版本号后，默认情况下 hel 微模块运行版本将固定下来，不接受更新

```ts
await mapAndPreload({
  '@hel-demo/mono-libs': { ver: '1.0.0' },
});
```
