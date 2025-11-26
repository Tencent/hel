---
sidebar_position: 10
---

# importHelMod

传入 hel 名称将获得模块实例封装对象`IModIns`，类型描述如下

```ts
export interface IModIns<T extends any = any> {
  /**
   * 模块对象
   */
  mod: T;
  /**
   * 导出模块的完整路径，形如：/path/to/mod-files/v1/xxx.js
   */
  modPath: string;
  /**
   * 模块相对版本目录的子路径，形如 srv/hel-hello/index.js 等，
   * 如没有放在到子目录下，则形如 index.js、my-name.js 等
   */
  modRelPath: string;
  /**
   * 主模块路径，当 isMainMod=true 时，mainModPath===modPath
   */
  mainModPath: string;
  /**
   * 当前激活模块是否是默认导出模块
   */
  isMainMod: boolean;
  /**
   * 当前版本模块目录根路径，形如：
   * /path/to/mod-files/v1、
   * /path/to/.hel_modules/hel+xxx/13455443214、
   * /path/to/.hel_modules/npm+@tencent+some-lib/1.1.0、
   */
  modDirPath: string;
  /**
   * 模块在 <hel_modules> 下的根目录路径
   */
  modRootDirPath: string;
  /**
   * 模块版本号，形如：v1
   */
  modVer: string;
  /**
   * true，是存在于本地磁盘里的初始模块，此模块的硬盘数据不会被清理掉
   */
  isInit: boolean;
}

```

## 简单使用

传入 hel 名称将获得模块实例封装对象，取`mod`属性即可获取具体模块对象

```ts
const modIns = await importHelMod('@hel-demo/mono-libs');
modIns.hello();
```

## 获取指定版本的模块

传入`ver`将载入指定版本的模块

```ts
const modIns = await importHelMod('@hel-demo/mono-libs', { ver: '1.0.1' });
```
