import type { IGetOptions } from 'hel-micro-core';
import {
  getAppMeta,
  getVerApp,
  getVerExtraCssList,
  getVerLib,
  getVersion,
  libReady,
  log,
  setAppMeta,
  setVerExtraCssList,
  setVersion,
} from 'hel-micro-core';
import type { IEmitAppInfo, Platform } from 'hel-types';
import * as alt from '../alternative';
import emitApp from '../process/emitApp';
import { getPlatform } from '../shared/platform';
import { isEmitVerMatchInputVer } from '../shared/util';
import type { IInnerPreFetchOptions } from '../types';
import { isCustomValid } from './custom';

interface IFixOptions extends IGetOptions {
  emitPlatform: string;
  emitVer: string;
}

function tryFixAssociateData(appName: string, appGroupName: string, fixOptions: IFixOptions) {
  const { platform } = fixOptions;
  const oriMeta = getAppMeta(appGroupName, platform);
  if (oriMeta) {
    return;
  }

  // 因 appName 对应的 appMeta、version、extraCssList 数据由 micro 写入
  // trust 模式下是没有这些数据的，需补上 appGroupName 相关数据
  const custMeta = getAppMeta(appName, platform);
  const custVer = getVersion(appName, fixOptions);
  if (custMeta && custVer) {
    setAppMeta({ ...custMeta, name: appGroupName, __addedByTrust: true }, platform);
    setVersion(appGroupName, { ...custVer, sub_app_name: appGroupName, __addedByTrust: true }, { platform });
    const cssList = getVerExtraCssList(appName, fixOptions);
    setVerExtraCssList(appGroupName, cssList, fixOptions);
  }
}

/**
 * @returns {boolean} - shouldNext
 */
function fixLibAssociateData(appName: string, appGroupName: string, fixOptions: IFixOptions) {
  const { platform, emitPlatform, versionId, emitVer } = fixOptions;
  const lib = getVerLib(appName, fixOptions);
  if (!lib) {
    tryFixAssociateData(appName, appGroupName, fixOptions);
    let originalLib = getVerLib(appGroupName, { platform, versionId }); // appGroupName 对应 lib 由 core 写入，此处可获取到
    if (!originalLib && emitPlatform) {
      // 相信弹射的版本数据就是目标版本数据
      originalLib = getVerLib(appGroupName, { platform: emitPlatform, versionId: emitVer, strictMatchVer: false });
    }
    if (!originalLib) {
      throw new Error(`seems plat ${emitPlatform} emit null lib for ${appGroupName}`);
    }
    libReady(appGroupName, originalLib, { platform, appName, versionId }); // 强制转移给当前平台
    return false; // 不走 next()，等待 libReady 内部触发新的 judgeAppReady 流程
  }
  return true; // lib 匹配成功，执行 next()，返回给上层调用
}

/**
 * @returns {boolean} - shouldNext
 */
function fixAppAssociateData(appName: string, appGroupName: string, fixOptions: IFixOptions) {
  const { platform, emitPlatform, versionId, emitVer } = fixOptions;
  const emittedApp = getVerApp(appName, fixOptions);
  if (!emittedApp) {
    tryFixAssociateData(appName, appGroupName, fixOptions);
    let oriEmittedApp = getVerApp(appGroupName, { platform, versionId });
    if (!oriEmittedApp && emitPlatform) {
      oriEmittedApp = getVerApp(appGroupName, { platform: emitPlatform, versionId: emitVer, strictMatchVer: false });
    }
    if (!oriEmittedApp) {
      throw new Error(`seems plat ${emitPlatform} emit null app for ${appGroupName}`);
    }
    emitApp({ ...oriEmittedApp, platform, appGroupName, appName, versionId }); // 强制转移给当前平台
    return false; // 不走 next()，等待 emitApp 内部触发新的 judgeAppReady 流程
  }
  return true; // app 匹配成功，执行 next()，返回给上层调用
}

export function getLibOrApp(appName: string, innerOptions: IInnerPreFetchOptions) {
  const { versionId = '', isLib } = innerOptions;
  const platform = getPlatform(innerOptions.platform);
  const strictMatchVer = alt.getVal(platform, 'strictMatchVer', [innerOptions.strictMatchVer]);
  const newGetOptions = { ...innerOptions, strictMatchVer };

  let targetName = appName;
  const { custom } = innerOptions;
  if (isCustomValid(custom)) {
    // 处于调试模式时，应用名可置换为用户人工设定的组名，以便让一个组名对应多个应用名的模式下，本地调试依然生效
    targetName = custom.appGroupName || appName;
  }

  const appMeta = getAppMeta(targetName, platform);
  // 语义化版本服务采用cdn架构存储元数据，它返回的 appMeta 里记录的 online_version 不可靠，这里要结合 __setByLatest 一起判断后才决定是否采用 lib
  if (innerOptions.semverApi && !versionId && appMeta && appMeta.__setByLatest !== true) {
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
  const fnMark = '[[ judgeAppReady ]]';
  log(`${fnMark} receive emitApp(appInfo):`, appInfo);
  const { versionId: inputVer = '', projectId, appName, platform, next, error, isLib, strictMatchVer } = options;
  const inputPlatform = getPlatform(platform);
  const { appName: emitAppName, appGroupName, platform: emitPlatform = inputPlatform, versionId: emitVer } = appInfo;
  const appPathDesc = `${platform}/${appName}/${inputVer}`;
  const appMeta = getAppMeta(appName, platform);

  const { custom, trust } = preFetchOptions;
  const fixData = (fixOptions: IFixOptions) => {
    try {
      const shouldNext = isLib
        ? fixLibAssociateData(appName, appGroupName, fixOptions)
        : fixAppAssociateData(appName, appGroupName, fixOptions);
      return shouldNext;
    } catch (err: any) {
      error(err);
      return false;
    }
  };

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
      const shouldNext = fixData({ versionId: inputVer, platform: inputPlatform, emitPlatform, emitVer });
      shouldNext && next();
      return;
    }
  }

  // 非严格版本匹配模式，只需要应用组名和平台值匹配即可，满足一些用户copy了资源到自己的项目目录下也想要正常加载的场景
  if (strictMatchVer === false && appGroupName && appMeta?.app_group_name === appGroupName && inputPlatform === emitPlatform) {
    log(`${fnMark} treat emitApp as wanted when strictMatchVer is false (appInfo):`, appInfo);
    return next();
  }

  const logStillWait = () => log(`${fnMark} still wait ${appPathDesc} emitted (appInfo,toMatch):`, appInfo, toMatch);
  // 啥也不做，等待平台值匹配、应用名匹配的那个事件发射上来
  const toMatch = { platform, emitVer, inputVer, projectId, strictMatchVer };
  if (appName !== emitAppName || !isEmitVerMatchInputVer(appName, toMatch)) {
    return logStillWait();
  }

  const trustAppNames = alt.getVal<string[]>(inputPlatform, 'trustAppNames', [null, []], { emptyArrIsNull: false });
  // sdk 初始化了一些信任的应用，或者模块使用方主动设置了信任模式，则开始走模块转移流程
  if (inputPlatform !== emitPlatform && (trust || trustAppNames.includes(appName))) {
    const shouldNext = fixData({ versionId: inputVer, platform: inputPlatform, emitPlatform, emitVer });
    if (!shouldNext) {
      log(`${fnMark} transfer ${emitPlatform} app [${appName}] to ${inputPlatform} plat due to being in trustAppNames`);
      return logStillWait();
    }
  }

  next();
}
