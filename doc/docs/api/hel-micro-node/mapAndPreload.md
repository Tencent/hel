---
sidebar_position: 0
---

# mapAndPreload

映射 node 模块和 hel 微模块关系，并预加载 hel 微模块。

## 映射node模块

默认情况下 node 模块和 hel 微模块同名，表示两者是捆绑到一起发布的。

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

未指定任何平台时，默认是 `unpkg`，指定平台值后，会影响默认的请求元数据 url，

- unpkg 平台

`unpkg` 平台请求链接默认格式为 `https://unpkg.com/{moduleName}/hel_dist/hel-meta.json`，

- hel 平台

`hel` 平台请求链接默认格式为 `https://helmicro.com/openapi/{moduleName}`，

同时平台值也会影响模块下载到本地的目录位置，例如

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

## 指定兜底模块

通过配置`fallback` 参数来指定兜底模块

- 预加载失败时，配置模块文件路径`path`参数来加载兜底模块

```ts
await mapAndPreload({
  '@hel-demo/mono-libs': {
    fallback: { path: path.join(__dirname, '../../my-mod/index.js') }
  },
});
```

- 预加载失败时，配置具体的模块实现`mod`参数来作为兜底模块

```ts
await mapAndPreload({
  '@hel-demo/mono-libs': {
    fallback: { mod: { hello: ()=> 'my hello implement!' } }
  },
});
```

> mod 和 path 同时配置时，mod 的优先级高于 path

- 设置 `force` 为 true，跳过获取元数据并加载对应模块的流程，强制使用配置的兜底模块

```ts
await mapAndPreload({
  '@hel-demo/mono-libs': {fallback: { force: true, path: ... }},
});

// or
await mapAndPreload({
  '@hel-demo/mono-libs': {fallback: { force: true, mod: ... }},
});
```

## 配置虚拟模块

在 `setGlobalConfig` 接口设置 `strict`=false 后，即可引入虚拟模块

> 虚拟模块是未安装到`package.json`项目的模块，它在`node_modules`目录下不存在对应的源码实现。

```ts
import { setGlobalConfig,  mapAndPreload} from 'hel-micro-node';

setGlobalConfig({ strict: false }); // 允许虚拟模块存在

await mapAndPreload({ 'my-mod': {fallback: { force: true, mod: ... }}});
// or
await mapAndPreload({ 'my-mod': {fallback: { force: true, path: ... }}});
```

其他文件里可导入 my-mod
```ts
// 其他文件里可导入 my-mod
import { hello } from 'my-mod';
// or cjs 文件
const { hello } = require('my-mod');
```

## 指定分支名称(for helpack)

此功能仅限于请求helpack服务才能使用，设定后只接受指定分支的最新版本代码的更新信号

```ts
await mapAndPreload({
  'hel-hello-pack': { platform:'hel', branch: 'master' },
});
```

## 指定项目id(for helpack)

此功能仅限于请求helpack服务才能使用，设定后只接受指定项目id的最新版本代码的更新信号

```ts
await mapAndPreload({
  'hel-hello-pack': { platform:'hel', projId: 'pid1' },
});
```
