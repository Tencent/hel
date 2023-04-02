import { commonUtil } from 'hel-micro-core';
import * as apis from './apis';

const { purify } = commonUtil;

// 无需处理的 key
const ignoreKeys = ['isMasterApp', 'isSubApp', 'eventBus'];
const arg3PlatKeys = ['appReady', 'libReady'];

function makePlatObj(platform, arg: any) {
  if (arg && typeof arg === 'object') {
    const newOptions: any = { platform, ...purify(arg) };
    return newOptions;
  }
  return arg;
}

function injectArg2Plat(fn: any, platform: string, considerStr?: boolean) {
  return (...args: any[]) => {
    const [arg1, arg2] = args;
    if (considerStr && typeof arg2 === 'string') {
      return fn(arg1, arg2 || platform);
    }
    return fn(arg1, makePlatObj(platform, arg2));
  };
}

function injectArg3Plat(fn: any, platform: string) {
  return (...args: any[]) => {
    const [arg1, arg2, options = {}] = args;
    return fn(arg1, arg2, makePlatObj(platform, options));
  };
}

function tryInectPlat(obj: any, platform: string) {
  const newObj: any = {};
  Object.keys(obj).forEach((key) => {
    // @ts-ignore
    const val = obj[key];
    if (ignoreKeys.includes(key)) {
      newObj[key] = val;
      return;
    }
    if (arg3PlatKeys.includes(key)) {
      newObj[key] = injectArg3Plat(val, platform);
      return;
    }
    const considerStr = key === 'exposeLib';
    newObj[key] = injectArg2Plat(val, platform, considerStr);
  });
  return newObj;
}

type Apis = typeof apis;
// eslint-disable-next-line
type CreateInstance = (platform: string) => LibProxyApis;
type LibProxyApis = Apis & { createInstance: CreateInstance };

export function createInstance(platform: string): LibProxyApis {
  const newApis = tryInectPlat(apis, platform);
  newApis.createInstance = createInstance;
  return newApis;
}
