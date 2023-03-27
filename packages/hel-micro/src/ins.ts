import { commonUtil, IControlPreFetchOptions, IPlatformConfigInitFull, originInit } from 'hel-micro-core';
import * as apis from './apis';

const { purify } = commonUtil;

interface IInjectOptions {
  fnName: string;
  fn: any;
  preFetchOptions?: Partial<IControlPreFetchOptions>;
  isCore?: boolean;
}

// 无需处理的 key
const ignoreKeys = ['eventBus', 'getExtraData', 'setExtraData', 'bindExternals', 'bindVueRuntime', 'bindReactRuntime'];
// core 层面函数处理规则
const coreRules = {
  // 不需要处理的
  ignoreFns: ['tryGetAppName', 'log', 'commonUtil'],
  // 这些函数仅1个参数，第1位参数是平台值
  arg1PlatFns: ['getPlatformConfig', 'getSharedCache'],
  // 这些函数共2个参数，第2位参数是平台值
  arg2PlatFns: ['initPlatformConfig', 'getAppMeta', 'setAppMeta', 'tryGetVersion', 'setAppPlatform'],
};
// 这些函数共2个参数，第2位参数是包含平台值的对象或版本号，且需要注入 semverApi 值
const preFetchFns = ['preFetchLib', 'preFetchApp'];
// 这些函数第1位参数是平台值对象
const arg1PlatObjFns = ['emitApp', 'init'];

function injectPlat(platform: string, injectOptions: IInjectOptions) {
  const { fnName, fn, isCore, preFetchOptions } = injectOptions;
  return (...args: any[]) => {
    const mergePlatObj = (obj: any) => ({ platform, ...purify(obj || {}) });
    const [arg0, arg1, arg2] = args;

    if (isCore) {
      if (fnName === 'getPlatform') {
        // 来自 createInstace 实例调用，则返回的是对应的自定义平台
        return platform;
      }

      if (coreRules.arg1PlatFns.includes(fnName)) {
        args[0] = arg0 || platform;
      } else if (coreRules.arg2PlatFns.includes(fnName)) {
        args[1] = arg1 || platform;
      } else if (!coreRules.ignoreFns.includes(fnName)) {
        if (fnName.startsWith('set')) {
          // 统一按第3位参数是包含平台值的对象来处理
          args[2] = mergePlatObj(arg2);
        } else {
          // 统一按第2位参数是包含平台值的对象来处理，对于 getGlobalThis 等内部仅使用第一位参数的函数，处理了也不影响
          args[1] = mergePlatObj(arg1);
        }
      }
      // 剩下的 core 函数无需处理
    } else {
      // 开始处理非 core 层面的函数
      if (fnName === 'batchPreFetchLib') {
        // 特殊处理 batchPreFetchLib
        const arg1Var = arg1 || {};
        const common = mergePlatObj(arg1Var.common);
        args[1] = { ...arg1Var, common };
      } else if (preFetchFns.includes(fnName)) {
        let toMerge = purify(typeof arg1 === 'string' ? { versionId: arg1 } : arg1 || {});
        // 继续处理来自 createInstance 的预设参数
        if (preFetchOptions) {
          toMerge = purify({ ...preFetchOptions, ...toMerge });
        }
        args[1] = { platform, ...toMerge };
      } else if (arg1PlatObjFns.includes(fnName)) {
        args[0] = mergePlatObj(arg0);
      } else {
        // 剩余的统一按第2位参数是包含平台值的对象来处理
        args[1] = mergePlatObj(arg1);
      }
    }
    // @ts-ignore
    return fn.apply(this, args);
  };
}

interface ITryOptions {
  preFetchOptions?: Partial<IControlPreFetchOptions>;
  isCore?: boolean;
}

function tryInectPlatForMethods(platform: string, obj: any, options: ITryOptions) {
  const { preFetchOptions, isCore } = options;
  const newObj: any = {};
  Object.keys(obj).forEach((mayFnName) => {
    // @ts-ignore
    const mayFn = apis[mayFnName];
    if (ignoreKeys.includes(mayFnName)) {
      newObj[mayFnName] = mayFn;
      return;
    }
    const valueType = typeof mayFn;
    if (valueType === 'function') {
      const injectOptions: IInjectOptions = { fnName: mayFnName, fn: mayFn, isCore, preFetchOptions };
      newObj[mayFnName] = injectPlat(platform, injectOptions);
      return;
    }
    if (mayFn && valueType === 'object') {
      const tryOptions = { ...options, isCore: mayFnName === 'core' };
      newObj[mayFnName] = tryInectPlatForMethods(platform, mayFn, tryOptions);
      return;
    }
    newObj[mayFnName] = mayFn;
  });

  return newObj;
}

type Apis = typeof apis;
type CreateInstance = (platform: string, options?: Partial<IControlPreFetchOptions>) => InsApis;
type CreateOriginInstance = (platform: string, options?: Partial<IPlatformConfigInitFull>) => InsApis;
type InsApis = Apis & { createInstance: CreateInstance; createOriginInstance: CreateOriginInstance };

export function createInstance(platform: string, preFetchOptions?: Partial<IControlPreFetchOptions>): InsApis {
  const insApis = tryInectPlatForMethods(platform, apis, { preFetchOptions });
  insApis.createInstance = createInstance;
  insApis.createOriginInstance = createOriginInstance;
  return insApis;
}

export function createOriginInstance(platform: string, originOptions?: Partial<IPlatformConfigInitFull>): InsApis {
  const { trustAppNames, ...preFetchOptions } = originOptions || {};
  originInit(platform, originOptions);
  return createInstance(platform, preFetchOptions);
}
