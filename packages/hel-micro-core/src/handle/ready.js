import { HEL_EVENTS, HEL_LOAD_STATUS } from '../consts';
import { setEmitApp } from '../data/app';
import { getAppPlatform } from '../data/conf';
import { getHelEventBus } from '../data/event';
import { setEmitLib } from '../data/lib';
import { getAppMeta } from '../data/meta';
import { setVerLoadStatus } from '../data/status';
import { tryGetAppName, tryGetVersion } from './guess';

export function libReady(appGroupName, appProperties, options = {}) {
  const platform = options.platform || getAppPlatform(appGroupName);
  let versionId = options.versionId || tryGetVersion(appGroupName, platform);
  let appName = options.appName || tryGetAppName(versionId, appGroupName);

  const appMeta = getAppMeta(appName, platform);
  // @ts-ignore，来自于用户设定 cust 配置弹射的模块
  if (appMeta?.__fromCust) {
    versionId = appMeta.online_version;
    appName = appMeta.name;
  }

  const emitLib = {
    platform,
    appName,
    appGroupName,
    versionId,
    appProperties,
    // prettier-ignore
    Comp: function EmptyComp() { },
    lifecycle: {},
  };
  setEmitLib(appName, emitLib, { appGroupName, platform });
  setVerLoadStatus(appName, HEL_LOAD_STATUS.LOADED, { versionId, platform });
  const eventBus = getHelEventBus();
  eventBus.emit(HEL_EVENTS.SUB_LIB_LOADED, emitLib);
}

export function appReady(appGroupName, Comp, emitOptions = {}) {
  const { lifecycle } = emitOptions;
  const platform = emitOptions.platform || getAppPlatform(appGroupName);
  const versionId = emitOptions.versionId || tryGetVersion(appGroupName, platform);
  const appName = emitOptions.appName || tryGetAppName(versionId, appGroupName);
  const emitApp = { Comp, appName, appGroupName, lifecycle, platform, versionId, isLib: false };
  setEmitApp(appName, emitApp);
  setVerLoadStatus(appName, HEL_LOAD_STATUS.LOADED, { versionId, platform });
  const eventBus = getHelEventBus();
  eventBus.emit(HEL_EVENTS.SUB_APP_LOADED, emitApp);
}
