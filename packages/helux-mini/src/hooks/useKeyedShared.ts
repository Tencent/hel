import { KEYED_SHARED_KEY } from '../consts';
import { KEYED_SHARED_CTX_MAP } from '../helpers/keyedShared';
import { createShared } from '../factory/createShared';
import type { Dict } from '../typing';
import { useShared } from './useShared';

export function useKeyedShared<T extends Dict = Dict>(
  keyedShared: T,
  key: string,
): { state: T, setState: (partialState: Partial<T>) => void, actions: any } {
  if (!keyedShared[KEYED_SHARED_KEY]) {
    throw new Error('ERR_OBJ_NOT_KEYED_SHARED: can not pass a non-keyedShared obj to useKeyedShared!');
  }

  const { storeName } = keyedShared;
  const moduleName = `${storeName}@${key}`;
  let keyedSharedCtx = KEYED_SHARED_CTX_MAP[moduleName];
  if (!keyedSharedCtx) {
    const { stateFactory, actionsFactory, lifecycle } = keyedShared;
    const oriState = { ...stateFactory(), key };
    const { state, setState } = createShared(oriState, { moduleName, lifecycle });
    const actions = actionsFactory(state, setState);
    keyedSharedCtx = { state, setState, actions };
    KEYED_SHARED_CTX_MAP[moduleName] = keyedSharedCtx;
  }
  const { actions } = keyedSharedCtx;
  const [state, setState] = useShared(keyedSharedCtx.state, { actions });
  const keySharedInsCtx = { state, setState, actions };

  return keySharedInsCtx;
}
