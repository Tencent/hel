---
sidebar_position: 0
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

如不同名可单独填写 hel 模块名称，需用户自己确保 hel 微模块的实现和 node 模块是保持一致的。

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

## 指定平台值

指定平台值后，影响请求元数据的url，默认是 `unpkg`，请求链接形如 `https://unpkg.com/{moduleName}/hel_dist/hel-meta.json`，如指定 `hel`，请求链接形如 `https://helmicro.com/openapi/{moduleName}`，平台值会影响模块下载到本地的目录位置，例如

```ts
await mapAndPreload({ 'hel-hello-helpack': { platform: 'hel' }});

// 模块文件会存储于，目录上会包含平台值
<projRoot>/node_modules/.hel_modules/hel+hel-hello-helpack 目录下
```

## 指定api前缀

默认情况下是从 `unpkg` 平台拉取 hel 模块元数据来加载，请求链接格式形如：

```txt
https://unpkg.com/{moduleName}/hel_dist/hel-meta.json
# or
https://unpkg.com/{moduleName}@{ver}/hel_dist/hel-meta.json
```

例如 [https://unpkg.com/@hel-demo/mono-libs@1.0.0/hel_dist/hel-meta.json](https://unpkg.com/@hel-demo/mono-libs@1.0.0/hel_dist/hel-meta.json)


指定api前缀后，请求链接格式形如：

```txt
https://{apiPrefix}/{moduleName}
# or
https://{apiPrefix}/{moduleName}@{ver}
```

例如 [https://helmicro.com/openapi/meta/@tencent/mono-bs-lib](https://helmicro.com/openapi/meta/@tencent/mono-bs-lib)


可通过设定 `helpackApiUrl` 参数来指定请求元数据的api前缀

```ts
await mapAndPreload({
  '@hel-demo/mono-libs': { helpackApiUrl: 'https://my-helpack.com/my-api' },
});
```

## 指定元数请求函数

可通过指定元数请求函数 `getMeta` 来满足特定场景需求，`getMeta` 指定后 `helpackApiUrl` 将无效。

```ts
await mapAndPreload({
  '@hel-demo/mono-libs': {
    getMeta: async (params) => {
      const { platform, helModName } = params;
      const meta = await requestMyMeta(platform, helModName);
      return meta;
    }
  },
});
```
