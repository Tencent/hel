import type { IPlatformConfigFull } from 'hel-micro-core';
import { getPlatformConfig } from 'hel-micro-core';
import { isNull } from '../util';
import * as builtinFns from './builtin';

type PropName = keyof IPlatformConfigFull;

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
  const confVal: any = conf[key];
  // @ts-ignore
  const originVal = origin[key];
  if (!isNull(confVal)) {
    return confVal;
  }

  return originVal;
}
