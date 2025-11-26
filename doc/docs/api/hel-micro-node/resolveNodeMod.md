---
sidebar_position: 7
---

# resolveNodeMod

同步函数，查看映射了 hel 模块的 node 模块路径数据 `IResolveModResult`，类型信息如下

```ts
interface IResolveModResult {
  /**
   * hel 模块对应的 node 模块名称，无值表示未在 mapNodeMods 或 mapAndPreload 里映射过
   */
  nodeModName: string;
  /**
   * hel 模块对应的 node 模块的入口文件记录，无值表示未在 mapNodeMods 或 mapAndPreload 里映射过
   */
  nodeModFilePath: string;
  /**
   * hel模块名称
   */
  helModName: string;
  /**
   * hel模块导入路径，用户以子路径导入 hel 模块时，helModName 和 helModPath 不一致
   * @example
   * ```ts
   * // 'helModName: \@hel-demo/my-lib helModPath: \@hel-demo/my-lib\/sub-path'
   * import('@hel-demo/my-lib/sub-path');
   * ```
   */
  helModPath: string;
  /**
   * hel模块入口文件路径
   */
  helModFilePath: string;
  /**
   * hel 模块对应的兜底模块的路径，无值表示未在 mapNodeMods 或 mapAndPreload 里映射过
   */
  helModFallbackPath: string;
  /**
   * true：是导出的主模块
   */
  isMainMod: boolean;
  /**
   * hel代理模块的文件路径
   */
  proxyFilePath: string;
  /**
   * 激活后的hel模块版本号
   */
  helModVer: string;
}
```

:::caution

如果模块未映射，会报错 Unmapped node module xxx

如果模块未预加载，会报错 Mapped hel module xxx not preloaded

:::

## 简单使用

```ts
const pathInfo = resolveNodeMod('@hel-demo/mono-libs');
```
