# hel-dev-utils

此包辅助模块提供方替换一些关键 webpack 参数

## build help info

构建后，`lib/index.js` 做调整

```ts
// 头部添加
/** @typedef {import('../typings').SrcMap} SrcMap*/
/** @typedef {import('../typings').IAssetOptions} IAssetOptions*/
/** @typedef {import('../typings').IAssetInfo} IAssetInfo */
/** @typedef {import('../typings').IInnerFillAssetListOptions} IInnerFillAssetListOptions */

//  import('../../typings') 替换为 import('../typings')
```
