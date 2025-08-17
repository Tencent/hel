import { IMonoInjectedDevInfo, IMonoInjectedAppBaseConf } from 'hel-mono-types';

export type HelDep = { appName: string; appGroupName: string; packName: string; platform?: string };

export interface IMakeRuntimeUtilOptions {
  DEV_INFO: IMonoInjectedDevInfo;
  APP_GROUP_NAME: string;
  /** 是否 process.env.NODE_ENV 为 development */
  isDev: boolean;
  startMode: string;
}

export interface IEnableAndHost {
  enable: boolean;
  host: string;
}

export type GetHelDeps = () => HelDep[];

export type GetEnableAndHost = (appName: string, conf: IMonoInjectedAppBaseConf) => IEnableAndHost;

export type RuntimeUtil = {
  getHelDeps: GetHelDeps,
  getEnableAndHost: GetEnableAndHost,
};
