import { useEffect, useRef } from 'react';
import { IS_SHARED, RENDER_END, RENDER_START, SKIP_MERGE } from '../consts';
import { clearDep, recoverDep, resetReadMap, updateDep } from '../helpers/dep';
import { getInternal, getRawState } from '../helpers/feature';
import { buildInsCtx } from '../helpers/ins';
import type { Dict } from '../typing';
import { useObjectLogic } from './useObject';

export function useShared<T extends Dict = Dict>(sharedObject: T, enableReactive?: boolean): [T, (partialState: Partial<T>) => void] {
  const rawState = getRawState(sharedObject);
  const [, setState] = useObjectLogic(rawState, { isStable: true, [IS_SHARED]: true, [SKIP_MERGE]: true });
  const { current: insCtx } = useRef({
    readMap: {} as any, // 当前渲染完毕所依赖的 key 记录
    readMapPrev: {} as any, // 上一次渲染完毕所依赖的 key 记录
    readMapStrict: null as any, // StrictMode 下辅助 resetDepMap 函数能够正确重置 readMapPrev 值
    insKey: 0,
    sharedState: rawState,
    updater: null as unknown as (partialState: Partial<T>) => void,
    renderStatus: RENDER_START,
  });
  insCtx.renderStatus = RENDER_START;
  let { sharedState, updater } = insCtx;
  const internal = getInternal(sharedObject);

  if (!internal) {
    throw new Error('ERR_OBJ_NOT_SHARED: input object is not a result returned by createShared');
  }

  resetReadMap(insCtx);
  if (!updater) {
    const ret = buildInsCtx(insCtx, { state: rawState, setState, internal, enableReactive });
    updater = ret.updater;
    sharedState = ret.proxyedState;
  }

  // start update dep in every render period
  useEffect(() => {
    insCtx.renderStatus = RENDER_END;
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

// alias of useShared for compatibility
export const useSharedObject = useShared;
