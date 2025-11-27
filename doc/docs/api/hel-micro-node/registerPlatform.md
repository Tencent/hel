---
sidebar_position: 2
---

# registerPlatform

此接口面向库开发者，当私有部署了[helpack](https://github.com/Tencent/hel/tree/main/helpack)时，可用此接口注册平台信息并返回此平台对应的 api，返回的 api 列表里，如果需要透传可选参数的接口在未传递 `platform` 值时，默认就是注册的平台值，同时可预设一些参数来告诉sdk如何和`helpack`通信

## 简单使用方式

```ts
const wrappedApi = hmn.registerPlatform({
  platform: 'my-plat',
  registrationSource: 'my-pkg-name',
  helpackApiUrl: `https://my-helpack-site.com/openapi/meta`,
  beforePreloadOnce: async () => {
    // 内网环境这里可能需要调用名字服务获取到 helpack 部署的 ip
    // 生成类似的 socket 连接字符串：'ws://122.10.1.2'
    return { helpackSocketUrl: 'ws://my-helpack-site.com' };
  },
  getSocketUrlWhenReconnect: async () => {
    // 内网环境机器可能销毁缩容导致链接中断，这里需要重新获取新分配的 ip
    // 生成类似的 socket 连接字符串：'ws://122.10.2.2'
    return 'ws://my-helpack-site.com';
  },
  socketHttpPingWhenTryReconnect: async () => {
    // ping your helpack server, return true if successfully pinged
    // get('https://my-helpack-site.com/openapi/v1/hmn/ping')
    return true;
  },
  getEnvInfo,
  hooks: {
    onHelModLoaded(params) {
      // 上报 hel 模块的运行环境
      // reportHelModStat(helModName, version);
    },
  },
});
```

:::info封装为适配私有部署helpack的专属sdk

建议封装成一个新的sdk，提供给内网其他服务使用，具体封装细节可参考[hm-node-use/hmnWrap](https://github.com/Tencent/hel/blob/main/helpack/hm-node-user/src/libs/hmnWrap.ts)

:::
