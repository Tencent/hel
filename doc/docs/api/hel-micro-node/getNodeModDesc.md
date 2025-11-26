---
sidebar_position: 9
---

# getNodeModDesc

同步函数，获取映射了 hel 模块的 node 模块在sdk中的相关描述信息`IModDesc`，类型信息如下

```ts
interface IModDesc extends IModManagerItemBase {
  /**
   * 其他激活的子路径模块的路径，key: 子路径名称，value：模块路径
   */
  exportedModPaths: Record<string, string>;
}

interface IModManagerItemBase {
  /** 所属平台 */
  platform: string;
  /** hel 模块名称 */
  modName: string;
  /** 当前模块版本号 */
  modVer: string;
  /**
   * 当前模块的在本机磁盘上的根目录路径（含版本号modVer），形如：
   * /proj/node_modules/.hel_modules/xx-mod/ver-1
   */
  modDirPath: string;
  /**
   * 当前模块的在本机磁盘上的根目录路径（不含版本号），形如：
   * /path/xx/mod-files/mod
   */
  modRootDirPath: string;
  /**
   * 当前版本的默认导出模块入口文件的完整路径，形如：
   * /proj/node_modules/.hel_modules/xx-mod/ver-1/srv/index.js
   * 存在子路径时，且该子路径对应模块就是默认导出模块时，激活的模块路径可能是：
   * /proj/node_modules/.hel_modules/xx-mod/ver-1/srv/sub-path/index.js
   */
  modPath: string;
  /** 下载次数 */
  downloadCount: number;
  /**
   * 第一个下载的版本号
   */
  firstDownloadVer: string;
  /** 本机磁盘上已下载的多个版本对应目录路径 */
  storedVers: string[];
}
```

:::caution

如果模块未映射，会报错 Unmapped node module xxx

如果模块未预加载，会报错 Mapped hel module xxx not preloaded

:::

## 简单使用

```ts
const modDesc = getNodeModDesc('@hel-demo/mono-libs');
```
