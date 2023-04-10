import type { IControlPreFetchOptions, IPlatformConfigInitFull, NullDef } from 'hel-micro-core';
import { commonUtil, getPlatformConfig } from 'hel-micro-core';
import type { IInnerPreFetchOptions } from '../types';
import * as builtinFns from './builtin';

const { isNull } = commonUtil;

export type KeyName = keyof IPlatformConfigInitFull;
export type Hook = IPlatformConfigInitFull['hook'];
export type HookKey = keyof Hook;
export type PreFetchKey = keyof IControlPreFetchOptions;

export function getFn(platform: string | undefined, fnName: KeyName, userFn?: any): any {
  const conf = getPlatformConfig(platform);
  const { origin } = conf;
  const confFn = conf[fnName];
  // @ts-ignore
  const originFn = origin[fnName];
  return userFn || confFn || originFn;
}

export function callFn(platform: string | undefined, fnName: KeyName, params: any, userFn?: any): any {
  const fn = getFn(platform, fnName, userFn);
  if (fn) {
    return fn(params);
  }
  // @ts-ignore
  const builtinFn = builtinFns[fnName] || (() => null);
  return builtinFn(params);
}

export function getVal<T extends any = any>(platform: string | undefined, key: KeyName, valPair?: any[], nullDef?: NullDef): T {
  const [userVal, defautVal] = valPair || [];
  if (!isNull(userVal, nullDef)) {
    return userVal;
  }
  const conf = getPlatformConfig(platform);
  const { origin } = conf;

  // 优先返回 platInitOptions
  const confVal: any = conf[key];
  if (!isNull(confVal, nullDef)) {
    return confVal;
  }

  // 最后返回 originInitOptions
  // @ts-ignore
  const originVal: any = origin[key];
  if (!isNull(originVal, nullDef)) {
    return originVal;
  }

  return defautVal;
}

export function getHookFn<Key extends HookKey>(loadOptions: IInnerPreFetchOptions, hookKey: Key): Hook[Key] {
  const conf = getPlatformConfig(loadOptions.platform);
  const userHook: Hook = loadOptions.hook || {};
  const { origin, hook } = conf;
  return userHook[hookKey] || hook[hookKey] || origin.hook?.[hookKey];
}

/**
 * 按下面 'getApiPrefix' 链接里描述的生成规则生成api域名前缀
 * @type {import('hel-micro-core').IControlPreFetchOptions['getApiPrefix']}
 * @param platform
 * @param loadOptions
 * @returns
 */
export function genApiPrefix(platform: string | undefined, loadOptions?: IInnerPreFetchOptions) {
  let prefix: any = '';
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
