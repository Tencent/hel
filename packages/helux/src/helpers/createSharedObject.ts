import type { Dict, SharedObject } from '../typing';

const InternalSymbol = Symbol('HeluxInternal');
const RawStateSymbol = Symbol('HeluxRawState');

export function getInternal(state: any) {
  return state.__proto__[InternalSymbol];
}

export function getRawState(state: any) {
  return state.__proto__[RawStateSymbol] || state;
}

function bindInternal(state: any, internal: any) {
  state.__proto__[InternalSymbol] = internal;
}

function bindRawState(state: any, rawState: any) {
  state.__proto__[RawStateSymbol] = rawState;
}

function innerCreateSharedObject<T extends Dict = Dict>(
  stateOrStateFn: T | (() => T),
  enableReactive?: boolean,
): [T, (partialState: Partial<T>) => void] {
  let rawState = stateOrStateFn as T;
  if (typeof stateOrStateFn === 'function') {
    rawState = stateOrStateFn();
  }
  let sharedState = rawState;

  if (enableReactive) {
    // TODO: downgrade to defineProperty
    sharedState = new Proxy(rawState, {
      set(target, key, val) {
        // @ts-ignore
        rawState[key] = val;
        if (enableReactive) {
          getInternal(sharedState).setState({ [key]: val });
        }
        return true;
      },
    });
    bindRawState(sharedState, rawState);
  } else {
    sharedState = rawState;
  }

  const insKey2Updater: Record<string, any> = {};
  const key2InsKeys: any = {};
  bindInternal(sharedState, {
    key2InsKeys,
    insKey2Updater,
    setState(partialState: any) {
      const keys = Object.keys(partialState);
      let allInsKeys: any[] = [];
      keys.forEach((key) => {
        const insKeys = key2InsKeys[key] || [];
        allInsKeys = allInsKeys.concat(insKeys);
      });
      // deduplicate
      allInsKeys = Array.from(new Set(allInsKeys));
      allInsKeys.forEach((insKey) => {
        const updater = insKey2Updater[insKey];
        updater(partialState);
      });
    },
    recordDep(key: string, insKey: any) {
      let insKeys: any[] = key2InsKeys[key];
      if (!insKeys) {
        insKeys = [];
        key2InsKeys[key] = insKeys;
      }
      if (!insKeys.includes(insKey)) {
        insKeys.push(insKey);
      }
    },
    delDep(key: string, insKey: any) {
      const insKeys: any[] = key2InsKeys[key] || [];
      const idx = insKeys.indexOf(insKey);
      if (idx >= 0) {
        insKeys.splice(idx, 1);
      }
    },
    mapInsKeyUpdater(insKey: string, updater: any) {
      insKey2Updater[insKey] = updater;
    },
  });

  return [sharedState, getInternal(sharedState).setState];
}

export function createSharedObject<T extends Dict = Dict>(rawState: T | (() => T)): T {
  const [sharedState] = innerCreateSharedObject(rawState, false);
  return sharedState;
}

export function createReactiveSharedObject<T extends Dict = Dict>(rawState: T | (() => T)): [T, (partialState: Partial<T>) => void] {
  const [reactiveSharedState, reactiveSetState] = innerCreateSharedObject(rawState, true);
  return [reactiveSharedState, reactiveSetState];
}

export function createShared<T extends Dict = Dict>(
  rawState: T | (() => T),
  enableReactive?: boolean,
): {
  state: SharedObject<T>;
  call: <A extends any[] = any[]>(
    srvFn: (ctx: { args: A; state: T; setState: (partialState: Partial<T>) => void }) => Promise<Partial<T>> | Partial<T> | void,
    ...args: A
  ) => void;
  setState: (partialState: Partial<T>) => void;
} {
  const [state, setState] = innerCreateSharedObject(rawState, enableReactive);
  return {
    state,
    call: (srvFn, ...args) => {
      Promise.resolve(srvFn({ state, setState, args })).then((partialState) => {
        partialState && setState(partialState);
      });
    },
    setState,
  };
}
