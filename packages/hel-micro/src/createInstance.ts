import type { IIncetanceOptions } from './types';
import * as apis from './apis';

// 这些函数仅1个参数，第1位参数是平台值
const arg1PlatFns = ['getPlatformConfig', 'getPlatformHost', 'getSharedCache'];
// 这些函数共2个参数，第2位参数是平台值
const arg2PlatFns = ['initPlatformConfig', 'getAppMeta', 'setAppMeta', 'tryGetVersion', 'setAppPlatform'];
// 这些函数共2个参数，第2位参数是包含平台值的对象
const arg2PlatObjFns = ['setEmitLib'];
// 这些函数共2个参数，第2位参数是包含平台值的对象或版本号
const arg2VerOrPlatObjFns = ['preFetchLib', 'preFetchApp'];
// 这些函数共3个参数，第3位参数是包含平台值的对象
const arg3PlatObjFns = ['setVersion'];

function injectPlat(platform: string, fnName: string, fn: any) {
  return (...args: any[]) => {
    if (arg1PlatFns.includes(fnName)) {
      args[0] = args[0] || platform;
    } else if (arg2PlatFns.includes(fnName)) {
      args[1] = args[1] || platform;
    } else if (arg2VerOrPlatObjFns.includes(fnName)) {
      const lastArg = args[1];
      const lastArgType = typeof lastArg;
      args[1] = { platform, ...(lastArgType === 'string' ? { versionId: lastArg } : lastArg || {}) };
    } else if (arg2PlatObjFns.includes(fnName)) {
      args[1] = { platform, ...(args[1] || {}) };
    } else if (arg3PlatObjFns.includes(fnName)) {
      args[2] = { platform, ...(args[2] || {}) };
    }

    // @ts-ignore
    return fn.apply(this, args);
  };
}

function tryInectPlatForMethods(platform: string, obj: any) {
  const newObj: any = {};
  Object.keys(obj).forEach((key) => {
    // @ts-ignore
    const value = apis[key];
    const valueType = typeof value;
    if (valueType === 'function') {
      newObj[key] = injectPlat(platform, key, value);
      return;
    }
    if (valueType === 'object') {
      newObj[key] = tryInectPlatForMethods(platform, value);
      return;
    }
    newObj[key] = value;
  });

  return newObj;
}

type Apis = typeof apis;
type CreateInstance = (platform: string, options?: IIncetanceOptions) => AllApis;
type AllApis = Apis & { createInstance: CreateInstance }

export default function createInstance(platform: string, options?: IIncetanceOptions): AllApis {
  const newApis = tryInectPlatForMethods(platform, apis);
  newApis.createInstance = createInstance;
  return newApis;
}
