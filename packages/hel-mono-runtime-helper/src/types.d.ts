import { IMonoInjectedMod, IMonoInjectedDevInfo } from 'hel-mono-types';

export interface IHelDep {
  helModName: string;
  groupName: string;
  pkgName: string;
  platform?: string;
}

export interface IMakeRuntimeUtilOptions {
  DEV_INFO: IMonoInjectedDevInfo;
  APP_GROUP_NAME: string;
  DEPLOY_ENV: string;
  /** 是否 process.env.NODE_ENV 为 development */
  isDev: boolean;
  startMode: string;
}

export interface IPrefetchParams {
  /** 是否开启调试功能 */
  enable: boolean;
  /** localStorage 里读取到的 xxx hel模块的对应的分支key(hel.dev:xxx)值，对接调试功能 */
  host: string;
  others: {
    /** localStorage 里读取到的 xxx hel模块的对应的分支key(hel.branch:xxx)值 */
    branchId?: string;
    /** localStorage 里读取到的 xxx hel模块的对应的分支key(hel.ver:xxx)值 */
    versionId?: string;
    /** localStorage 里读取到的 xxx hel模块的对应的分支key(hel.proj:xxx)值 */
    projectId?: string;
    platform?: string;
    customMetaUrl?: string;
    semverApi?: boolean;
  };
}

export declare const HEL_DEV_KEY_PREFIX: {
  devUrl: 'hel.dev';
  branchId: 'hel.branch';
  versionId: 'hel.ver';
  projectId: 'hel.proj';
};

export interface IGetPrefetchParamsOpts {
  helModName: string;
  pkgName: string;
  mod: IMonoInjectedMod;
}

export type GetHelDeps = () => { helModNames: string[], helDeps: IHelDep[] };

export type GetPrefetchParams = (options: IGetPrefetchParamsOpts) => IPrefetchParams;

export interface IHelConfKeys {
  /** 具体hel模块的调试链接 key */
  devUrl: string;
  /** 具体hel模块的分支 key */
  branchId: string;
  /** 具体hel模块的版本号 key */
  versionId: string;
  /** 具体hel模块的项目id key */
  projectId: string;
}

export type RuntimeUtil = {
  getHelDeps: GetHelDeps;
  getPrefetchParams: GetPrefetchParams;
};
