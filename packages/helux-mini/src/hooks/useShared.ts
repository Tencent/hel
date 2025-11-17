import { useEffect, useRef } from 'react';
import { IS_SHARED, RENDER_END, RENDER_START, SKIP_MERGE } from '../consts';
import { clearDep, recoverDep, resetReadMap, updateDep } from '../helpers/dep';
import { getInternal, getRawState } from '../helpers/feature';
import { buildInsCtx } from '../helpers/ins';
import type { Dict } from '../typing';
import { useObjectLogic } from './useObject';

function extractOptions(options?: { actions?: Dict; enableReactive?: boolean }) {
  const optionsVar = { enableReactive: false, actions: {} };
  const optionsType = typeof options;

  if (optionsType === 'boolean') {
    // @ts-ignore
    optionsVar.enableReactive = options;
  } else if (options && optionsType === 'object') {
    Object.assign(optionsVar, options);
  }

  return optionsVar;
}

export function useShared<T extends Dict = Dict>(
  sharedObject: T,
  options: { actions?: Dict; enableReactive?: boolean },
): [T, (partialState: Partial<T>) => void] {
  const { enableReactive, actions } = extractOptions(options);

  // TODO  优化 sharedObject 变化的情况
  const rawState = getRawState(sharedObject);
  const [, setState] = useObjectLogic(rawState, { isStable: true, [IS_SHARED]: true, [SKIP_MERGE]: true });
  const { current: insCtx } = useRef({
    readMap: {} as any, // 当前渲染完毕所依赖的 key 记录
    readMapPrev: {} as any, // 上一次渲染完毕所依赖的 key 记录
    readMapStrict: null as any, // StrictMode 下辅助 resetDepMap 函数能够正确重置 readMapPrev 值
    insKey: 0,
    rawState,
    sharedState: null as unknown as T,
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
    internal.insCount += 1;
    if (internal.insCount === 1) {
      internal.lifecycle.beforeMount({ actions, state: sharedObject, setState });
    }
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
    // 注此处不能使用 internal.insCount === 1 来判定，多个组件同时挂载，进入此逻辑时 insCount 已大于1
    if (internal.insCount > 0 && !internal.lifecycleStats.isMountedCalled) {
      internal.lifecycle.mounted({ actions, state: sharedObject, setState });
      internal.lifecycleStats.isMountedCalled = true;
    }

    return () => {
      internal.insCount -= 1;
      if (internal.insCount === 0) {
        internal.lifecycle.willUnmount({ actions, state: sharedObject, setState });
        internal.lifecycleStats.isMountedCalled = false;
      }
      clearDep(insKey, readMap, internal);
    };
  }, [internal]);

  return [sharedState, updater];
}

// alias of useShared for compatibility
export const useSharedObject = useShared;
