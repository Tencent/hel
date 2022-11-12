import { getAppMeta, getPlatform, getPlatformConfig, getVerApp, getVerLib, log } from 'hel-micro-core';
import type { IEmitAppInfo, Platform } from 'hel-types';
import { PLAT_UNPKG } from '../consts/logic';
import { isCustomValid, isEmitVerMatchInputVer } from '../shared/util';
import type { IInnerPreFetchOptions } from '../types';

export function getLibOrApp(appName: string, innerOptions: IInnerPreFetchOptions) {
  const { platform = getPlatform(), versionId = '', isLib } = innerOptions;
  // 不传递的话，保持和 hel-micro-core 里一致的设定，hel-micro-core 默认是 true
  const strictMatchVer = innerOptions.strictMatchVer ?? getPlatformConfig(platform).strictMatchVer;
  const newGetOptions = { ...innerOptions, strictMatchVer };

  let targetName = appName;
  const { custom } = innerOptions;
  if (isCustomValid(custom)) {
    // 处于调试模式时，应用名可置换为用户人工设定的组名，以便让一个组名对应多个应用名的模式下，本地调试依然生效
    targetName = custom.appGroupName || appName;
  }

  const appMeta = getAppMeta(targetName, platform);
  // @ts-ignore, unpkg 平台的 appMeta 里记录的 online_version 不可靠，这里要结合 __setByLatest 一起判断，采用觉得是否采用 lib
  if (platform === PLAT_UNPKG && !versionId && appMeta && appMeta.__setByLatest !== true) {
    return null;
  }

  if (isLib) {
    const lib = getVerLib(targetName, newGetOptions);
    const libWrap: IEmitAppInfo = {
      appName: targetName,
      appGroupName: appMeta?.app_group_name || '',
      platform,
      appProperties: lib,
      isLib: true,
      versionId,
      Comp: null,
      lifecycle: undefined,
    };
    return lib ? libWrap : null;
  }
  const emitApp = getVerApp(targetName, newGetOptions);
  return emitApp || null;
}

interface IJudgeOptions {
  appName: string;
  isLib: boolean;
  next: (...args: any[]) => void;
  strictMatchVer?: boolean;
  platform?: Platform;
  versionId?: string;
  projectId?: string;
}
export function judgeAppReady(appInfo: IEmitAppInfo, options: IJudgeOptions, preFetchOptions: IInnerPreFetchOptions) {
  log('[[ judgeAppReady ]] receive emitApp', appInfo);
  const { versionId: inputVer = '', projectId, appName, platform, next, strictMatchVer } = options;
  const { appName: emitAppName, appGroupName, platform: emitPlatform = getPlatform(), versionId: emitVer } = appInfo;
  const appPathDesc = `${platform}/${appName}/${inputVer}`;
  const appMeta = getAppMeta(appName, platform);

  // 非严格版本匹配模式，只需要应用组名和平台值匹配即可，满足一些用户copy了资源到自己的项目目录下也想要正常加载的场景
  const inputPlatform = platform || getPlatform();
  if (strictMatchVer === false && appGroupName && appMeta?.app_group_name === appGroupName && inputPlatform === emitPlatform) {
    log('[[ judgeAppReady ]] treat emitApp as wanted when strictMatchVer is false', appInfo);
    return next();
  }

  const { custom } = preFetchOptions;
  if (custom) {
    const { enable = true, host, appGroupName: customAppGroupName } = custom;
    // 防止 appGroupName 是 undefined
    if (enable && host && appGroupName && (appGroupName === appName || appGroupName === customAppGroupName)) {
      return next();
    }
  }

  // 啥也不做，等待平台值匹配、应用名匹配的那个事件发射上来
  if (
    appName !== emitAppName
    || emitPlatform !== platform
    || !isEmitVerMatchInputVer(appName, { platform, emitVer, inputVer, projectId })
  ) {
    log(`still wait ${appPathDesc} emitted`, appInfo, options);
    return;
  }

  next();
}
