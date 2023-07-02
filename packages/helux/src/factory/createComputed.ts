import type { Dict, IFnParams, IFnCtx } from '../typing';
import { isObj, isFn, isPromise, warn } from '../utils';
import { staticApi, hookApi, recordFnDep } from '../helpers/fndep';
import { createOb, injectHeluxProto } from '../helpers/obj';

export function createComputedLogic<T extends Dict = Dict>(
  computedFn: (params: IFnParams) => T,
  options: { scopeType: 'static' | 'hook', fnCtxBase?: IFnCtx },
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

  // 给 result 和 fn 标记相同的 key
  injectHeluxProto(result)
  api.markFnKey(result, fnCtx.fnKey);

  fnCtx.result = result;
  return fnCtx;
}

export function createComputed<T extends Dict = Dict>(computedFn: (params: IFnParams) => T): T {
  const fnCtx = createComputedLogic<T>(computedFn, { scopeType: 'static' });
  const proxyResult = createOb(fnCtx.result,
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

