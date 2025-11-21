# hel-dev-utils

此包辅助模块提供方替换一些关键 webpack 参数

## build help info

构建后，`lib/index.js` 做调整

```ts
// 头部添加
/** @typedef {import('hel-types').ISrcMap} SrcMap */
/** @typedef {import('../src/types').IAssetOptions} IAssetOptions */
/** @typedef {import('../src/types').IAssetInfo} IAssetInfo */
/** @typedef {import('../src/types').IInnerFillAssetListOptions} IInnerFillAssetListOptions */
/** @typedef {import('../src/types').ICheckOptions} ICheckOptions */

//  import('../types') 替换为 import('../src/types')
```
