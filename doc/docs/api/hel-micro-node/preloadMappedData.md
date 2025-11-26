---
sidebar_position: 2
---

# preloadMappedData

预加载[mapNodeMods](./mapNodeMods)映射的node 模块背后对应的 hel模块

## 使用方式

此函数是一个异步函数，调用后即可将`mapNodeMods`配置的映射关系背后对应的所有 hel 模块预加载

```ts 
mapNodeMods({/** conf */});
await preloadMappedData();
```

内部做了保护，重复调用并不会让已经在预加载过程中的模块再次执行预加载。

```ts 
mapNodeMods({/** conf */});
await preloadMappedData(); // 有效
await preloadMappedData(); // 无效
```

除非再次映射新的配置，重复调用`preloadMappedData`才会生效

```ts 
mapNodeMods({/** conf */});
await preloadMappedData(); // 有效

mapNodeMods({/** new conf */});
await preloadMappedData(); // 有效
```
