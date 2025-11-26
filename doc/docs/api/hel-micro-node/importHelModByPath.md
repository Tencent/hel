---
sidebar_position: 12
---

# importHelModByPath

这是一个同步方法，通过模块路径导出 hel 模块，通常用于测试场景

## 简单使用

```ts
importHelModByPath('@hel-demo/mono-libs', '/user/proj/node_modules/my-mode/dist/index.js');
modIns.hello();
```
