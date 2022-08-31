
import type { IEmitAppInfo, Platform } from 'hel-types';
import type { IGetOptions } from 'hel-micro-core';
import type { IInnerPreFetchOptions } from '../types';
import { getPlatform, log, getVerLib, getVerApp, getPlatformConfig, getAppMeta } from 'hel-micro-core';
import { isEmitVerMatchInputVer } from '../shared/util';


export function getLibOrApp(appName: string, isLib: boolean, getOptions: IGetOptions) {
  const { platform = getPlatform(), versionId = '' } = getOptions;
  // 不传递的话，保持和 hel-micro-core 里一致的设定，hel-micro-core 默认是true
  const strictMatchVer = getOptions.strictMatchVer ?? getPlatformConfig(platform).strictMatchVer;
  const newGetOptions = { ...getOptions, strictMatchVer };

  if (isLib) {
    const lib = getVerLib(appName, newGetOptions);
    const appMeta = getAppMeta(appName);
    return lib ? {
      appName, appGroupName: appMeta?.app_group_name || '', platform, appProperties: lib,
      isLib: true, versionId, Comp: null, lifecycle: undefined
    } : null;
  }
  const emitApp = getVerApp(appName, newGetOptions);
  return emitApp || null;
}


interface IJudgeOptions {
  appName: string;
  isLib: boolean;
  next: (...args: any[]) => void;
  strictMatchVer?: boolean;
  platform?: Platform;
  versionId?: string;
}
export function judgeAppReady(appInfo: IEmitAppInfo, options: IJudgeOptions, preFetchOptions: IInnerPreFetchOptions) {
  log('[[ judgeAppReady ]] receive emitApp', appInfo);
  const { versionId: inputVer = '', appName, platform, next, strictMatchVer } = options;
  const { appName: emitAppName, appGroupName, platform: emitPlatform = getPlatform(), versionId: emitVer } = appInfo;
  const appPathDesc = `${platform}/${appName}/${inputVer}`;
  const appMeta = getAppMeta(appName, platform);

  // 非严格版本匹配模式，只需要应用组名和平台值匹配即可，满足一些用户copy了资源到自己的项目目录下也想要正常加载的场景
  const inputPlatform = platform || getPlatform();
  if (strictMatchVer === false && appGroupName && appMeta?.app_group_name === appGroupName && inputPlatform === emitPlatform) {
    log('[[ judgeAppReady ]] treat emitApp as wanted when strictMatchVer is false', appInfo);
    next();
  }

  const { custom } = preFetchOptions;
  if (custom) {
    const { enable = true, host, appGroupName: customAppGroupName } = custom;
    // 防止 appGroupName 是 undefined
    if (enable && host && appGroupName && (appGroupName === appName || appGroupName === customAppGroupName)) {
      next();
    }
  }

  // 啥也不做，等待平台值匹配、应用名匹配的那个事件发射上来
  if (
    appName !== emitAppName
    || emitPlatform !== platform
    || !isEmitVerMatchInputVer(appName, platform, emitVer, inputVer)
  ) {
    log(`still wait ${appPathDesc} emitted`, appInfo, options);
    return;
  }

  next();
};
