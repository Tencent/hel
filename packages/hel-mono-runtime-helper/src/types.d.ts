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
  host: string;
  branchId: string;
  versionId: string;
  projectId: string;
}

export type GetHelDeps = () => HelDep[];

export type GetPrefetchParams = (appName: string, conf: IMonoInjectedAppBaseConf) => IPrefetchParams;

export type RuntimeUtil = {
  getHelDeps: GetHelDeps;
  getPrefetchParams: GetPrefetchParams;
};
