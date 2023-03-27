import type { IPlatformConfigInitFull } from 'hel-micro-core';
import { commonUtil, getPlatformConfig } from 'hel-micro-core';
import type { IInnerPreFetchOptions } from '../types';
import * as builtinFns from './builtin';

const { isNull } = commonUtil;

type PropName = keyof IPlatformConfigInitFull;

export function getFn(platform: string | undefined, fnName: PropName, userFn?: any): any {
  const conf = getPlatformConfig(platform);
  const { origin } = conf;
  const confFn = conf[fnName];
  // @ts-ignore
  const originFn = origin[fnName];
  return userFn || confFn || originFn;
}

export function callFn(platform: string | undefined, fnName: PropName, params: any, userFn?: any): any {
  const fn = getFn(platform, fnName, userFn);
  if (fn) {
    return fn(params);
  }
  // @ts-ignore
  return builtinFns[fnName]?.(params);
}

export function getVal<T extends any = any>(platform: string | undefined, key: PropName, userVal?: any): T {
  if (!isNull(userVal)) {
    return userVal;
  }
  const conf = getPlatformConfig(platform);
  const { origin } = conf;

  // 优先返回 platInitOptions
  const confVal: any = conf[key];
  if (!isNull(confVal)) {
    return confVal;
  }

  // 最后返回 originInitOptions
  // @ts-ignore
  const originVal: any = origin[key];
  return originVal;
}

/**
 * 按下面 'getApiPrefix' 链接里描述的生成规则生成api域名前缀
 * @type {import('hel-micro-core').IControlPreFetchOptions['getApiPrefix']}
 * @param platform
 * @param loadOptions
 * @returns
 */
export function genApiPrefix(platform: string, loadOptions?: IInnerPreFetchOptions) {
  let prefix = '';
  if (loadOptions) {
    prefix = loadOptions.getApiPrefix?.() || loadOptions.apiPrefix;
  }
  if (prefix) {
    return prefix;
  }
  const conf = getPlatformConfig(platform);
  prefix = conf.getApiPrefix?.() || conf.apiPrefix;
  if (prefix) {
    return prefix;
  }
  const { origin } = conf;
  prefix = origin.getApiPrefix?.() || origin.apiPrefix;
  return prefix;
}
