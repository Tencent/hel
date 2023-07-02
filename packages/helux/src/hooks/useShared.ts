import { useEffect, useState } from 'react';
import { IS_SHARED, MOUNTED, RENDER_END, RENDER_START, SKIP_MERGE } from '../consts';
import { buildInsCtx } from '../helpers/ins';
import { clearDep, recoverDep, resetReadMap, updateDep } from '../helpers/insdep';
import { getRawState } from '../helpers/state';
import type { Dict } from '../typing';
import { useObjectLogic } from './useObject';

export function useShared<T extends Dict = Dict>(sharedObject: T, enableReactive?: boolean): [T, (partialState: Partial<T>) => void] {
  const rawState = getRawState(sharedObject);
  const [, setState] = useObjectLogic(rawState, { isStable: true, [IS_SHARED]: true, [SKIP_MERGE]: true });
  const [insCtx] = useState(() => buildInsCtx({ setState, sharedState: sharedObject, enableReactive }));
  insCtx.renderStatus = RENDER_START;
  resetReadMap(insCtx);

  // start update dep in every render period
  useEffect(() => {
    insCtx.renderStatus = RENDER_END;
    updateDep(insCtx);
  });

  useEffect(() => {
    insCtx.mountStatus = MOUNTED;
    // recover dep and updater for double mount behavior under react strict mode
    recoverDep(insCtx);
    return () => {
      clearDep(insCtx);
    };
  }, [insCtx]);

  const { internal, proxyState } = insCtx;
  return [proxyState, internal.setState];
}

// alias of useShared for compatibility
export const useSharedObject = useShared;
