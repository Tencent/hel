import { originInit, commonUtil } from 'hel-micro-core';
import * as apis from './apis';
import type { ICreateInstanceOptions } from './types';

interface IInjectOptions {
  semverApi: boolean;
  isCore?: boolean;
}

// 无需处理的 key
const ignoreKeys = ['eventBus', 'getExtraData', 'setExtraData', 'bindExternals', 'bindVueRuntime', 'bindReactRuntime'];
// core 层面函数处理规则
const coreRules = {
  // 不需要处理的
  ignoreFns: ['tryGetAppName', 'log', 'commonUtil'],
  // 这些函数仅1个参数，第1位参数是平台值
  arg1PlatFns: ['getPlatformConfig', 'getPlatformHost', 'getSharedCache'],
  // 这些函数共2个参数，第2位参数是平台值
  arg2PlatFns: ['initPlatformConfig', 'getAppMeta', 'setAppMeta', 'tryGetVersion', 'setAppPlatform'],
};
// 这些函数共2个参数，第2位参数是包含平台值的对象或版本号，且需要注入 semverApi 值
const preFetchFns = ['preFetchLib', 'preFetchApp'];
// 这些函数第1位参数是平台值对象
const arg1PlatObjFns = ['emitApp', 'init'];

function injectPlat(platform: string, fnName: string, fn: any, options: IInjectOptions) {
  const { semverApi, isCore } = options;
  return (...args: any[]) => {
    const mergePlatObj = (obj: any) => ({ platform, ...commonUtil.purify(obj || {}) });
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
        args[1] = { platform, semverApi, ...(typeof arg1 === 'string' ? { versionId: arg1 } : arg1 || {}) };
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

function tryInectPlatForMethods(platform: string, obj: any, options: IInjectOptions) {
  const newObj: any = {};
  const { semverApi } = options;
  Object.keys(obj).forEach((mayFnName) => {
    // @ts-ignore
    const mayFn = apis[mayFnName];
    if (ignoreKeys.includes(mayFnName)) {
      newObj[mayFnName] = mayFn;
      return;
    }
    const valueType = typeof mayFn;
    if (valueType === 'function') {
      newObj[mayFnName] = injectPlat(platform, mayFnName, mayFn, options);
      return;
    }
    if (mayFn && valueType === 'object') {
      newObj[mayFnName] = tryInectPlatForMethods(platform, mayFn, { semverApi, isCore: mayFnName === 'core' });
      return;
    }
    newObj[mayFnName] = mayFn;
  });

  return newObj;
}

type Apis = typeof apis;
type CreateInstance = (platform: string, options?: ICreateInstanceOptions) => AllApis;
type AllApis = Apis & { createInstance: CreateInstance };

export default function createInstance(platform: string, options?: ICreateInstanceOptions): AllApis {
  const { semverApi = true, ...originInitOptions } = options || {};
  originInit(platform, originInitOptions);
  const newApis = tryInectPlatForMethods(platform, apis, { semverApi });
  newApis.createInstance = createInstance;
  return newApis;
}
