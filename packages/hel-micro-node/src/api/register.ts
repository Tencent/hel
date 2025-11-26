import * as api from '../api';
import { printWarn } from '../base/logger';
import type { IRegisterPlatformConfig } from '../base/types';
import { maySet, maySetFn, purify, purifyFn } from '../base/util';
import { getSdkCtx } from '../context';

const platAt2ndObj = [
  'importHelMod',
  'importHelModByMeta',
  'importHelModByMetaSync',
  'getHelModMeta',
  'mockAutoDownload',
  'downloadHelModFiles',
];
const platAt1stObj = ['initMiddleware', 'preloadMiddleware', 'setPlatformConfig'];
const platAt3rdObj = ['importNodeModByPath', 'importHelModByPath'];
const mapNodeModsLike = ['mapNodeMods', 'mapAndPreload'];

function ensureObjPlat(platform: string, arg: any) {
  const newArg = { platform, ...(arg || {}) };
  return newArg;
}

function handleMapNodes(platform: string, modMapper: any, apiName: string) {
  const newMapper: any = {};
  Object.keys(modMapper).forEach((nodeModName) => {
    let val: any = modMapper[nodeModName];
    if (!val) {
      return;
    }
    const valType = typeof val;
    if (!['string', 'boolean', 'object'].includes(valType)) {
      return;
    }

    if (valType === 'string') {
      val = { helModName: val };
    } else if (valType === 'boolean') {
      // 自己映射自己
      val = { helModName: nodeModName };
    }
    newMapper[nodeModName] = { platform, ...purify(val) };
  });

  if (apiName === 'mapAndPreload') {
    return api.mapAndPreload(newMapper);
  }

  return api.mapNodeMods(newMapper);
}

/**
 * 注册平台信息并返回此平台对应的 api，此接口面向库开发者
 */
export function registerPlatform(config: IRegisterPlatformConfig) {
  const {
    platform: injectPlat,
    getMeta,
    getEnvInfo,
    registrationSource,
    beforePreloadOnce,
    helpackApiUrl,
    hooks = {},
    getSocketUrlWhenReconnect,
    socketHttpPingWhenTryReconnect,
  } = config;
  if (!injectPlat) {
    throw new Error('platform must be supplied');
  }

  const sdkCtx = getSdkCtx(injectPlat);
  if (sdkCtx.isActive) {
    printWarn(`platform ${injectPlat} already registered!`);
    return sdkCtx.api as typeof api;
  }

  sdkCtx.isActive = true;
  const isApiUrlSet = maySet(sdkCtx, 'helpackApiUrl', helpackApiUrl);
  if (isApiUrlSet) {
    sdkCtx.isApiUrlOverwrite = true;
  }

  maySetFn(sdkCtx, 'getMeta', getMeta);
  maySetFn(sdkCtx, 'getEnvInfo', getEnvInfo);
  maySet(sdkCtx, 'registrationSource', registrationSource);
  maySetFn(sdkCtx, 'beforePreloadOnce', beforePreloadOnce);
  maySetFn(sdkCtx, 'getSocketUrlWhenReconnect', getSocketUrlWhenReconnect);
  maySetFn(sdkCtx, 'socketHttpPingWhenTryReconnect', socketHttpPingWhenTryReconnect);
  Object.assign(sdkCtx.regHooks, purifyFn(hooks));

  const wrappedApi = { ...api };
  Object.keys(wrappedApi).forEach((key) => {
    if (mapNodeModsLike.includes(key)) {
      wrappedApi[key] = (modMapper) => handleMapNodes(injectPlat, modMapper, key);
      return;
    }

    if (platAt1stObj.includes(key)) {
      wrappedApi[key] = (arg1: any) => api[key](ensureObjPlat(injectPlat, arg1));
      return;
    }

    if (platAt2ndObj.includes(key)) {
      wrappedApi[key] = (arg1: any, arg2: any) => api[key](arg1, ensureObjPlat(injectPlat, arg2));
      return;
    }

    if (platAt3rdObj.includes(key)) {
      wrappedApi[key] = (arg1: any, arg2: any, arg3: any) => api[key](arg1, arg2, ensureObjPlat(injectPlat, arg3));
      return;
    }

    wrappedApi[key] = api[key];
  });

  sdkCtx.api = wrappedApi;
  return wrappedApi;
}
