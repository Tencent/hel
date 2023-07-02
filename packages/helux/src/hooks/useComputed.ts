import { useRef, useState, useEffect } from 'react';
import { ComputedResult, Dict, ComputedFn } from '../typing';
import { isFn, isObj } from '../utils';
import { hookApi, staticApi } from '../helpers/fndep';
import { buildInsComputedResult } from '../helpers/ins';
import { createComputedLogic } from '../factory/createComputed';
import { RENDER_END, RENDER_START, MOUNTED } from '../consts';
import { useForceUpdate } from './useForceUpdate';

const InvalidInputErr = new Error('ERR_NON_COMPUTED_FN_OR_RESULT: useComputed only accept a static computed result or computed fn');

export function useComputed<T extends Dict = Dict>(resultOrFn: ComputedResult<T> | ComputedFn<T>): T {
  const fnRef = useRef<any>(null);
  const updater = useForceUpdate();
  const [fnCtx] = useState(() => hookApi.buildFnCtx({ updater }));
  let needUnbox = false;

  if (!fnRef.current) {
    // 传入了局部的临时计算函数
    if (isFn(resultOrFn)) {
      fnRef.current = resultOrFn;
    } else if (isObj(resultOrFn)) {
      // 可能传入了静态计算函数
      // may a static computed result
      const result = resultOrFn;
      const upstreamFnCtx = staticApi.getFnCtxByObj(result);
      if (!upstreamFnCtx) {
        throw InvalidInputErr;
      }
      // 转移输入函数的依赖列表
      fnCtx.depKeys = upstreamFnCtx.depKeys.slice();
      // 包裹一层 hookVal，方便 createComputedLogic 对返回对象标记 fnKey
      fnRef.current = () => ({ hookVal: upstreamFnCtx.result });
      fnCtx.isResultWrapped = true;
      needUnbox = true;
    } else {
      throw InvalidInputErr;
    }
    createComputedLogic(fnRef.current, { scopeType: 'hook', fnCtxBase: fnCtx });

    const rawResult = needUnbox ? fnCtx.result.hookVal : fnCtx.result;
    fnCtx.proxyResult = buildInsComputedResult(rawResult, fnCtx);
  }

  fnCtx.isResultReaded = false;
  fnCtx.renderStatus = RENDER_START;

  useEffect(() => {
    fnCtx.renderStatus = RENDER_END;
  });

  useEffect(() => {
    fnCtx.mountStatus = MOUNTED;
    hookApi.recoverDep(fnCtx);
    return () => {
      hookApi.delFnCtx(fnCtx);
    };
  }, [fnCtx]);

  return fnCtx.proxyResult;
}
