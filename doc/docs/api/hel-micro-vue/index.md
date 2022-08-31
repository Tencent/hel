---
sidebar_position: 1
---

# hel-micro-vue

`hel-micro-vue` sdk 是基于 `hel-micro` 封装并适配 `vue` 框架的适配层
- 获取 `Hel Pack` 云hel模块服务或其它云hel模块服务提供的远程vue组件
- 提供组件样式隔离和组件懒加载机制
- 提供`renderApp`接口让用户将整个vue应用弹射给调用者，调用者只需使用 `MicroApp` 实例化应用即可，以便搭建成为
`one vue runtime`的微前端架构

:::caution

正在开发中，如不需要样式隔离特性，直接基于 `hel-micro` 拉取远程vue组件即可

:::

:::tip vue适配层是可选的

如不需要样式隔离特性和懒加载机制，直接基于 `hel-micro` 拉取远程vue组件即可

:::

无需样式隔离和组件懒加载时，使用[preFetchLib](/docs/api/hel-micro/prefetch-lib#基础用法)即可
示例见[git](https://www.to-be-added.com/coming-soon)
