import { INTERNAL, SHARED_KEY } from '../consts';
import { bindInternal, genInternalContainer, getInternal, markSharedKey } from '../helpers/feature';
import type { Dict, EenableReactive, ICreateOptions, ModuleName } from '../typing';
import { record } from './root';

export function buildSharedObject<T extends Dict = Dict>(
  stateOrStateFn: T | (() => T),
  options?: ModuleName | EenableReactive | ICreateOptions,
): [T, (partialState: Partial<T>) => void] {
  let enableReactive = false;
  let moduleName = '';

  // for ts check, write 'typeof boolOrCreateOptions' 3 times
  if (typeof options === 'boolean') {
    enableReactive = options;
  }
  if (typeof options === 'string') {
    moduleName = options;
  } else if (options && typeof options === 'object') {
    enableReactive = options.enableReactive ?? false;
    moduleName = options.moduleName || '';
  }

  let rawState = stateOrStateFn as T;
  if (typeof stateOrStateFn === 'function') {
    rawState = stateOrStateFn();
  }
  // let sharedState = Object.create(null);
  // Object.assign(sharedState, rawState); // then safe set internal, but object no proto methods
  let sharedState = rawState;
  markSharedKey(sharedState);
  genInternalContainer(sharedState);

  if (enableReactive) {
    // TODO: downgrade to defineProperty
    sharedState = new Proxy(rawState, {
      set(target, key: any, val) {
        // @ts-ignore
        rawState[key] = val;
        if (![SHARED_KEY, INTERNAL].includes(key)) {
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

  record(moduleName, sharedState);
  return [sharedState, getInternal(sharedState).setState];
}
