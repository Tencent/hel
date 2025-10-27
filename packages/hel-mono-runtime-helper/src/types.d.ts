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
  enable: boolean;
  /** localStorage 里读取到的 xxx hel模块的对应的分支key(hel.dev:xxx)值 */
  host: string;
  /** localStorage 里读取到的 xxx hel模块的对应的分支key(hel.branch:xxx)值 */
  branchId: string;
  /** localStorage 里读取到的 xxx hel模块的对应的分支key(hel.ver:xxx)值 */
  versionId: string;
  /** localStorage 里读取到的 xxx hel模块的对应的分支key(hel.proj:xxx)值 */
  projectId: string;
}

export declare const HEL_DEV_KEY_PREFIX: {
  devUrl: 'hel.dev';
  branchId: 'hel.branch';
  versionId: 'hel.ver';
  projectId: 'hel.proj';
};

export type GetHelDeps = () => { helModNames: string[], helDeps: IHelDep[] };

export type GetPrefetchParams = (helModName: string, mod: IMonoInjectedMod) => IPrefetchParams;

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
