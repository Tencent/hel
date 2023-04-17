import { useEffect, useRef } from 'react';
import { SKIP_CHECK_OBJ } from '../consts';
import { clearDep, getInternal, getRawState, recoverDep, updateDep, buildInsCtx } from '../helpers/common';
import type { Dict } from '../typing';
import { useObjectInner } from './useObject';

export function useSharedObject<T extends Dict = Dict>(sharedObject: T, enableReactive?: boolean): [T, (partialState: Partial<T>) => void] {
  const [state, setState] = useObjectInner(getRawState(sharedObject), { isStable: true, [SKIP_CHECK_OBJ]: true });
  const insCtxRef = useRef({
    keyMap: {} as any,
    compreKeyMap: {} as any,
    prevKeyMap: {} as any,
    insKey: 0,
    sharedState: state,
    reactiveUpdater: null as unknown as (partialState: Partial<T>) => void,
  });
  let sharedState = insCtxRef.current.sharedState;
  let reactiveUpdater = insCtxRef.current.reactiveUpdater;
  const internal = getInternal(sharedObject);

  if (!internal) {
    throw new Error('OBJ_NOT_SHARED_ERR: input object is not a result returned by createSharedObj!');
  }

  const keyMap = insCtxRef.current.keyMap;
  insCtxRef.current.prevKeyMap = keyMap;
  insCtxRef.current.keyMap = {}; // reset dep map

  if (!reactiveUpdater) {
    const ret = buildInsCtx(insCtxRef, { state, setState, internal, enableReactive });
    reactiveUpdater = ret.updater;
    sharedState = ret.proxyedState;
  }

  // start update dep in every render period
  useEffect(() => {
    updateDep(insCtxRef.current, internal);
  });

  useEffect(() => {
    const { keyMap, insKey } = insCtxRef.current;
    // recover dep and updater for double mount behavior under react strict mode
    recoverDep(insKey, { keyMap, internal, setState })
    return () => {
      clearDep(insKey, keyMap, internal);
    };
  }, []);

  return [sharedState, reactiveUpdater];
}
