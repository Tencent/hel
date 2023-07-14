import { SHARED_KEY } from '../consts';
import { bindInternal, getInternal, getSharedKey, mapSharedState, markSharedKey } from '../helpers/feature';
import { createHeluxObj, createOb, injectHeluxProto } from '../helpers/obj';
import type { Dict, DictN, EenableReactive, ICreateOptions, ModuleName } from '../typing';
import { nodupPush, safeGet, isSymbol, prefixValKey } from '../utils';
import { record } from './root';

interface IHeluxParams {
  heluxObj: Dict;
  rawState: Dict;
  shouldSync: boolean;
  sharedKey: number;
}

let depStats: DictN<Array<string>> = {};

function mapDepStats(sharedKey: number) {
  const keys = safeGet(depStats, sharedKey, []);
  return keys;
}

function recordDep(sharedKey: number, stateKey: string | symbol) {
  const keys = mapDepStats(sharedKey);
  nodupPush(keys, stateKey);
}

function parseOptions(options?: ModuleName | EenableReactive | ICreateOptions) {
  let enableReactive = false;
  let enableRecordDep = false;
  let copyObj = false;
  let enableSyncOriginal = true;
  let moduleName = '';

  // for ts check, write 'typeof options' 3 times
  if (typeof options === 'boolean') {
    enableReactive = options;
  } else if (typeof options === 'string') {
    moduleName = options;
  } else if (options && typeof options === 'object') {
    enableReactive = options.enableReactive ?? false;
    enableRecordDep = options.enableRecordDep ?? false;
    copyObj = options.copyObj ?? false;
    enableSyncOriginal = options.enableSyncOriginal ?? true;
    moduleName = options.moduleName || '';
  }

  return { enableReactive, enableRecordDep, copyObj, enableSyncOriginal, moduleName };
}

function parseRawState<T extends Dict = Dict>(stateOrStateFn: T | (() => T)) {
  let rawState = stateOrStateFn as T;
  if (typeof stateOrStateFn === 'function') {
    rawState = stateOrStateFn();
  }
  if (!rawState || typeof rawState !== 'object') {
    throw new Error('ERR_NON_OBJ: pass an non-object to createShared!');
  }
  if (getSharedKey(rawState)) {
    throw new Error('ERR_ALREADY_SHARED: pass a shared object to createShared!');
  }

  return rawState;
}

function getHeluxParams(rawState: Dict, options: ICreateOptions): IHeluxParams {
  const { copyObj, enableSyncOriginal } = options;
  let heluxObj;
  let shouldSync = false;
  if (copyObj) {
    shouldSync = enableSyncOriginal;
    heluxObj = createHeluxObj(rawState);
  } else {
    heluxObj = injectHeluxProto(rawState);
  }
  const sharedKey = markSharedKey(heluxObj);
  return { rawState, heluxObj, shouldSync, sharedKey };
}

function getSharedState(heluxParams: IHeluxParams, options: ICreateOptions) {
  let sharedState: Dict = {};
  const { rawState, heluxObj, sharedKey, shouldSync } = heluxParams;
  const { enableReactive, enableRecordDep } = options;
  if (enableReactive) {
    sharedState = createOb(
      heluxObj,
      // setter
      (target, key: any, val) => {
        // @ts-ignore
        heluxObj[key] = val;
        if (shouldSync) {
          rawState[key] = val;
        }

        if (SHARED_KEY !== key) {
          getInternal(heluxObj).setState({ [key]: val });
        }
        return true;
      },
      // getter
      (target, key) => {
        if (isSymbol(key)) {
          return target[key];
        }
        const depKey = prefixValKey(key, sharedKey);
        if (enableRecordDep) {
          recordDep(sharedKey, depKey);
        }
        return target[key];
      },
    );
  } else {
    sharedState = heluxObj;
  }
  mapSharedState(sharedKey, sharedState);
  return sharedState;
}

function bindInternalToShared(sharedState: Dict, heluxParams: IHeluxParams) {
  const { heluxObj, rawState, shouldSync, sharedKey } = heluxParams;
  const insKey2Updater: Record<string, any> = {};
  const key2InsKeys: Record<string, number[]> = {};
  bindInternal(sharedState, {
    rawState: heluxObj, // helux raw state
    key2InsKeys,
    insKey2Updater,
    sharedKey,
    setState(partialState: any) {
      Object.assign(heluxObj, partialState);
      if (shouldSync) {
        Object.assign(rawState, partialState);
      }

      // find associate ins keys
      const keys = Object.keys(partialState).map(key => prefixValKey(key, sharedKey));
      let allInsKeys: number[] = [];
      keys.forEach((key) => {
        const insKeys = key2InsKeys[key] || [];
        allInsKeys = allInsKeys.concat(insKeys);
      });
      // deduplicate
      allInsKeys = Array.from(new Set(allInsKeys));
      // start update
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
}

export function setShared(sharedList: Dict[]) {
  sharedList.forEach((shared) => mapDepStats(getSharedKey(shared)));
}

export function getDepStats() {
  const curDepStats = depStats;
  depStats = {};
  return curDepStats;
}

export function buildSharedObject<T extends Dict = Dict>(
  stateOrStateFn: T | (() => T),
  options?: ModuleName | EenableReactive | ICreateOptions,
): [T, (partialState: Partial<T>) => void] {
  const parsedOpts = parseOptions(options);
  const rawState = parseRawState(stateOrStateFn);
  const heluxParams = getHeluxParams(rawState, parsedOpts);
  const sharedState = getSharedState(heluxParams, parsedOpts);
  bindInternalToShared(sharedState, heluxParams);
  record(parsedOpts.moduleName, sharedState);

  return [sharedState, getInternal(sharedState).setState];
}
