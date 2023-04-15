import { Dict } from '../typing';

export function getInternal(state: any) {
  return state.__proto__.heluxinternal__;
}

export function getRawState(state: any) {
  return state.__proto__.__heluxraw__ || state;
}

function bindInternal(state: any, internal: any) {
  state.__proto__.heluxinternal__ = internal;
  // @ts-ignore
  window.__INTERNAL__ = internal;
}

function bindRawState(state: any, rawState: any) {
  state.__proto__.__HeluxRaw__ = rawState;
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
        state[key] = val;
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
