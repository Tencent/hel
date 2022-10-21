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

| 示例名称/功能 | 使用示范 | 模板地址 | 模板描述 | 托管位置 |
| --- | --- | --- | --- | --- |
| 远程 ts 库 | [codesandbox](https://codesandbox.io/s/hel-lodash-zf8jh8) | [hel-lodash](https://github.com/hel-eco/hel-tpl-remote-lib) | webpack 开发与打包 | [unpkg meta](https://unpkg.com/hel-lodash) |
| 远程 react js 组件 | [codesandbox](https://codesandbox.io/s/demo-load-remote-react-comp-2bnpl0) | [remote-react-comp](https://github.com/hel-eco/hel-tpl-remote-react-comp) | webpack 开发与打包 | [unpkg meta](https://unpkg.com/hel-tpl-remote-react-comps) |
| 远程 react ts 组件 | [codesandbox](https://codesandbox.io/s/demo-load-remote-react-comp-2bnpl0) | [remote-react-comp-ts](https://github.com/hel-eco/hel-tpl-remote-react-comp-ts) | webpack 开发与打包 | [unpkg meta](https://unpkg.com/hel-tpl-remote-react-comps-ts) |
| 远程 vue2 js 组件 | [codesandbox](https://codesandbox.io/s/demo-load-remote-vue-comp-st0295) | [remote-vue-comp](https://github.com/hel-eco/hel-tpl-remote-vue-comp) | webpack 开发与打包 | [unpkg meta](https://unpkg.com/hel-tpl-remote-vue-comps)、[github.io index.html](https://hel-eco.github.io/hel-tpl-remote-vue-comp/index.html) 、[unpkg index.html](https://unpkg.com/hel-tpl-remote-vue-comps@1.1.3/hel_dist/index.html) |
| 远程 vue3 ts 组件 | [codesandbox](https://codesandbox.io/s/demo-load-remote-vue3-comp-2fd34s?file=/src/main.js) | [remote-vue3-comps-ts](https://github.com/hel-eco/hel-tpl-remote-vue3-comps-ts) | vite 或 webpack 开发，webpack 打包 | [unpkg meta](https://unpkg.com/hel-tpl-remote-vue3-comps-ts) |

## [Why hel-micro](https://tnfe.github.io/hel)

接入快、0 入侵、简单易用： ![image](https://tnfe.gtimg.com/image/v3qm5w72nl_1659770977424.png)

让模块联邦技术从构建工具插件层面提升到 sdk 层面，使用更灵活，模块流通性更好（工具链无关）： <img width="1226" alt="image" src="https://user-images.githubusercontent.com/7334950/195237524-867a213d-d1f8-4ae1-9306-3d9d997c779c.png">

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


## 🐚谁在使用
欢迎在此[issue](https://github.com/tnfe/hel/issues/31)里提供你的公司logo，公司名，截图、站点等信息，提供给其他用户一些参考信息，让未来有更多的人参与到hel-micro的建设与使用中。

<table>
  <tr>
      <td align="center">
        <a href="https://github.com/TencentCloudBase/cloudbase-extension-cms" target="_blank">
          <img width="140px;" src="https://raw.githubusercontent.com/fantasticsoul/assets/master/img/cloudbase.png"></img>
        </a>
        <br/>
        <a target="_blank" href="https://console.cloud.tencent.com/wedata/share/overview">
          <b>腾讯云</b>
        </a> 
      </td>
      <td align="center">
         <a href="https://wink.org/" target="_blank">
          <img width="140px;" src="https://user-images.githubusercontent.com/7334950/197115413-ede5f5fa-70dd-4632-b7f5-f6f8bc167023.png"></img>
        </a>
        <br/>
        <a target="_blank" href="https://news.qq.com/">
          <b>腾讯新闻</b>
        </a> 
      </td>
    </tr>
</table>

## 了解更多

欢迎入群了解更多，由于微信讨论群号 200 人已满，需加作者微信号或 qq 群号，再邀请你如`hel-micro`讨论群（加号时记得备注 hel 哦）

<img width="896" alt="image" src="https://user-images.githubusercontent.com/7334950/196099777-f0cd3b9b-bcd5-4a88-9d15-62da4a62fe6e.png">
