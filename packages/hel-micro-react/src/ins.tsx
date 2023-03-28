import { commonUtil, helConsts } from 'hel-micro-core';
import React, { forwardRef } from 'react';
import * as apis from './apis';

const { purify } = commonUtil;

// 无需处理的 key
const ignoreKeys = ['BuildInSkeleton', 'ShadowBody', 'ShadowView', 'LocalComp', 'useExecuteCallbackOnce', 'useForceUpdate'];
const compKeys = ['MicroApp', 'MicroAppLegacy', 'MicroAppLegacyMemo'];
// 这些函数第1位参数是平台值对象
const arg1PlatObjFns = ['renderApp'];

function injectCompPlat(Comp: any, platform: string) {
  return forwardRef((props: any, reactRef) => {
    const plat = props.platform || platform || helConsts.DEFAULT_PLAT;
    const newProps: any = { ...props, platform: plat };
    return <Comp ref={reactRef} {...newProps} />;
  });
}

function injectHookPlat(hookFn: any, platform: string) {
  return (...args: any[]) => {
    const [arg1, arg2, options = {}] = args;
    const newOptions: any = { platform, ...purify(options) };
    return hookFn(arg1, arg2, newOptions);
  };
}

function injectArg1Plat(fn: any, platform?: string) {
  return (...args: any[]) => {
    const [options = {}] = args;
    const newOptions: any = { platform, ...purify(options) };
    return fn(newOptions);
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
    if (compKeys.includes(key)) {
      newObj[key] = injectCompPlat(val, platform);
      return;
    }
    if (arg1PlatObjFns.includes(key)) {
      newObj[key] = injectArg1Plat(val, platform);
      return;
    }
    if (key.startsWith('use')) {
      newObj[key] = injectHookPlat(val, platform);
      return;
    }
    newObj[key] = val;
  });
  return newObj;
}

type Apis = typeof apis;
type CreateInstance = (platform: string) => HelMicroReactApis;
type HelMicroReactApis = Apis & { createInstance: CreateInstance };

export function createInstance(platform: string): HelMicroReactApis {
  const newApis = tryInectPlat(apis, platform);
  newApis.createInstance = createInstance;
  return newApis;
}
