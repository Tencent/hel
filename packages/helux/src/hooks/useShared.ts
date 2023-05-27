import { useEffect, useRef } from 'react';
import { SKIP_CHECK_OBJ } from '../consts';
import { clearDep, recoverDep, resetReadMap, updateDep } from '../helpers/dep';
import { getInternal, getRawState } from '../helpers/feature';
import { buildInsCtx } from '../helpers/ins';
import type { Dict } from '../typing';
import { useObjectInner } from './useObject';

export function useShared<T extends Dict = Dict>(sharedObject: T, enableReactive?: boolean): [T, (partialState: Partial<T>) => void] {
  const [state, setState] = useObjectInner(getRawState(sharedObject), { isStable: true, [SKIP_CHECK_OBJ]: true });
  const { current: insCtx } = useRef({
    readMap: {} as any, // 当前渲染完毕所依赖的 key 记录
    readMapPrev: {} as any, // 上一次渲染完毕所依赖的 key 记录
    readMapStrict: null as any, // StrictMode 下辅助 resetDepMap 函数能够正确重置 readMapPrev 值
    insKey: 0,
    sharedState: state,
    updater: null as unknown as (partialState: Partial<T>) => void,
  });
  let { sharedState, updater } = insCtx;
  const internal = getInternal(sharedObject);

  if (!internal) {
    throw new Error('OBJ_NOT_SHARED_ERR: input object is not a result returned by createSharedObj!');
  }

  resetReadMap(insCtx);
  if (!updater) {
    const ret = buildInsCtx(insCtx, { state, setState, internal, enableReactive });
    updater = ret.updater;
    sharedState = ret.proxyedState;
  }

  // start update dep in every render period
  useEffect(() => {
    updateDep(insCtx, internal);
  });

  useEffect(() => {
    const { readMap, insKey } = insCtx;
    // recover dep and updater for double mount behavior under react strict mode
    recoverDep(insKey, { readMap, internal, setState });
    return () => {
      clearDep(insKey, readMap, internal);
    };
  }, []);

  return [sharedState, updater];
}

// alias of useShared
export const useSharedObject = useShared;
