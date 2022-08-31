## remote-lib-tpl
远程仓库模板库

## 如何参与
- 改subApp
`src/configs/subApp.ts`改为你的hel模块名
```ts
export const APP_GROUP_NAME = 'hlib-xxx'; /// 名字随意，和 package.json name 一样即可
```

- 改package.json
将`hame`和`appGroupName`改为hel模块名(名字随意，保持一样即可)
```
  "name": "hlib-xxx",
  "appGroupName": "hlib-xxx",
```

- 改源代码
`src/utils/myMod.ts`
```ts
export function sayHelloToHel(from: string) {
  const yourRtxName = ''; // 可改写为你的名字
  return `hello hel, I am ${yourName}, I come from ${from}`;
}
```

- 改单测文件
`src/utils/__tests__/myMod.ts`
```ts
describe('test myMod', () => {
  test('sayHelloToHel', () => {
    const yourRtxName = ''; // 此处改写为你的rtx名字
    const ret = `hello hel, I am ${yourRtxName}, I come from bj`;
    expect(sayHelloToHel('bj') === ret).toBeTruthy();
  });
});
```

- 执行单测
```
npm run test
```

- 发布源码和类型
```
npm run build
npm publish
```

## FAQ
### 为何入口文件采取动态模块导入写法
如果采用静态导入写法

```ts
import { libReady } from 'hel-lib-proxy';
import { LIB_NAME } from './configs/subApp';

async function main() {
  const libProperties = await import('./entrance/libProperties');
  libReady(LIB_NAME, libProperties.default);
};

main().catch(console.error);
export default 'REMOTE MOD';
```

需要将 `config/webpack.config.js`里的 `maxChunks`的值 1 改为 4
```js
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 4,
    }),
```
如果不改动，构建会报错

```bash
Creating an optimized production build...
Browserslist: caniuse-lite is outdated. Please run:
  npx browserslist@latest --update-db
  Why you should do it regularly: https://github.com/browserslist/browserslist#browsers-data-updating
Failed to compile.

chunk runtime-main [entry]
Cannot convert undefined or null to object
```

改动后构建产物如下

```bash
  6.57 KB  hel_dist/static/js/2.506e8c97.chunk.js
  1.14 KB  hel_dist/static/js/runtime-main.65c05a8a.js
  499 B    hel_dist/static/js/3.21d3206a.chunk.js
  390 B    hel_dist/static/js/main.15c0c746.chunk.js
```

改为动态导入写法后

```ts
async function main() {
  const { libReady } = await import('hel-lib-proxy');
  const { LIB_NAME } = await import('./configs/subApp');

  const libProperties = await import('./entrance/libProperties');
  libReady(LIB_NAME, libProperties.default);
};

main().catch(console.error);
export default 'HEL REMOTE MOD';
```

则支持 `config/webpack.config.js`里的 `maxChunks`的值设置为 1，此时构建产物如下

```bash
  4.72 KB             hel_dist/static/js/0.a104ee67.chunk.js
  2.74 KB (+2.36 KB)  hel_dist/static/js/main.070cd75c.chunk.js
  1.14 KB (-2 B)      hel_dist/static/js/runtime-main.a8e25f5a.js
```

相比比原来少一个 `chunk`，为了构建产物尽可能的少 `chunk`，选择了入口文件采取动态模块导入写法
