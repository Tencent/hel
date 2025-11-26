<p align="center">
<img width="820px" src="https://user-images.githubusercontent.com/7334950/186912479-463a6788-41fd-474d-83ed-08314909d70d.png" alt="image.png" />
</p>

## hel-micro-node

服务端js模块动态化加载方案


## 使用方式

先映射模块，再导入你的应用入口文件启动服务。

```ts
import { mapAndPreload } from 'hel-micro-node';

async function start(){
  await mapAndPreload({'@hel-demo/mono-libs': true});
  await import('./yourServerEntry');
}
```

如不映射 `@hel-demo/mono-libs`，则你的服务使用的是原型的 node 模块

```ts
async function start(){
  // await mapAndPreload({'@hel-demo/mono-libs': true});
  await import('./yourServerEntry');
}
```

## 详细说明

配合[管理台](https://github.com/Tencent/hel/tree/main/helpack)可精细化控制版本下发规则，更多使用方式可查看[文档](https://tencent.github.io/hel/docs/api/hel-micro-node/)
