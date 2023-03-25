import type { IPlatformConfigInitFull } from 'hel-micro-core';
import { getPlatformConfig, commonUtil } from 'hel-micro-core';
import * as builtinFns from './builtin';

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
  if (!commonUtil.isNull(userVal)) {
    return userVal;
  }
  const conf = getPlatformConfig(platform);
  const { origin } = conf;
  const confVal: any = conf[key];
  // @ts-ignore
  const originVal: any = origin[key];
  if (!commonUtil.isNull(confVal)) {
    return confVal;
  }

  return originVal;
}
