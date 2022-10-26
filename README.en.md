[简体中文](./README.md) | English

<p align="center">
<img width="620px" alt="hel-logo" src="https://user-images.githubusercontent.com/7334950/186912479-463a6788-41fd-474d-83ed-08314909d70d.png" />
</p>

## [Doc](https://tnfe.github.io/hel)

**hel-micro**, module federation sdk, build-free, hot-update, toolchain-independent micro-module solution ❤️

see doc: https://tnfe.github.io/hel

## article

1. [hel-micro Module Federation New Revolution](https://dev.to/fantasticsoul/why-is-hel-micro-a-better-implementation-of-module-federation-21ji)

2. [Using hel-micro to make remote antd, tdesign-react](https://juejin.cn/post/7150639599499509797)

## video

1. [The first video tutorial] [Develop, publish, and use remote js library based on hel-micro](https://www.bilibili.com/video/BV15t4y1u7i5/?vd_source=51bc50bf5f860e0d778c49b00d192cee)
1. [The second phase of the video tutorial] [Local joint debugging based on the remote js library developed by hel-micro](https://www.bilibili.com/video/BV1Dd4y1y7Wj/?vd_source=51bc50bf5f860e0d778c49b00d192cee)

## template

Users can refer to [module development tutorial](https://tnfe.github.io/hel/docs/tutorial/helmod-dev), and based on [hel-eco](https://github.com/hel-eco) Various template projects provided can be slightly adjusted to publish various types of hel remote modules

| Example Name/Function | Usage Example | Template Address | Template Description | Hosting Location |
| --- | --- | --- | --- | --- |
| Remote ts library | [codesandbox](https://codesandbox.io/s/hel-lodash-zf8jh8) | [remote-lib-ts](https://github.com/hel-eco/hel-tpl- remote-lib) | webpack development and packaging | [unpkg](https://unpkg.com/hel-tpl-remote-lib/) |
| Remote react js components | [codesandbox](https://codesandbox.io/s/demo-load-remote-react-comp-2bnpl0) | [remote-react-comp](https://github.com/hel -eco/hel-tpl-remote-react-comp) | webpack development and packaging | [unpkg](https://unpkg.com/hel-tpl-remote-react-comps/) |
| Remote react ts components | [codesandbox](https://codesandbox.io/s/demo-load-remote-react-comp-2bnpl0) | [remote-react-comp-ts](https://github.com /hel-eco/hel-tpl-remote-react-comps) | webpack development and packaging | [unpkg](https://unpkg.com/hel-tpl-remote-react-comps-ts/) |
| Remote vue2 js component | [codesandbox](https://codesandbox.io/s/demo-load-remote-vue-comp-st0295) | [remote-vue-comp](https://github.com/hel -eco/hel-tpl-remote-vue-comp) | webpack development and packaging | [unpkg](https://unpkg.com/hel-tpl-remote-vue-comps/), [github.io index.html ](https://hel-eco.github.io/hel-tpl-remote-vue-comp/index.html), [unpkg index.html](https://unpkg.com/hel-tpl-remote- vue-comps@1.1.3/hel_dist/index.html) |
| Remote vue3 ts components | [codesandbox](https://codesandbox.io/s/demo-load-remote-vue3-comp-2fd34s?file=/src/main.js) | [remote-vue3-comps-ts ](https://github.com/hel-eco/hel-tpl-remote-vue3-comps-ts) | vite or webpack development, webpack packaging | [unpkg](https://unpkg.com/hel-tpl -remote-vue3-comps-ts/) |

## Actual combat

The hel remote module released after the transformation based on the template project

| Module Name/Function | Online Demo | Repository Address | Description | Hosting Location |
| --- | --- | --- | --- | --- |
| hel-lodash | [codesandbox](https://codesandbox.io/s/hel-lodash-zf8jh8) | [gihub](https://github.com/hel-eco/hel-lodash) | lodash remote package | [unpkg](https://unpkg.com/hel-lodash/) |
| hel-antd | [codesandbox](https://codesandbox.io/s/hel-demo-use-antd-tjy3ep) | [gihub](https://github.com/hel-eco/hel-antd) | antd remote package | [unpkg](https://unpkg.com/hel-antd/) |
| hel-tdesign-react | [codesandbox](https://codesandbox.io/s/hel-demo-use-tedesign-nw8bfb) | [gihub](https://github.com/hel-eco/hel- tdesign-react) | tdesign-react remote package | [unpkg](https://unpkg.com/hel-tdesign-react/) |

## [Why hel-micro](https://tnfe.github.io/hel)

Fast access, 0 intrusion, easy to use: ![image](https://user-images.githubusercontent.com/7334950/198016212-a0002896-caf1-4b59-aa32-e8fb09b15f33.png)

Let the module federation technology be upgraded from the build tool plug-in level to the sdk level, with more flexible use and better module circulation (toolchain irrelevant): <img width="1226" alt="image" src="https://user-images.githubusercontent.com/7334950/198015955-1e294f9c-4a6b-4482-8d54-100a5d3bd38d.png" />

### How to use remote modules

Only one npm command is needed to load a remote module, see the example below [online example](https://codesandbox.io/s/hel-lodash-zf8jh8?file=/src/App.js)

- 1 Install `hel-micro`

```bash
npm i hel-micro
```

- 2 Lazy load remote modules

Example: calling a method of the `hel-lodash` module

```ts
import { preFetchLib } from 'hel-micro';
async function ran(seed) {
  const mod = await preFetchLib('hel-lodash'); // The first load triggers the download of the module, and then it will be obtained from the hel-micro cache
  const num = mod.myUtils.num.random(500);
  return num;
}
```

- 3 Preload remote modules

Example: Calling its module method after statically importing `hel-lodash`

Install `hel-lodash`

```bash
npm i hel-lodash
```

Execute the module pull action first

```ts
import { preFetchLib } from 'hel-micro';

async function main() {
  await preFetchLib('hel-lodash');
  await import('./loadApp'); // move the entry file backward
}

main().catch(console.error);
```

Statically import `hel-micro` in any file associated with the entry file and call the module method

```ts
import m from 'hel-lodash';
console.log(m.myUtils.num.random(500);) // get random number
```

## [hel-micro](packages/hel-micro)

Front-end widgetized sdk, based on hel-micro, it can realize cross-project code sharing, module hot update, micro front-end architecture and other functions

## [hel-micro-react](packages/hel-micro-react)

React component loading library implemented by hel-micro based api.

## 🐚 Who is using

You are welcome to provide your company logo, company name, screenshots, website and other information in this [issue](https://github.com/tnfe/hel/issues/31), and provide other users with some reference information, so that in the future More people are involved in the construction and use of hel-micro.

<table>
  <tr>
      <td align="center">
        <a href="https://console.cloud.tencent.com/wedata/share/overview" target="_blank">
          <img width="140px;" src="https://user-images.githubusercontent.com/7334950/197116513-7c7382b6-a5b5-4fb9-bcd7-2ec891804b7d.png"></img>
        </a>
        <br/>
        <a target="_blank" href="https://console.cloud.tencent.com/wedata/share/overview">
          <b>Tencent Cloud</b>
        </a>
      </td>
      <td align="center">
         <a href="https://news.qq.com/" target="_blank">
          <img width="140px;" src="https://user-images.githubusercontent.com/7334950/197115413-ede5f5fa-70dd-4632-b7f5-f6f8bc167023.png"></img>
        </a>
        <br/>
        <a target="_blank" href="https://news.qq.com/">
          <b>Tencent News</b>
        </a>
      </td>
    </tr>
</table>

## 📦Learn more

Welcome to join the group to learn more. Since the WeChat discussion group is full of 200 people, you need to add the author's WeChat account or QQ group account, and then invite you to the `hel-micro` discussion group (remember to note hel when adding a sign)

<img width="896" alt="image" src="https://user-images.githubusercontent.com/7334950/196099777-f0cd3b9b-bcd5-4a88-9d15-62da4a62fe6e.png" />

## 👅License

hel-micro is released under the MIT License. http://www.opensource.org/licenses/mit-license
