---
sidebar_position: 3
---

# importNodeMod

传入 node 模块名称，对已映射hel模块的node模块导入新版本模块，如 node 模块未映射，调用将报错

## 更新至最新版本

不传入任何参数时，尝试拉取最新版本元数据并更新对应的 node 模块，如未更新，返回的 `isUpdated` 降为 `false`

```ts
// 返回模块对象和 isUpdated
const { mod, isUpdated } = await importNodeMod('@hel-demo/mono-libs');

// 如更新成功其他文件里，调用对应的导出函数将执行最新版本的逻辑
import { hello } from '@hel-demo/mono-libs';
```

## 更新至指定版本

传入`ver`将载入指定版本的模块

```ts
await importNodeMod('@hel-demo/mono-libs', { ver: '1.0.1' });
```
