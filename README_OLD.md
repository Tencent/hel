简体中文 | [English](./README.en.md)

<p align="center">
<img width="620px" alt="hel-logo"  src="https://user-images.githubusercontent.com/7334950/186912479-463a6788-41fd-474d-83ed-08314909d70d.png" />
</p>

## [Doc](https://helmicro.com)

**hel-micro**, 模块联邦 sdk 化，免构建、热更新、工具链无关的微模块方案 ❤️

see doc： https://helmicro.com or https://tencent.github.io/hel

## 文章

1. [hel-micro 模块联邦新革命](https://juejin.cn/post/7138792768234586148)

2. [使用 hel-micro 制作远程 antd、tdesign-react](https://juejin.cn/post/7150639599499509797)

## 视频

1. 【视频教程第一期】[基于 hel-micro 开发、发布、使用远程 js 库](https://www.bilibili.com/video/BV15t4y1u7i5/?vd_source=51bc50bf5f860e0d778c49b00d192cee)
1. 【视频教程第二期】[本地联调基于 hel-micro 开发的远程 js 库](https://www.bilibili.com/video/BV1Dd4y1y7Wj/?vd_source=51bc50bf5f860e0d778c49b00d192cee)

## 模板

用户可参考[模块开发教程](https://helmicro.com/hel/docs/tutorial/helmod-dev)，并基于[hel-eco](https://github.com/hel-eco)提供的各种模板项目做轻微调整，即可发布各种类型的 hel 远程模块

| 示例名称/功能 | 在线示例 | 模板地址 | 模板描述 | 托管位置 |
| --- | --- | --- | --- | --- |
| 远程 ts 库 | [预加载+静态导入](https://codesandbox.io/s/hel-lodash-zf8jh8) | [remote-lib-ts](https://github.com/hel-eco/hel-tpl-remote-lib) | webpack 开发与打包 | [unpkg](https://unpkg.com/hel-tpl-remote-lib/) |
| 远程 react js 组件 | <div>[预加载+静态导入](https://codesandbox.io/s/demo-load-remote-react-comp-prefetch-7f87q4?file=/src/index.js)</div> [懒加载 shadow](https://codesandbox.io/s/demo-load-remote-react-comp-2bnpl0) | [remote-react-comp](https://github.com/hel-eco/hel-tpl-remote-react-comp) | webpack 开发与打包 | [unpkg](https://unpkg.com/hel-tpl-remote-react-comps/) |
| 远程 react ts 组件 | [懒加载 shadow](https://codesandbox.io/s/demo-load-remote-react-comp-2bnpl0) | [remote-react-comp-ts](https://github.com/hel-eco/hel-tpl-remote-react-comp-ts) | webpack 开发与打包 | [unpkg](https://unpkg.com/hel-tpl-remote-react-comps-ts/) |
| 远程 vue2 js 组件 | [预加载+静态导入](https://codesandbox.io/s/demo-load-remote-vue-comp-st0295?file=/src/components/HelloWorld.vue) <div>[懒加载](https://codesandbox.io/s/demo-load-remote-vue-comp-async-cqllv0?file=/src/components/HelloWorld.vue)</div> | [remote-vue-comp](https://github.com/hel-eco/hel-tpl-remote-vue-comp) | webpack 开发与打包 | <div>[unpkg](https://unpkg.com/hel-tpl-remote-vue-comps/)、</div> <div>[github.io index.html](https://hel-eco.github.io/hel-tpl-remote-vue-comp/index.html)、</div> [unpkg index.html](https://unpkg.com/hel-tpl-remote-vue-comps@1.1.3/hel_dist/index.html) |
| 远程 vue3 ts 组件 | [预加载](https://codesandbox.io/s/demo-load-remote-vue3-comp-2fd34s?file=/src/main.js) | [remote-vue3-comps-ts](https://github.com/hel-eco/hel-tpl-remote-vue3-comps-ts) | vite 或 webpack 开发，webpack 打包 | [unpkg](https://unpkg.com/hel-tpl-remote-vue3-comps-ts/) |
| 远程 vue3 ts 组件 | [预加载](https://codesandbox.io/s/demo-load-remote-vue3-comp-2fd34s?file=/src/main.js) | [hel-tpl-remote-vue3-comps-vite](https://github.com/decadef20/hel-lib-vue-comps-vite) | vite 开发与打包 | [unpkg index.html](https://unpkg.com/browse/hel-tpl-remote-vue3-comps-ts@1.4.0/hel_dist/index.html) |

## 实战

基于模板项目改造后发布的 hel 远程模块

| 模块名称/功能 | 在线演示 | 仓库地址 | 描述 | 托管位置 |
| --- | --- | --- | --- | --- |
| hel-lodash | [codesandbox](https://codesandbox.io/s/hel-lodash-zf8jh8) | [gihub](https://github.com/hel-eco/hel-lodash) | lodash 远程包 | [unpkg](https://unpkg.com/hel-lodash/) |
| hel-antd | [codesandbox](https://codesandbox.io/s/hel-demo-use-antd-tjy3ep) | [gihub](https://github.com/hel-eco/hel-antd) | antd 远程包 | [unpkg](https://unpkg.com/hel-antd/) |
| hel-tdesign-react | [codesandbox](https://codesandbox.io/s/hel-demo-use-tedesign-nw8bfb) | [gihub](https://github.com/hel-eco/hel-tdesign-react) | tdesign-react 远程包 | [unpkg](https://unpkg.com/hel-tdesign-react/) |

## [Why hel-micro](https://helmicro.com/hel)

接入快、0 入侵、简单易用： ![image](https://tnfe.gtimg.com/image/v3qm5w72nl_1659770977424.png)

让模块联邦技术从构建工具插件层面提升到 sdk 层面，使用更灵活，模块流通性更好（工具链无关）： <img width="1226" alt="image" src="https://user-images.githubusercontent.com/7334950/195237524-867a213d-d1f8-4ae1-9306-3d9d997c779c.png" />

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

## 🐚 谁在使用

欢迎在此[issue](https://github.com/tnfe/hel/issues/31)里提供你的公司 logo，公司名，截图、站点等信息，提供给其他用户一些参考信息，让未来有更多的人参与到 hel-micro 的建设与使用中。

<table>
  <tr>
      <td align="center">
        <a href="https://console.cloud.tencent.com/wedata/share/overview" target="_blank">
          <img width="140px;" src="https://user-images.githubusercontent.com/7334950/197116513-7c7382b6-a5b5-4fb9-bcd7-2ec891804b7d.png"></img>
        </a>
        <br/>
        <a target="_blank" href="https://console.cloud.tencent.com/wedata/share/overview">
          <b>腾讯云</b>
        </a> 
      </td>
      <td align="center">
        <a href="https://www.tencentmusic.com" target="_blank">
          <img width="140px;" src="https://user-images.githubusercontent.com/7334950/253788999-40ca0ea2-e73d-4e7b-b932-162826d5bf97.png"></img>
        </a>
        <br/>
        <a target="_blank" href="https://www.tencentmusic.com">
          <b>腾讯音乐</b>
        </a> 
      </td>
      <td align="center">
        <a href="https://docs.qq.com" target="_blank">
          <img width="140px;" src="https://user-images.githubusercontent.com/7334950/253789181-c4065149-304b-4b1e-bb93-23e1d849f45f.png"></img>
        </a>
        <br/>
        <a target="_blank" href="https://docs.qq.com">
          <b>腾讯文档</b>
        </a> 
      </td>
      <td align="center">
         <a href="https://news.qq.com/" target="_blank">
          <img width="140px;" src="https://user-images.githubusercontent.com/7334950/197115413-ede5f5fa-70dd-4632-b7f5-f6f8bc167023.png"></img>
        </a>
        <br/>
        <a target="_blank" href="https://news.qq.com/">
          <b>腾讯新闻</b>
        </a> 
      </td>
      <td align="center">
         <a href="https://gu.qq.com/resource/products/portfolio/m.htm" target="_blank">
          <img width="140px;" src="https://user-images.githubusercontent.com/7334950/253789148-c42ae516-991f-44df-a366-9b295c306b98.png"></img>
        </a>
        <br/>
        <a target="_blank" href="https://gu.qq.com/resource/products/portfolio/m.htm">
          <b>腾讯自选股</b>
        </a> 
      </td>
    </tr>
</table>

## 📦 了解更多

欢迎入群了解更多，由于微信讨论群号 200 人已满，需加作者微信号或 qq 群号，再邀请你如`hel-micro`讨论群（加号时记得备注 hel 哦）

<img width="896" alt="image" src="https://user-images.githubusercontent.com/7334950/196099777-f0cd3b9b-bcd5-4a88-9d15-62da4a62fe6e.png">

## 👅License

hel-micro is released under the MIT License. http://www.opensource.org/licenses/mit-license
