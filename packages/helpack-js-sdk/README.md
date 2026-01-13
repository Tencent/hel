# helpack-js-sdk

此包用于向 helpack 插入新应用、新版本。

如何使用见[示例](./examples/callSdkApi.js)

## 分类创建

此 sdk 只能向自己的分类作新增、修改等操作，需要先去[helpack管理台](https://locolhost:7777/__hub/new-app)创建分类，即可获取分类 token

## api 简介

### 类型

```ts
/**
 * 新增一个应用的构建版本数据
 */
type IVersionCreate = Omit<ISubAppVersion, 'create_by' | 'create_at' | 'update_at' | 'sub_app_id' | 'api_host'>;

interface IOptions {
  /** 操作 sdk 接口的用户企微英文名，会用于赋值创建应用、版本的 create_by 字段 */
  operator: string;
  /**
   * 在helpack管理台的新建应用里，选择分类，可以新增分类
   */
  classKey: string;
  /**
   * 可咨询 fancyzhong 拿到
   */
  classToken: string;
  /**
   * default: 'http://localhost:7777'
   */
  host?: string;
}

interface IOnProcessData {
  /** 已上传文件 */
  uploadedFiles: string[];
  /** 待上传文件 */
  pendingFiles: string[];
  /** 总文件数 */
  totalCount: number;
  /** 是否已结束 */
  finished: boolean;
}

interface IBackupAssetsOptions extends IOptions {
  /** 超时时间设定（秒），默认 60s */
  timeout?: number;
  onProcess?: (params: IOnProcessData) => void;
}

interface IHelpackRes<T extends any = any> {
  /** http 状态码 */
  status: number;
  statusText: string;
  /** 后台响应结构 */
  reply: {
    /** 后台回传的数据 */
    data: T;
    /** 后台回传的业务状态码，'0' 表示正常，其他表示异常 */
    code: string;
    /** code 不为 '0' 时后台回传的错误信息 */
    msg: string;
  };
}
```

### addVersion

新增版本，版本数据可由 hel-dev-utils 包生成，该接口仅把元数据存储到 helpack，资源需用户自己存储到 cdn

```ts
function addVersion(toCreate: IVersionCreate, options: IOptions): IHelpackRes;
```

### addVersionAndBackupAssets

新增版本，并转存用户自己的 cdn 资源到 helpack 内置的 cdn 服务，版本数据可由 hel-dev-utils 包生成

函数签名

```ts
function addVersionAndBackupAssets(toCreate: IVersionCreate, options: IBackupAssetsOptions): IHelpackRes<IOnProcessData>;
```

示例代码

```ts
const ret = await sdk.addVersionAndBackupAssets(ver, {
  classKey: 'xxx-class-key', // 新增应用里可以新增分类
  classToken: 'xxx-class-token', // 目前可咨询 fancyzhong 拿到
  operator: 'fancyzhong',
  onProcess(data) {
    console.log(data);
  },
});
```

### 其他

````ts
/**
 * 创建一个新的应用
 */
export function createSubApp(toCreate: ISubAppCreate, options: IOptions): IHelpackRes;

/**
 * 更新应用
 */
export function updateSubApp(toUpdate: ISubAppUpdate, options: IOptions): IHelpackRes;

/**
 * 获取应用
 * ```ts
 * // ISubApp 来自
 * import { ISubApp } from 'hel-types';
 * ```
 */
export function getSubApp(name: string, options?: { host?: string }): IHelpackRes<ISubApp>;

/**
 * 获取应用具体版本
 * ```
 * // ISubAppVersion 来自
 * import type { ISubAppVersion } from 'hel-types';
 * // demo
 * await getVersion('someVerId', { name: 'someApp', classToken: 'xx', operator: 'yy' });
 * ```
 */
export function getVersion(
  verId: string,
  options: { name: string; classToken: string; operator: string; host?: string },
): IHelpackRes<ISubAppVersion>;

/**
 * 获取应用具体版本
 * ```
 * // ISubAppVersion 来自
 * import type { ISubAppVersion } from 'hel-types';
 *
 * // demo
 * await getVersionList('someApp', { classToken: 'xx', operator: 'yy' });
 * ```
 */
export function getVersionList(
  name: string,
  options: { classToken: string; operator: string; host?: string; page?: number; size?: number },
): IHelpackRes<ISubAppVersion[]>;
````
