---
sidebar_position: 3
---

# 在 Vue 宿主中使用远程 React 组件

远程 React 模块可以被 Vue 宿主引用。核心思路是：React 组件仍由 React/ReactDOM 渲染，Vue 侧只负责在组件挂载和卸载时提供一个 DOM 容器，并在入口文件里把 React 运行时绑定给 hel-micro，避免远程模块和宿主各自使用一份 React 运行时。

## 入口文件预加载远程 React 模块

如果远程模块没有把 React 相关依赖打进产物，而是通过 externals 复用宿主运行时，需要先安装并绑定 React 运行时，然后预加载远程模块：

```ts
import Vue from 'vue';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactIs from 'react-is';
import { bindReactRuntime, preFetchLib } from 'hel-micro';

bindReactRuntime({ React, ReactDOM, ReactIs });

async function main() {
  await preFetchLib('hel-tpl-remote-react-comps-ts');
  await import('./loadApp');
}

main().catch(console.error);
```

其中 `hel-tpl-remote-react-comps-ts` 可以替换为实际发布的远程 React 模块名。

## 封装 Vue 适配组件

在 Vue 组件中创建一个容器节点，挂载时导入远程 React 组件并渲染到该节点，卸载前清理 React 根节点：

```vue
<template>
  <div ref="reactRoot" />
</template>

<script>
import React from 'react';
import ReactDOM from 'react-dom';

export default {
  name: 'RemoteReactInVue',
  props: {
    msg: String,
  },
  async mounted() {
    const mod = await import('hel-tpl-remote-react-comps-ts');
    const RemoteReactComp = mod.HelloRemoteReactComp || mod.default.HelloRemoteReactComp;

    ReactDOM.render(
      React.createElement(RemoteReactComp, { msg: this.msg }),
      this.$refs.reactRoot,
    );
  },
  beforeDestroy() {
    ReactDOM.unmountComponentAtNode(this.$refs.reactRoot);
  },
};
</script>
```

Vue 3 项目可以把同样逻辑放在 `onMounted` / `onBeforeUnmount` 中；如果使用 React 18，也可以用 `createRoot` 替代 `ReactDOM.render`。

## 注意事项

- 远程 React 模块需要按正常 React 远程组件方式发布，可参考 [制作远程 antd、tdesign-react](./hel-antd.md) 中的运行时代码导出和代理对象导出方式。
- Vue 宿主只需要调用 `bindReactRuntime`，不需要调用 `bindVueRuntime` 来加载 React 远程模块。
- 如果远程组件依赖样式，仍需按 hel-micro 的样式加载规则处理，确保组件渲染前对应 CSS 已加载。
