简体中文 | [English](./README.en.md)

<p align="center">
<img width="620px" alt="hel-logo"  src="https://raw.githubusercontent.com/Tencent/hel/refs/heads/write-doc/doc/static/img/hel-plus.png" />
</p>

**hel-micro**, 原生跨端、工具链无关的模块联邦SDK ❤️

> doc： https://helmicro.com or https://tencent.github.io/hel
## [Doc](https://helmicro.com)


## 特点

- 原生跨端  
支撑在**浏览器**和**服务器**双端同时使用

- 双模驱动  
支持以**传统包**和**微模块**包两种模式运行，通过编译参数做切换

- 平台化  
可部署[helpack](./helpack/README.md)做模块版本管理

- 工程化  
提供[hel](./packages/create-hel/README.md)命令行工具，完美适配`pnpm`大仓开发模式

- 工具链无关  
前端微模块可对接`webpack`、`vite`、`parcel`等构建工具，后端微模块可运行于`node`、`bun`、`deno`等运行时

## 快速开始

全局安装hel命令行工具

```bash
npm i create-hel -g
```

### 后端微模块

先映射欲提升为微模块的node模块，再启动你的服务

```ts
import { mapAndPreload } from 'hel-micro-node';

async function main() {
  // 如需使用 node_modules 模块，注释这里的调用即可
  await mapAndPreload({ '@hel-demo/mono-libs': true });
  await import('./server');
}
```

可通过以下命令行运行后端微模块示例项目

```bash
hel init demo1 -t node-demo
cd demo1
npm i
npm run start
```

### 前端微模块

先映射欲提升为微模块的前端模块，再载入你的前端应用

```ts
import { preFetchLib } from 'hel-micro';

async function start() {
  // 如需使用 node_modules 模块，注释这里的调用即可
  await preFetchLib('@hel-demo/mono-libs');
  await import('./loadApp');
}
```

webpack alias 配置模块映射关系

```ts
  alias: {
    // 如需使用 node_modules 模块，注释这里的映射即可
    '@hel-demo/mono-libs': '@hel-demo/mono-libs/hel' ,
  },
```

### 模块版本管理

可部署[helpack](./helpack/README.md)做模块版本管理

```bash
hel init myhel -t helpack
```

![helpack](https://tnfe.gtimg.com/image/f13q7cuzxt_1652895450360.png)


### 开发与部署微模块

使用命令行工具初始化专用于开发与部署微模块的工程

```bash
hel init mymod
cd mymod
pnpm i
# 新建子模块
pnpm start .create-mod mylib
# 开发子模块
pnpm start mylib
# 构建子模块
pnpm start mylib build:nbsm
# 发布子模块
pnpm --filter mylib publish
```

更多说明见`hel-mono`[文档](https://github.com/hel-eco/hel-mono)

### 其他

访问旧版[文档](./md/README_OLD.md)

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
