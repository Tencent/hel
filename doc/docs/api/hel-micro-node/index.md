---
sidebar_position: 1
---

# hel-micro-node

`hel-micro-node` 将服务端 npm 模块映射为 hel 微模块，以便支持动态更新功能

本章节里，为方便演示，我们为示例模块`@hel-demo/mono-libs`发布了了3个版本（[1.0.0](https://unpkg.com/@hel-demo/mono-libs@1.0.0/), [1.0.1](https://unpkg.com/@hel-demo/mono-libs@1.0.1/), [1.0.2](https://unpkg.com/@hel-demo/mono-libs@1.0.2/)）。

当模块发布到 npm 时，`unpkg`，`jsdelivr` 等 cdn 服务方会自动将 npm 包同步到 cdn 网络上，[hel元数据](https://app.unpkg.com/@hel-demo/mono-libs@1.0.2/files/hel_dist/hel-meta.json)也会一起同步到 cdn 网络，`hel-micro-node` sdk 根据这份协议动态切换服务端 hel 微模块运行版本，`hel-micro` sdk 根据此协议动态加载浏览器端 hel 微模块运行版本

当然，如果不希望 unpkg 托管我们的hel产物和元数据，也可以把元数据放自己的[后台](https://helmicro.com/openapi/meta/@tencent/mono-bs-lib)，hel微模块[产物](https://tnfe.gtimg.com/hel/@tencent/mono-bs-lib@0.0.3/srv/index.js)放自己的cdn

## 快速开始

### 安装 sdk

`hel-micro-node` 提供 `mapAndPreload` api 把普通的 npm 模块提升为 hel 微模块

```bash
npm i hel-micro-node
```
> 必须是基于 hel 工具链打包的 npm 包才能搭配 `hel-micro-node` 做提升


### 安装示例模块

示例 `@hel-demo/mono-libs` 在未搭配 `hel` 相关sdk 时， 是一个普通的 npm 模块，搭配 `hel` 相关sdk 一起使用后则是一个支持服务、浏览器双端动态更新的hel模块。

```bash
npm i @hel-demo/mono-libs
```

### 正常使用示例模块

向其他 npm 模块一样，正常导入然后使用其方法即可

```ts
import { hello } from '@hel-demo/mono-libs';

function yourFn(){
  return hello();
}
```

### 映射为微模块

映射为微模块后，无需重启服务，可通过内置api或者 helpack 模块管控台来切换模块运行版本

> 必须先映射，在加载你的业务模块才能使动态更新正常生效

- 入口文件

```ts
import { mapAndPreload } from 'hel-micro-node';

async function main(){
  await mapAndPreload({
    '@hel-demo/mono-libs': true
  });
  await import('./yourAppEntry');
}

main().catch(console.error);
```

- 其他文件

```ts
import { hello } from '@hel-demo/mono-libs';

get('/path/hello', ()=>{
  // result 结果将跟随 @hel-demo/mono-libs 版本变化而改变
  const result = hello();
});

```

### 手动更新模块版本

使用 `importNodeMod` 来更新模块运行版本

```ts
import { importNodeMod } from 'hel-micro-node';
import { hello } from '@hel-demo/mono-libs';

get('/path/hello', ()=>{
  const result = hello();
});

get('/update', ()=>{
  importNodeMod('@hel-demo/mono-libs', { ver: '1.0.0' })
});
```

> 此更新方式仅用于本地演示，生产环境node服务通常都是集群部署、多核模式运行的，实际上还需要通知其他worker实例和其他服务器做更新，故建议通过[helpack]模块管控台来做更新，`hel-micro-node` 会和管控台之间建立起长连接，接受来自管控台的模块版本变更信号，进而得到全局所有服务所有实例更新的目的。
