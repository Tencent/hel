import { commonUtil } from 'hel-micro-core';
import * as apis from './apis';

const { purify } = commonUtil;

interface IInjectOptions {
  fnName: string;
  fn: any;
}


function injectPlat(platform: string, injectOptions: IInjectOptions) {
  const { fn } = injectOptions;
  return (...args: any[]) => {
    const mergePlatObj = (obj: any) => ({ platform, ...purify(obj || {}) });
    const [, arg1] = args;
    args[1] = mergePlatObj(arg1);
    // @ts-ignore
    return fn.apply(this, args);
  };
}

function tryInectPlatForMethods(platform: string, obj: any) {
  const newObj: any = {};
  Object.keys(obj).forEach((mayFnName) => {
    // @ts-ignore
    const mayFn = obj[mayFnName];
    const valueType = typeof mayFn;
    if (valueType === 'function') {
      const injectOptions: IInjectOptions = { fnName: mayFnName, fn: mayFn };
      newObj[mayFnName] = injectPlat(platform, injectOptions);
      return;
    }
    newObj[mayFnName] = mayFn;
  });

  return newObj;
}

type Apis = typeof apis;
type CreateInstance = (platform: string) => InsApis;
type InsApis = Apis & {
  createInstance: CreateInstance;
  default: InsApis;
};

/**
 * 预设获取参数自定义api实例，之后调用的api实例将总是自动带上用户的预设参数作为兜底参数
 * @returns
 */
export function createInstance(platform: string): InsApis {
  const insApis = tryInectPlatForMethods(platform, apis);
  insApis.createInstance = createInstance;
  insApis.default = insApis;
  return insApis;
}
