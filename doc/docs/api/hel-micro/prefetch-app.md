---
sidebar_position: 2
---

# preFetchApp

拉取通过`hel-micro`的`emitApp`接口弹射出去的应用，

:::tip 面向适配层开发者

通常情况下`emitApp`由适配层库调用，例如 `hel-micro-react` 的`renderApp`接口，应用提供者会调用适配层开发者提供的`renderApp`接口渲染整个应用，当应用非本地运行时，`renderApp`不触发渲染逻辑而是调用 `emitApp` 弹射整个根应用出去，这样使用方可通过 ui 对接层 的 `<MicroApp name="xxApp" />` 来实例化整个远程应用，以便达到搭建`one runtime`微前端架构的目的，例如 [hel-react-app](https://www.to-be-added.com/coming-soon)

:::

## 基本用法

通过指定模块名称拉取模块，默认总是拉取最新版本，如当前用户在灰度名单里，则返回灰度版本

```ts
const app = await preFetchApp('sub-app1');
// 可实例化的应用根组件
<app.Comp />;
```

通过指定模块名称、版本号拉取模块

```ts
const app = await preFetchApp('sub-app1', { versionId: 'v1' });
// 可实例化的应用根组件
<app.Comp />;
```

## 完整示例

以下示例用 `hel-micro-react` 演示 `emitApp` 与 `preFetchApp` 的配合，包含应用提供方与应用使用方两端。

### 应用提供方：弹射根组件

应用提供方用 `hel-micro-react` 的 `renderApp` 替换原来的 `ReactDom.render`。应用作为远程模块被加载时，`renderApp` 不渲染，而是内部调用 `emitApp` 把根组件弹射出去；本地独立运行时则直接渲染自身。`appGroupName` 即应用的组名，使用方通过它对应的应用名拉取。

```tsx
// sub-app1/src/index.tsx
import { renderApp } from 'hel-micro-react';
import App from './App';

renderApp({
  App,
  appGroupName: 'sub-app1',
  // 可选，使用方可在 preFetchApp 返回结果的 lifecycle 字段里拿到这两个函数，需自行决定何时调用
  lifecycle: {
    mount: () => console.log('sub-app1 mount'),
    unmount: () => console.log('sub-app1 unmount'),
  },
});
```

### 应用使用方：拉取并实例化

使用方调用 `preFetchApp` 拉取远程应用，返回值里的 `Comp` 就是被弹射出来的根组件，可直接实例化。

```tsx
import { preFetchApp } from 'hel-micro';
import React from 'react';

function Host() {
  const [Comp, setComp] = React.useState<React.ComponentType | null>(null);
  const [errMsg, setErrMsg] = React.useState('');

  React.useEffect(() => {
    preFetchApp('sub-app1', { versionId: 'v1' })
      .then((app) => {
        // 拉取失败时 preFetchApp 不会抛错，而是在控制台打印错误并返回 null
        if (!app) return setErrMsg('sub-app1 load failed');
        setComp(() => app.Comp);
      })
      .catch((err) => setErrMsg(err.message));
  }, []);

  if (errMsg) return <h3>{errMsg}</h3>;
  if (!Comp) return <h3>loading...</h3>;
  return <Comp />;
}
```

返回值的主要字段（类型见 `hel-types` 的 `IEmitAppInfo`）：

| 字段 | 说明 |
| --- | --- |
| `Comp` | 应用提供方弹射的根组件 |
| `appName` / `appGroupName` | 应用名称 / 应用组名 |
| `versionId` | 实际拉取到的版本号 |
| `platform` | 应用所属平台 |
| `lifecycle` | 应用提供方在 `renderApp` 里传入的 `mount` / `unmount`，未传则为空 |

:::tip 提示

如果只是想在 react 项目里渲染远程应用，推荐直接使用 `hel-micro-react` 的 `<MicroApp name="sub-app1" />`，它内部已经调用了 `preFetchApp`，并处理了加载中和出错的展示。

:::

**文档正在拼命建设中，有疑问可联系 fantasticsoul，关注我的[掘金主页](https://juejin.cn/user/1732486056649880/posts)了解更多 ....**
