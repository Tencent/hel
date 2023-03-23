import * as apis from './apis';

// 这些函数最后一位参数是 string 时，作为版本号处理
const versionIdFns = ['preFetchLib', 'preFetchApp'];
// 这些函数参数无平台值，可忽略处理
const ingoreFns = ['log', 'allowLog', 'getGlobalThis', 'setGlobalThis', 'resetGlobalThis', 'getAppPlatform', 'tryGetAppName', 'isSubApp'];
// 这些函数最后一位是平台值字符串
const platStrFns = ['getPlatformConfig', 'initPlatformConfig', 'getAppMeta', 'setAppMeta', 'tryGetVersion', 'setAppPlatform'];

function injectPlat(platform: string, fnName: string, fn: any) {
  return (...args: any[]) => {
    if (ingoreFns.includes(fnName)) {
      return fn.apply(this, args);
    }

    const lastIndex = args.length - 1;
    const lastArg = args[lastIndex];
    const lastArgType = typeof lastArg;
    if (platStrFns.includes(fnName)) {
      args[lastIndex] = lastArg || platform;
    } else if (versionIdFns.includes(fnName)) {
      args[lastIndex] = { platform, ...(lastArgType === 'string' ? { versionId: lastArg } : lastArg || {}) };
    } else {
      args[lastIndex] = { platform, ...(lastArg || {}) };
    }

    return fn.apply(this, args);
  };
}

function tryInectPlatForMethods(platform: string, obj: any) {
  const newObj: any = {};
  Object.keys(obj).forEach((key) => {
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

export default function createInstance(platform: string): typeof apis {
  const newApis = tryInectPlatForMethods(platform, apis);
  newApis.createInstance = createInstance;
  return newApis;
}
