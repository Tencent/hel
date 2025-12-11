import { KEYED_SHARED_KEY } from '../consts';
import { getKeyedSharedStoreName } from '../helpers/feature';
import { KEYED_SHARED_CTX_MAP } from '../helpers/keyedShared';
import { useKeyedShared } from '../hooks/useKeyedShared';
import { useShared } from '../hooks/useShared';
import type { Dict, ICreateOptionsType, SharedObject } from '../typing';
import { buildSharedObject } from './creator';

const noop = () => ({});

export function createSharedObject<T extends Dict = Dict>(rawState: T | (() => T), moduleName?: string): T {
  const [sharedState] = buildSharedObject(false, rawState, { moduleName, enableReactive: false });
  return sharedState;
}

export function createReactiveSharedObject<T extends Dict = Dict>(
  rawState: T | (() => T),
  moduleName?: string,
): [T, (partialState: Partial<T>) => void] {
  const [reactiveSharedState, reactiveSetState] = buildSharedObject(false, rawState, { moduleName, enableReactive: true });
  return [reactiveSharedState, reactiveSetState];
}

export function createSharedLogic<T extends Dict = Dict>(
  isKeyed: boolean,
  rawState: T | (() => T),
  strBoolOrCreateOptions?: ICreateOptionsType,
): {
  state: SharedObject<T>;
  call: <A extends any[] = any[]>(
    srvFn: (ctx: { args: A; state: T; setState: (partialState: Partial<T>) => void }) => Promise<Partial<T>> | Partial<T> | void,
    ...args: A
  ) => void;
  setState: (partialState: Partial<T>) => void;
  actions: Dict;
  useState: () => any;
  useStore: () => any;
  isKeyed: boolean;
} {
  const [sharedState, setState, actions] = buildSharedObject(isKeyed, rawState, strBoolOrCreateOptions);
  const useState = () => {
    const tuple = useShared(sharedState);
    return tuple;
  };
  const useStore = () => {
    const [state, setState] = useShared(sharedState);
    return { state, setState, actions, isKeyed };
  };

  return {
    state: sharedState,
    call: (srvFn, ...args) => {
      Promise.resolve(srvFn({ state: sharedState, setState, args })).then((partialState) => {
        partialState && setState(partialState);
      });
    },
    setState,
    actions,
    useState,
    useStore,
    isKeyed,
  };
}

export function createShared<T extends Dict = Dict>(
  rawState: T | (() => T),
  strBoolOrCreateOptions?: ICreateOptionsType,
): {
  state: SharedObject<T>;
  call: <A extends any[] = any[]>(
    srvFn: (ctx: { args: A; state: T; setState: (partialState: Partial<T>) => void }) => Promise<Partial<T>> | Partial<T> | void,
    ...args: A
  ) => void;
  setState: (partialState: Partial<T>) => void;
  actions: Dict;
  useState: () => any;
} {
  const ret = createSharedLogic(false, rawState, strBoolOrCreateOptions);
  return ret;
}

export function createKeyedShared<T extends Dict = Dict, R extends Dict = Dict>(
  stateFactory: () => T,
  options?: {
    actionsFactory?: (state: T, setState: (partialState: Partial<T>) => void) => R;
    moduleName?: string;
    lifecycle?: Dict;
  },
) {
  if (typeof stateFactory !== 'function') {
    throw new Error('state must be a function for createKeyedShared');
  }

  const { actionsFactory = noop, moduleName, lifecycle = {} } = options || {};
  let moduleNameVar = moduleName;
  if (!moduleNameVar) {
    moduleNameVar = getKeyedSharedStoreName();
  }

  const keyedShared: any = { stateFactory, actionsFactory, moduleName: moduleNameVar, lifecycle };
  keyedShared[KEYED_SHARED_KEY] = 1;

  const useState = (key: string) => {
    const { state, setState } = useKeyedShared(keyedShared, key);
    return [state, setState];
  };
  const useStore = (key: string) => {
    const insCtx = useKeyedShared(keyedShared, key);
    return insCtx;
  };

  return {
    getKeyedSharedCtx: (key: string) => {
      const moduleName = `${moduleNameVar}@${key}`;
      const ctx = KEYED_SHARED_CTX_MAP[moduleName] || null;
      return ctx;
    },
    keyedShared,
    useState,
    useStore,
    isKeyed: true,
  };
}
