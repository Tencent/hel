---
sidebar_position: 2
---

# setGlobalConfig

设置 sdk 的全局配置`ISDKGlobalConfig`，类型说明如下

```ts
interface ISDKGlobalConfig extends Partial<Omit<ISDKGlobalBaseConfig, 'hooks' | 'shouldAcceptVersion'>> {
  hooks?: Partial<IHMNHooks>;
  /**
   * 收到新版本变更通知，是否接受该版本
   */
  shouldAcceptVersion?: (params: IShouldAcceptVersionParams) => boolean;
  /**
   * default: false
   * 默认情况下，不接受设置 helModulesDir helProxyFilesDir helLogFilesDir 这些参数，如有特殊场景需要设置，
   * 需同时设置 dangerouslySetDirPath 为 true，才能使这些目录位置变更生效
   */
  dangerouslySetDirPath?: boolean;
  reporter?: IReporter;
}

interface ISDKGlobalBaseConfig {
  /**
   * default: <proj>/node_modules/.hel_modules
   * hel 服务端模块存储路径，如需修改，在应用程序的入口处尽早通过 setConfig 设置才能生效
   */
  helModulesDir: string;
  /**
   * default: <proj>/node_modules/.hel_modules/.proxy
   * hel 服务端模块代理文件存储路径，如需修改，在应用程序的入口处尽早通过 setConfig 设置才能生效
   */
  helProxyFilesDir: string;
  /**
   * default: <proj>/node_modules/.hel_modules/.log
   * hel 服务端模块运行日志存储路径，如需修改，在应用程序的入口处尽早通过 setConfig 设置才能生效
   */
  helLogFilesDir: string;
  /**
   * 是否为严格模式，default: true ，
   * true: node 模块必须存在；
   * false: node 模块可以不存在，只要提供了假模块实现即可
   */
  strict: boolean;
  /**
   * setBaseConfig 调用配置的 hooks
   */
  hooks: IHMNHooks;
  /**
   * default: false
   * true：开启定时器，主动拉取最新版本元数据做更新（如版本一致则不更新）
   * 对于私有部署 helpack 的场景，不需要开启此功能，helpack 会主动通知各个服务器做微模块版本更新
   */
  enableIntervalUpdate: boolean;
  /**
   * default: 3 * 60 * 1000
   * 单位毫秒，默认3分钟的定时间隔
   */
  intervalUpdateMs: number;
  shouldAcceptVersion: (params: IShouldAcceptVersionParams) => boolean;
  /** 内部运行的错误报告函数 */
  reporter: {
    reportError(params: { message: string, desc: string, platform: string }): any;
    reportInfo(params: { message: string, desc: string, platform: string }): any;
  };
}

interface IShouldAcceptVersionParams {
  nodeModName: string;
  helModName: string;
  platform: string;
  currentMeta: IMeta | null;
  newMeta: IMeta;
}

```

## 控制是否接受新版本

当 helpack 主动通知版本变化或者开启了定时更新功能时，实现 `shouldAcceptVersion` 函数用于确定是否接收新版本

```ts
setGlobalConfig({
  shouldAcceptVersion(params){
    const { newMeta, currentMeta } = params;
    // 通常比较两个 meta 的数据，或者参考 newMeta 的构建时间、构建分支等数据来确定是否接受此版本
    return true; // or false
  },
})
```

:::info

接收两个一般版本的 meta 时内部默认拒绝更新，不会触发 shouldAcceptVersion 定制函数

:::
