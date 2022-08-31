import { IEmitAppInfo } from 'hel-types';
import { helEvents, setEmitApp, getHelEventBus, tryGetVersion, tryGetAppName, getAppPlatform } from 'hel-micro-core';

const eventBus = getHelEventBus();

interface IEmitAppOptions {
  appGroupName: string;
  Comp: any;
  platform?: string;
  lifecycle?: IEmitAppInfo['lifecycle'];
}

/**
 * 暴露给 hel-micro 的 ui 对接层使用，例如 hel-micro-react 的 renderApp 接口，应用提供者会调用对接层开发者提供的
 * renderApp接口渲染整个应用，当应用非本地运行时，renderApp不触发渲染逻辑而是调用 emitApp 弹射整个根应用出去
 * 这样使用方可通过 react ui 对接层 的 <MicroApp name="xxApp" /> 来实例化整个远程应用
 */
export default function emitApp(options: IEmitAppOptions) {
  const { Comp, appGroupName, lifecycle } = options;
  const platform = options.platform || getAppPlatform(appGroupName);
  const versionId = tryGetVersion(appGroupName, platform);
  const appName = tryGetAppName(versionId, appGroupName);
  const emitApp: IEmitAppInfo = { Comp, appName, appGroupName, lifecycle, platform, versionId, isLib: false };
  setEmitApp(appName, emitApp);
  eventBus.emit(helEvents.SUB_APP_LOADED, emitApp);
};
