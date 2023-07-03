import { useEffect, useRef, useState } from 'react';
import { MOUNTED, RENDER_END, RENDER_START } from '../consts';
import { createComputedLogic } from '../factory/createComputed';
import { hookApi, staticApi } from '../helpers/fndep';
import { buildInsComputedResult } from '../helpers/ins';
import { ComputedFn, ComputedResult, Dict } from '../typing';
import { isFn, isObj } from '../utils';
import { useForceUpdate } from './useForceUpdate';

const InvalidInputErr = new Error('ERR_NON_COMPUTED_FN_OR_RESULT: useComputed only accept a static computed result or computed fn');

export function useComputed<T extends Dict = Dict>(resultOrFn: ComputedResult<T> | ComputedFn<T>): T {
  const fnRef = useRef<any>(null);
  const updater = useForceUpdate();
  const [fnCtx] = useState(() => hookApi.buildFnCtx({ updater }));

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
      // 做结果中转
      fnRef.current = () => upstreamFnCtx.result;
    } else {
      throw InvalidInputErr;
    }
    createComputedLogic(fnRef.current, { scopeType: 'hook', fnCtxBase: fnCtx });

    fnCtx.proxyResult = buildInsComputedResult(fnCtx);
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
