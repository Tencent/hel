import {getAppPlatform, getSharedCache, log} from 'hel-micro-core';
import type {Platform} from 'hel-types';
import type {IOptions, LibProperties} from './typings';

export function getMergedOptions(options?: IOptions) {
  const defaultOptions = {
    allowDup: false,
    platform: options?.platform || 'unpkg'
  };
  return {...defaultOptions, ...(options || {})};
}

/**
 *
 * @param libName - 库名、应用组名
 * @param platform
 * @returns
 */
export function getLibObj<L extends LibProperties>(libName: string, platform?: Platform): L {
  // 使用 getAppPlatform?.是为了 防止 peerDependencies 里用户还未升级最新版 hel-micro-core
  const platformVar = platform || getAppPlatform?.(libName);
  const appName2Lib = getSharedCache(platformVar).appName2Lib;
  if (!appName2Lib[libName]) {
    appName2Lib[libName] = {};
  }
  return appName2Lib[libName] as L;
}

export function getLibProxy<L extends LibProperties>(libName: string, libObj: L): L {
  //@ts-ignore
  return new Proxy(libObj, {
    get(target, key) {
      const strKey = String(key);
      log(`[[getLibProxy]] call lib [${libName}] method [${strKey}]`);
      return target[strKey];
    }
  });
}
