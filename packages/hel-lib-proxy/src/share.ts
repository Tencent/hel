import { getAppPlatform, getSharedCache, log } from 'hel-micro-core';
import type { Platform } from 'hel-types';
import type { IOptions, LibProperties } from './typings';
import * as diff from './_diff';

export function getMergedOptions(options?: IOptions) {
  const defaultOptions = {
    allowDup: false, // TODO，此参数目前是多余的，后续考虑移除或实现
    platform: diff.getDefaultPlatform(),
  };
  return { ...defaultOptions, ...(options || {}) };
}

/**
 *
 * @param libName - 库名、应用组名
 * @param platform
 * @returns
 */
export function getLibObj<L extends LibProperties>(libName: string, versionId: string, platform?: Platform): L {
  // 使用 getAppPlatform?.是为了 防止 peerDependencies 里用户还未升级最新版 hel-micro-core
  const platformVar = platform || getAppPlatform?.(libName);
  const appName2Lib = getSharedCache(platformVar).appName2Lib;
  if (!appName2Lib[libName]) {
    appName2Lib[libName] = {};
  }
  if (!appName2Lib[libName][versionId]) {
    appName2Lib[libName][versionId] = {};
  }
  return appName2Lib[libName][versionId] as L;
}

export function getLibProxy<L extends LibProperties>(libName: string, libObj: L, versionId: string, platform?: Platform): L {
  return new Proxy(libObj, {
    get(target, key) {
      const strKey = String(key);
      log(`[[getLibProxy]] call lib [${libName}] method [${strKey}]`);
      if (Object.keys(target).length) {
        return target[strKey];
      }
      // 支持 resetGlobalThis 后，也能够安全获取到模块
      const safeTarget = getLibObj(libName, versionId, platform);
      return safeTarget[strKey];
    },
  });
}
