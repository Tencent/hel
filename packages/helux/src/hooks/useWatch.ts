import { useRef, useEffect, useState } from 'react';
import { ComputedResult, Dict, ComputedFn } from '../typing';
import { isFn } from '../utils';
import { MOUNTED } from '../consts';
import { hookApi } from '../helpers/fndep';
import { createWatchLogic } from '../factory/createWatch';

export function useWatch<T extends Dict = Dict>(watchFn: ComputedResult<T> | ComputedFn<T>) {
  const fnRef = useRef<any>(null);
  const [fnCtx] = useState(() => hookApi.buildFnCtx());

  if (!fnRef.current) {
    // 传入了局部的自定义观察函数
    if (!isFn(watchFn)) {
      throw new Error('ERR_NON_WATCH_FN: useWatch only accept function');
    }
    fnRef.current = watchFn;
    createWatchLogic(fnRef.current, { scopeType: 'hook', fnCtxBase: fnCtx });
  }

  useEffect(() => {
    fnCtx.mountStatus = MOUNTED;
    hookApi.recoverDep(fnCtx);
    return () => {
      hookApi.delFnCtx(fnCtx);
    };
  }, [fnCtx]);
}
