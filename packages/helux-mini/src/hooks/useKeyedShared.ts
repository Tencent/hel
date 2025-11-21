import { KEYED_SHARED_KEY } from '../consts';
import { createSharedLogic } from '../factory/createShared';
import { KEYED_SHARED_CTX_MAP } from '../helpers/keyedShared';
import type { Dict } from '../typing';
import { useShared } from './useShared';

export function useKeyedShared<T extends Dict = Dict>(
  keyedShared: T,
  key: string,
): { state: T; setState: (partialState: Partial<T>) => void; actions: any } {
  if (!keyedShared[KEYED_SHARED_KEY]) {
    throw new Error('ERR_OBJ_NOT_KEYED_SHARED: can not pass a non-keyedShared obj to useKeyedShared!');
  }

  // 用户传的 moduleName 仅作为 moduleNamePrefix 用，内部使用的完整 moduleName 如下
  const moduleName = `${keyedShared.moduleName}@${key}`;
  let keyedSharedCtx = KEYED_SHARED_CTX_MAP[moduleName];
  if (!keyedSharedCtx) {
    const { stateFactory, actionsFactory, lifecycle } = keyedShared;
    const oriState = { ...stateFactory(), key };
    const { state, setState, actions } = createSharedLogic(true, oriState, { moduleName, lifecycle, actionsFactory });
    keyedSharedCtx = { state, setState, actions };
    KEYED_SHARED_CTX_MAP[moduleName] = keyedSharedCtx;
  }
  const { actions } = keyedSharedCtx;
  const [state, setState] = useShared(keyedSharedCtx.state);
  const keySharedInsCtx = { state, setState, actions, isKeyed: true };

  return keySharedInsCtx;
}
