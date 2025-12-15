# hel-mono-helper

hel-mono micro architecture helper，辅助 `hel-mono` 大仓运行的工具包


## baseExternals

给大仓所有包的 的 hel 产物里都加上的外部资源链接里包含的基础模块


```html
<script id="BASE_EX"></script>
// 或id 带 BASE_EX 前缀的标签
<script id="BASE_EX1"></script>
```

## customExternals

给大仓所有包的 hel 产物里加上的外部资源链接里包含的自定义模块，这些模块可能依赖 baseExternals 里的基础模块，
配置到 `customExternals` 里的模块，当设置 `enableRepoEx` 为 true 时，此模块不会被提取到 `REPO_EX` 对应
链接包含的模块列表里

```html
<script data-helex="Lodash" src="..."></script>
```

`devRepoExLink` 正常情况下只支持一个链接, 多个时建议配置为

```ts
[{ ex: 'xxx', link: 'xxx' }]
```
