import { bindInternal, getInternal, getSharedKey, mapSharedState, markSharedKey } from '../helpers/state';
import { createHeluxObj, createOb, injectHeluxProto } from '../helpers/obj';
import { hookApi, staticApi, recordFnDep } from '../helpers/fndep';
import { runInsUpdater } from '../helpers/ins';
import type { Dict, DictN, EenableReactive, ICreateOptions, ICreateOptionsFull, IInsCtx, ModuleName } from '../typing';
import { nodupPush, safeGet } from '../utils';
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

function getHeluxParams(rawState: Dict, options: ICreateOptionsFull): IHeluxParams {
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
  sharedState = createOb(
    heluxObj,
    // setter
    (target: Dict, key: any, val: any) => {
      // @ts-ignore
      heluxObj[key] = val;
      if (shouldSync) {
        rawState[key] = val;
      }
      if (enableReactive) {
        getInternal(heluxObj).setState({ [key]: val });
      }
      return true;
    },
    // getter
    (target: Dict, key: any) => {
      if (enableRecordDep) {
        recordDep(sharedKey, key);
      }

      // record computed/watch dep
      recordFnDep(key);

      return target[key];
    },
  );
  mapSharedState(sharedKey, sharedState);

  return sharedState;
}

function bindInternalToShared(sharedState: Dict, heluxParams: IHeluxParams) {
  const { heluxObj, rawState, shouldSync } = heluxParams;
  const insCtxMap = new Map<number, IInsCtx>();
  // VALKEY_INSKEYS_MAP
  const key2InsKeys: Record<string, number[]> = {};

  bindInternal(sharedState, {
    rawState: heluxObj, // helux raw state
    key2InsKeys,
    insCtxMap,
    setState(partialState: any) {
      Object.assign(heluxObj, partialState);
      if (shouldSync) {
        Object.assign(rawState, partialState);
      }

      const valKeys = Object.keys(partialState);

      // find associate ins keys
      let allInsKeys: number[] = [];
      // find associate computed/watch fn ctxs
      let allStaticFnKeys: number[] = [];
      let allHookFnKeys: number[] = [];

      valKeys.forEach((key) => {
        allInsKeys = allInsKeys.concat(key2InsKeys[key] || []);
        allStaticFnKeys = allStaticFnKeys.concat(staticApi.getDepFnKeys(key));

        const hKeys = hookApi.getDepFnKeys(key);
        allHookFnKeys = allHookFnKeys.concat(hKeys);
      });
      // deduplicate
      allInsKeys = Array.from(new Set(allInsKeys));
      allStaticFnKeys = Array.from(new Set(allStaticFnKeys));
      allHookFnKeys = Array.from(new Set(allHookFnKeys));

      // start execute compute/watch fns
      allStaticFnKeys.forEach(staticApi.runFn);
      allHookFnKeys.forEach(hookApi.runFn);

      // start update
      allInsKeys.forEach((insKey) => {
        runInsUpdater(insCtxMap.get(insKey), partialState);
      });
    },
    recordDep(key: string, insKey: number) {
      const insKeys: any[] = safeGet(key2InsKeys, key, []);
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
    mapInsCtx(insKey: number, insCtx: IInsCtx) {
      insCtxMap.set(insKey, insCtx);
    },
    delInsCtx(insKey: number) {
      insCtxMap.delete(insKey);
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
