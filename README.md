<p align="center">
<img width="620px" alt="hel-logo"  src="https://user-images.githubusercontent.com/7334950/186912479-463a6788-41fd-474d-83ed-08314909d70d.png" />
</p>



## [Doc](https://tnfe.github.io/hel)
**hel-micro**, 模块联邦sdk化，免构建、热更新、工具链无关的微模块方案

see doc： https://tnfe.github.io/hel

## Demo

### 载入远程js库

codesandbox: https://codesandbox.io/s/hel-lodash-zf8jh8

git: https://github.com/hel-eco/hel-lodash

### 载入远程react组件

codesandbox: https://codesandbox.io/s/demo-load-remote-react-comp-2bnpl0

git: https://github.com/hel-eco/hel-tpl-remote-react-comp

git ts: https://github.com/hel-eco/hel-tpl-remote-react-comp-ts


### 载入远程vue组件

codesandbox: https://codesandbox.io/s/demo-load-remote-vue-comp-st0295

git: https://github.com/hel-eco/hel-tpl-remote-vue-comp

git.io: https://hel-eco.github.io/hel-tpl-remote-vue-comp/index.html

## Why hel-micro
![image](https://tnfe.gtimg.com/image/v3qm5w72nl_1659770977424.png)

### 如何使用远程模块
仅需要一句npm命令即可载入远程模块，查看下面例子[线上示例](https://codesandbox.io/s/hel-lodash-zf8jh8?file=/src/App.js)

- 1 安装`hel-micro`

```bash
npm i hel-micro
```

- 2 惰性加载远程模块

示例：调用`hel-lodash` 模块的方法

```ts
import { preFetchLib } from 'hel-micro';
async function ran(seed){
  const mod = await preFetchLib('hel-lodash'); // 首次加载触发模块下载，之后会从hel-micro缓存获取
  const num = mod.myUtils.num.random(500);
  return num;;
};
```

- 3 预加载远程模块

示例：静态导入`hel-lodash`后调用其模块方法

安装`hel-lodash`
```bash
npm i hel-lodash
```

先执行模块拉取动作
```ts
import { preFetchLib } from "hel-micro";

async function main() {
  await preFetchLib("hel-lodash");
  await import("./loadApp"); // 入口文件后移
}

main().catch(console.error);
```

在入口文件里关联的任意文件处静态导入`hel-micro`并调用模块方法
```ts
import m from 'hel-lodash';
console.log(m.myUtils.num.random(500);) // 获得随机数
```


## [hel-micro](packages/hel-micro)
前端微件化sdk，基于 hel-micro 可实现跨项目共享代码、模块热更新、微前端架构等功能

## [hel-micro-react](packages/hel-micro-react)
依赖 hel-micro 基础 api 实现的 react 组件加载库
