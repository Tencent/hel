import { INTERNAL, OBJECT_KEY } from '../consts';
import type { Dict, SharedObject } from '../typing';
import { bindInternal, genInternalContainer, getInternal, markObjectKey } from './common';

function innerCreateSharedObject<T extends Dict = Dict>(
  stateOrStateFn: T | (() => T),
  enableReactive?: boolean,
): [T, (partialState: Partial<T>) => void] {
  let rawState = stateOrStateFn as T;
  if (typeof stateOrStateFn === 'function') {
    rawState = stateOrStateFn();
  }
  // let sharedState = Object.create(null);
  // Object.assign(sharedState, rawState); // then safe set internal, but object no proto methods
  let sharedState = rawState;
  markObjectKey(sharedState);
  genInternalContainer(sharedState);

  if (enableReactive) {
    // TODO: downgrade to defineProperty
    sharedState = new Proxy(rawState, {
      set(target, key: any, val) {
        // @ts-ignore
        rawState[key] = val;
        if (![OBJECT_KEY, INTERNAL].includes(key)) {
          getInternal(sharedState).setState({ [key]: val });
        }
        return true;
      },
    });
  } else {
    sharedState = rawState;
  }

  const insKey2Updater: Record<string, any> = {};
  const key2InsKeys: Record<string, number[]> = {};
  bindInternal(sharedState, {
    rawState,
    key2InsKeys,
    insKey2Updater,
    setState(partialState: any) {
      const keys = Object.keys(partialState);
      let allInsKeys: number[] = [];
      keys.forEach((key) => {
        const insKeys = key2InsKeys[key] || [];
        allInsKeys = allInsKeys.concat(insKeys);
      });
      // deduplicate
      allInsKeys = Array.from(new Set(allInsKeys));
      allInsKeys.forEach((insKey) => {
        const updater = insKey2Updater[insKey];
        updater && updater(partialState);
      });
    },
    recordDep(key: string, insKey: number) {
      let insKeys: any[] = key2InsKeys[key];
      if (!insKeys) {
        insKeys = [];
        key2InsKeys[key] = insKeys;
      }
      if (!insKeys.includes(insKey)) {
        insKeys.push(insKey);
      }
    },
    delDep(key: string, insKey: number) {
      const insKeys: any[] = key2InsKeys[key] || [];
      const idx = insKeys.indexOf(insKey);
      if (idx >= 0) {
        insKeys.splice(idx, 1);
      }
    },
    mapInsKeyUpdater(insKey: number, updater: any) {
      insKey2Updater[insKey] = updater;
    },
    delInsKeyUpdater(insKey: number) {
      if (insKey) {
        // @ts-ignore
        delete insKey2Updater[insKey];
      }
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
