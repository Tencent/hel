# Change Log
[released] - 2024-07-29
发布 `hel-micro`，版本`4.9.10`，特性包含：

- 优化`preFetchLib`接口，支持透传`getCacheKey`函数自定义缓存key生成方式

[released] - 2024-07-05

发布 `hel-micro`，版本`4.9.8`，特性包含：

- 优化`judgeAppReady`内部打印函数，提供更多的信息给开发者

[released] - 2024-06-11

发布 `hel-micro`，版本`4.9.7`，特性包含：

- `isEmitVerMatchInputVer` 支持透传 `branchId` 做更准确的判断，避免 `waitAppReady` 函数一直处于等待状态

[released] - 2024-06-06

发布 `hel-micro`，版本`4.9.6`，特性包含：

- `preFetchLib` 支持透传 `branchId`，服务于平台自定义请求

[released] - 2024-05-20

发布 `hel-micro`，版本`4.9.5`，特性包含：

- 升级依赖 `hel-micro-core` 版本到 `4.9.2`

发布 `hel-micro-core`，版本`4.9.2`，特性包含：

- 优化 `tryGetVersion` 函数

[released] - 2024-05-18

发布 `hel-micro`，版本`4.9.4`，特性包含：

- 新增 `nativeParse` 方法，本地联调时优先采用 `nativeParse` 替代 `hel-html-parser`

发布 `hel-micro`，版本`4.9.1`，特性包含：

- `handle/patch` 模块里新增 `body` 可能为 `undefined` 判断

[released] - 2023-03-26

发布 `hel-micro`，版本`3.13.17`，特性包含：

- 修正 `preFetchApp` 返回结果

[released] - 2023-03-08

发布 `hel-micro`，版本`3.13.9`，特性包含：

- 支持`xhr`请求，在不支持`fetch`函数的环境降级使用`xhr`
