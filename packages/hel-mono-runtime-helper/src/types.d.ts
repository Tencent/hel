import { IMonoInjectedAppBaseConf, IMonoInjectedDevInfo } from 'hel-mono-types';

export type HelDep = { appName: string; appGroupName: string; packName: string; platform?: string };

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

export type GetHelDeps = () => HelDep[];

export type GetPrefetchParams = (appName: string, conf: IMonoInjectedAppBaseConf) => IPrefetchParams;

export type RuntimeUtil = {
  getHelDeps: GetHelDeps;
  getPrefetchParams: GetPrefetchParams;
};
