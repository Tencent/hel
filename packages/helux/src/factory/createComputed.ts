import { hookApi, recordFnDep, staticApi } from '../helpers/fndep';
import { createOb, injectHeluxProto } from '../helpers/obj';
import type { Dict, IFnCtx, IFnParams } from '../typing';
import { isFn, isObj, isPromise, warn } from '../utils';

export function createComputedLogic<T extends Dict = Dict>(
  computedFn: (params: IFnParams) => T,
  options: { scopeType: 'static' | 'hook'; fnCtxBase?: IFnCtx },
): IFnCtx {
  const { scopeType, fnCtxBase } = options;
  const isStatic = scopeType === 'static';
  const api = isStatic ? staticApi : hookApi;

  if (!isFn(computedFn)) {
    throw new Error('ERR_NON_FN: pass an non-function to createComputed!');
  }

  const fnCtx = api.mapFn(computedFn, 'computed', fnCtxBase);
  const result = computedFn({ isFirstCall: true });
  api.delRunninFnKey();
  if (!isObj(result) || isPromise(result)) {
    throw new Error('ERR_NON_OBJ: return an non-object from createComputed!');
  }

  // 特殊处理计算结果中转行为
  // const cu1 = createComputed(...);
  // const cu2 = createComputed(()=>cu1); // 此处产生结果中转
  const upstreamFnCtx = api.getFnCtxByObj(result);
  if (upstreamFnCtx) {
    // 关联上下游函数
    fnCtx.depKeys = upstreamFnCtx.depKeys.slice();
    fnCtx.isUpstreamResult = true;
    upstreamFnCtx.downstreamFnKeys.push(fnCtx.fnKey);
  }

  if (!fnCtx.isUpstreamResult) {
    // 给 result 和 fn 标记相同的 key
    injectHeluxProto(result);
    api.markFnKey(result, fnCtx.fnKey);
  }

  fnCtx.result = result;
  return fnCtx;
}

export function createComputed<T extends Dict = Dict>(computedFn: (params: IFnParams) => T): T {
  const fnCtx = createComputedLogic<T>(computedFn, { scopeType: 'static' });
  if (fnCtx.isUpstreamResult) {
    return fnCtx.result;
  }

  const proxyResult = createOb(
    fnCtx.result,
    // setter
    () => {
      warn('changing computed result is invalid');
      return false;
    },
    // getter
    (target: Dict, key: any) => {
      // copy dep keys
      recordFnDep(fnCtx.depKeys);
      return target[key];
    },
  );

  return proxyResult;
}
