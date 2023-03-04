import { PLAT_UNPKG } from '../consts/logic';
import {
  getAppMeta,
  getPlatform,
  getPlatformConfig,
  getVerApp,
  getVerExtraCssList,
  getVerLib,
  getVersion,
  IGetOptions,
  libReady,
  log,
  setAppMeta,
  setVerExtraCssList,
  setVersion,
} from '../deps/helMicroCore';
import type { IEmitAppInfo, Platform } from '../deps/helTypes';
import emitApp from '../process/emitApp';
import { isCustomValid, isEmitVerMatchInputVer } from '../shared/util';
import type { IInnerPreFetchOptions } from '../types';

function tryFixAssociateData(appName: string, appGroupName: string, getOptions: IGetOptions) {
  const { platform } = getOptions;
  const oriMeta = getAppMeta(appGroupName, platform);
  if (oriMeta) {
    return;
  }

  // 因 appName 对应的 appMeta、version、extraCssList 数据由 micro 写入
  // trust 模式下是没有这些数据的，需为 appGroupName 补上这些数据
  const custMeta = getAppMeta(appName, platform);
  const custVer = getVersion(appName, getOptions);
  if (custMeta && custVer) {
    setAppMeta({ ...custMeta, name: appGroupName, __addedByTrust: true }, platform);
    setVersion(appGroupName, { ...custVer, sub_app_name: appGroupName, __addedByTrust: true }, { platform });
    const cssList = getVerExtraCssList(appName, getOptions);
    setVerExtraCssList(appGroupName, cssList, getOptions);
  }
}

/**
 * @returns {boolean} - shouldNext
 */
function fixLibAssociateData(appName: string, appGroupName: string, getOptions: IGetOptions) {
  const { platform } = getOptions;
  const lib = getVerLib(appName, getOptions);
  if (!lib) {
    tryFixAssociateData(appName, appGroupName, getOptions);
    const originalLib = getVerLib(appGroupName, getOptions); // appGroupName 对应 lib 由 core 写入，此处可获取到
    if (!originalLib) {
      throw new Error(`seems ${appGroupName} emit null lib`);
    }
    libReady(appName, originalLib, { platform }); // 强制转移给 appName
    return false; // 不走 next()，等待 libReady 内部触发新的 judgeAppReady 流程
  }
  return true; // lib 匹配成功，执行 next()，返回给上层调用
}

/**
 * @returns {boolean} - shouldNext
 */
function fixAppAssociateData(appName: string, appGroupName: string, getOptions: IGetOptions) {
  const { versionId } = getOptions;
  const emittedApp = getVerApp(appName, getOptions);
  if (!emittedApp) {
    tryFixAssociateData(appName, appGroupName, getOptions);
    const oriEmittedApp = getVerApp(appGroupName, getOptions);
    if (!oriEmittedApp) {
      throw new Error(`seems ${appGroupName} emit null app`);
    }
    emitApp({ ...oriEmittedApp, appName, versionId });
    return false; // 不走 next()，等待 emitApp 内部触发新的 judgeAppReady 流程
  }
  return true; // app 匹配成功，执行 next()，返回给上层调用
}

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
  // unpkg 平台的 appMeta 里记录的 online_version 不可靠，这里要结合 __setByLatest 一起判断后才决定是否采用 lib
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
  error: (...args: any[]) => void;
  strictMatchVer?: boolean;
  platform?: Platform;
  versionId?: string;
  projectId?: string;
}
export function judgeAppReady(appInfo: IEmitAppInfo, options: IJudgeOptions, preFetchOptions: IInnerPreFetchOptions) {
  log('[[ judgeAppReady ]] receive emitApp(appInfo):', appInfo);
  const { versionId: inputVer = '', projectId, appName, platform, next, error, isLib, strictMatchVer } = options;
  const { appName: emitAppName, appGroupName, platform: emitPlatform = getPlatform(), versionId: emitVer } = appInfo;
  const appPathDesc = `${platform}/${appName}/${inputVer}`;
  const appMeta = getAppMeta(appName, platform);

  // 非严格版本匹配模式，只需要应用组名和平台值匹配即可，满足一些用户copy了资源到自己的项目目录下也想要正常加载的场景
  const inputPlatform = platform || getPlatform();
  if (strictMatchVer === false && appGroupName && appMeta?.app_group_name === appGroupName && inputPlatform === emitPlatform) {
    log('[[ judgeAppReady ]] treat emitApp as wanted when strictMatchVer is false(appInfo):', appInfo);
    return next();
  }

  const { custom } = preFetchOptions;
  if (custom) {
    const { enable = true, host, appGroupName: customAppGroupName, trust = false } = custom;
    // 额外判断 appGroupName 是否存在，防止 appGroupName 是 undefined
    const isGroupNameValid = () => appGroupName && (appGroupName === appName || appGroupName === customAppGroupName);
    if (enable && host) {
      // 非 trust 模式下，组名有效才识别为当前调用所需模块
      if (!trust) {
        isGroupNameValid() && next();
        return;
      }

      // trust 模式会强行复制远程模块为当前调用所需要模块，同时会为远程补齐缺失数据，开发者需要知道并承担其危险后果！
      const getOptions = { versionId: inputVer, platform: inputPlatform };
      try {
        const shouldNext = isLib
          ? fixLibAssociateData(appName, appGroupName, getOptions)
          : fixAppAssociateData(appName, appGroupName, getOptions);
        shouldNext && next();
      } catch (err: any) {
        error(err.message);
      }
      return;
    }
  }

  // 啥也不做，等待平台值匹配、应用名匹配的那个事件发射上来
  const toMatch = { platform, emitVer, inputVer, projectId };
  if (appName !== emitAppName || emitPlatform !== platform || !isEmitVerMatchInputVer(appName, toMatch)) {
    log(`still wait ${appPathDesc} emitted (appInfo,toMatch):`, appInfo, toMatch);
    return;
  }

  next();
}
