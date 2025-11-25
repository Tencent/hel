import type { IHMNHooks, THookType } from '../base/types';
import { noop, purifyFn } from '../base/util';
import { getSdkCtx } from './index';

let isAddBizHooksCalled = false;

export function addBizHooks(hooks: IHMNHooks, platform?: string) {
  if (isAddBizHooksCalled) {
    return false;
  }

  const sdkCtx = getSdkCtx(platform);
  Object.assign(sdkCtx.bizHooks, purifyFn(hooks));
  isAddBizHooksCalled = true;
  return true;
}

export function triggerHook(hookType: THookType, params: any, platform?: string) {
  const { regHooks, confHooks, bizHooks } = getSdkCtx(platform);
  regHooks[hookType](params);
  confHooks[hookType](params);
  bizHooks[hookType](params);
}

export function isHookValid(hookType: THookType, platform?: string) {
  const { regHooks, confHooks, bizHooks } = getSdkCtx(platform);
  return regHooks[hookType] !== noop || confHooks[hookType] !== noop || bizHooks[hookType] !== noop;
}
