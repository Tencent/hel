---
sidebar_position: 5
---

# importNodeModByPath

此接口时一个同步接口，传入 node 模块名称和欲替换的目标模块路径，对已映射hel模块的node模块将导入路径对应的模块，如 node 模块未映射，调用将报错

## 指定目标模块路径

传入用户指定的模块路径，载入对应的新版本模块

:::caution 需自己保证模块实现无问题

此接口具有一定危险性，需用户自己保证路径对应的模块实现和对应的node模块是一致的，否则会导致运行报错 `xxx function not defined`

:::

```ts
importNodeModByPath('@hel-demo/mono-libs', path.join(__dirname, '../../my-custom-mod'));
```
