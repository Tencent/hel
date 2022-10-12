<p align="center">
<img width="620px" alt="hel-logo"  src="https://user-images.githubusercontent.com/7334950/186912479-463a6788-41fd-474d-83ed-08314909d70d.png" />
</p>

## [Doc](https://tnfe.github.io/hel)

**hel-micro**, 模块联邦 sdk 化，免构建、热更新、工具链无关的微模块方案

see doc： https://tnfe.github.io/hel

## 文章

1. [hel-micro 模块联邦新革命](https://juejin.cn/post/7138792768234586148)

2. [使用 hel-micro 制作远程 antd、tdesign-react](https://juejin.cn/post/7150639599499509797)

## 视频

1. [本地调试简介](https://www.bilibili.com/video/BV1pt4y1J7g9/?vd_source=51bc50bf5f860e0d778c49b00d192cee)

## Demo


| 示例名称/功能 | 使用示范 | 模板地址| 模板描述 | 托管位置 |
| --- | --- | --- | --- | --- |
| 远程ts库 | [codesandbox](https://codesandbox.io/s/hel-lodash-zf8jh8) | [hel-lodash](https://github.com/hel-eco/hel-tpl-remote-lib) | webpack开发与打包 | [unpkg meta](https://unpkg.com/hel-lodash) |
| 远程 react js 组件 | [codesandbox](https://codesandbox.io/s/demo-load-remote-react-comp-2bnpl0) |[remote-react-comp](https://github.com/hel-eco/hel-tpl-remote-react-comp) | webpack开发与打包 | [unpkg meta](https://unpkg.com/hel-tpl-remote-react-comps) |
| 远程 react ts 组件 | [codesandbox](https://codesandbox.io/s/demo-load-remote-react-comp-2bnpl0) | [remote-react-comp-ts](https://github.com/hel-eco/hel-tpl-remote-react-comp-ts) | webpack开发与打包 | [unpkg meta](hhttps://unpkg.com/hel-tpl-remote-react-comps-ts) |
| 远程 vue2 js 组件 | [codesandbox](https://codesandbox.io/s/demo-load-remote-vue-comp-st0295) | [remote-vue-comp](https://github.com/hel-eco/hel-tpl-remote-vue-comp) | webpack开发与打包 | [unpkg meta](https://unpkg.com/hel-tpl-remote-vue-comps)、[github.io index.html](https://hel-eco.github.io/hel-tpl-remote-vue-comp/index.html) 、[unpkg index.html](https://unpkg.com/hel-tpl-remote-vue-comps@1.1.3/hel_dist/index.html) |
| 远程 vue3 ts 组件 | [codesandbox](https://codesandbox.io/s/demo-load-remote-vue3-comp-2fd34s?file=/src/main.js) | [remote-vue3-comps-ts](https://github.com/hel-eco/hel-tpl-remote-vue3-comps-ts) | vite 或 webpack开发，webpack打包 | [unpkg meta](https://unpkg.com/hel-tpl-remote-vue3-comps-ts) |


## [Why hel-micro](ttps://juejin.cn/post/7138792768234586148)
接入快、0入侵、简单易用：
![image](https://tnfe.gtimg.com/image/v3qm5w72nl_1659770977424.png)

让模块联邦技术从构建工具插件层面提升到sdk层面，使用更灵活，模块流通性更好（工具链无关）：
<img width="1226" alt="image" src="https://user-images.githubusercontent.com/7334950/195237524-867a213d-d1f8-4ae1-9306-3d9d997c779c.png">



### 如何使用远程模块

仅需要一句 npm 命令即可载入远程模块，查看下面例子[线上示例](https://codesandbox.io/s/hel-lodash-zf8jh8?file=/src/App.js)

- 1 安装`hel-micro`

```bash
npm i hel-micro
```

- 2 惰性加载远程模块

示例：调用`hel-lodash` 模块的方法

```ts
import { preFetchLib } from 'hel-micro';
async function ran(seed) {
  const mod = await preFetchLib('hel-lodash'); // 首次加载触发模块下载，之后会从hel-micro缓存获取
  const num = mod.myUtils.num.random(500);
  return num;
}
```

- 3 预加载远程模块

示例：静态导入`hel-lodash`后调用其模块方法

安装`hel-lodash`

```bash
npm i hel-lodash
```

先执行模块拉取动作

```ts
import { preFetchLib } from 'hel-micro';

async function main() {
  await preFetchLib('hel-lodash');
  await import('./loadApp'); // 入口文件后移
}

main().catch(console.error);
```

在入口文件里关联的任意文件处静态导入`hel-micro`并调用模块方法

```ts
import m from 'hel-lodash';
console.log(m.myUtils.num.random(500);) // 获得随机数
```

## [hel-micro](packages/hel-micro)

前端微件化 sdk，基于 hel-micro 可实现跨项目共享代码、模块热更新、微前端架构等功能

## [hel-micro-react](packages/hel-micro-react)

依赖 hel-micro 基础 api 实现的 react 组件加载库

## 了解更多
欢迎入群了解更多，微信群号(7天更新一次，可能会有延迟)：

<img width="460px" src="https://user-images.githubusercontent.com/7334950/195077415-8318c45f-f3a0-4e48-969e-74f1c99e65ba.png"></img>

QQ群号(永久有效)：

<img width="460px" src="https://user-images.githubusercontent.com/7334950/195077095-23521318-7d93-4cde-9437-e3dae4d6ae8e.png"></img>


