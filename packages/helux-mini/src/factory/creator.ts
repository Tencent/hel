import { IS_SERVER, SHARED_KEY } from '../consts';
import { bindInternal, getInternal, getSharedKey, mapSharedState, markSharedKey } from '../helpers/feature';
import { createHeluxObj, createOb, injectHeluxProto } from '../helpers/obj';
import type { Dict, DictN, EnableReactive, ICreateOptions, ILifeCycleInner, ModuleName } from '../typing';
import { isSymbol, nodupPush, prefixValKey, safeGet } from '../utils';
import { record } from './root';

interface IHeluxParams {
  heluxObj: Dict;
  rawState: Dict;
  shouldSync: boolean;
  sharedKey: number;
  lifecycle: ILifeCycleInner;
  actionsFactory: Dict;
  isKeyed: boolean;
  moduleName: string;
}

let depStats: DictN<Array<string>> = {};
const noop = () => ({});

function mapDepStats(sharedKey: number) {
  const keys = safeGet(depStats, sharedKey, []);
  return keys;
}

function recordDep(sharedKey: number, stateKey: string | symbol) {
  const keys = mapDepStats(sharedKey);
  nodupPush(keys, stateKey);
}

function parseOptions(isKeyed: boolean, options?: ModuleName | EnableReactive | ICreateOptions) {
  let enableReactive = false;
  let enableRecordDep = false;
  let copyObj = false;
  let enableSyncOriginal = true;
  let moduleName = '';
  let lifecycle = {};
  let actionsFactory: any = noop;

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
    lifecycle = options.lifecycle || {};
    actionsFactory = options.actionsFactory || noop;
  }

  return { enableReactive, enableRecordDep, copyObj, enableSyncOriginal, moduleName, lifecycle, actionsFactory, isKeyed };
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

function getHeluxParams(isKeyed: boolean, rawState: Dict, options: ICreateOptions): IHeluxParams {
  const { copyObj, enableSyncOriginal = false, lifecycle = {}, actionsFactory = noop, moduleName } = options;
  let heluxObj;
  let shouldSync = false;
  if (copyObj) {
    shouldSync = enableSyncOriginal;
    heluxObj = createHeluxObj(rawState);
  } else {
    heluxObj = injectHeluxProto(rawState);
  }
  const sharedKey = markSharedKey(heluxObj);
  // @ts-ignore
  return { rawState, heluxObj, shouldSync, sharedKey, lifecycle, actionsFactory, isKeyed, moduleName };
}

function getSharedState(heluxParams: IHeluxParams, options: ICreateOptions) {
  let sharedState: Dict = {};
  const { rawState, heluxObj, sharedKey, shouldSync } = heluxParams;
  const { enableReactive, enableRecordDep } = options;
  if (enableReactive) {
    sharedState = createOb(
      heluxObj,
      // setter
      (target: any, key: any, val: any) => {
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
      (target: any, key: any) => {
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
  if (IS_SERVER) {
    return;
  }

  const { heluxObj, rawState, shouldSync, sharedKey, lifecycle, isKeyed, moduleName } = heluxParams;
  const insKey2Updater: Record<string, any> = {};
  const key2InsKeys: Record<string, number[]> = {};
  const lifecycleVar = Object.assign({}, lifecycle) as unknown as ILifeCycleInner;

  lifecycleVar.beforeMount = lifecycleVar.beforeMount || noop;
  lifecycleVar.mounted = lifecycleVar.mounted || noop;
  lifecycleVar.willUnmount = lifecycleVar.willUnmount || noop;
  lifecycleVar.beforeSetState = lifecycleVar.beforeSetState || noop;

  bindInternal(sharedState, {
    isKeyed,
    moduleName,
    lifecycle: lifecycleVar,
    lifecycleStats: {
      isMountedCalled: false,
    },
    rawState: heluxObj, // helux raw state
    key2InsKeys,
    insKey2Updater,
    sharedKey,
    insCount: 0,
    setState(inputPartial: any) {
      if (!inputPartial) {
        return;
      }

      let partialState = inputPartial;
      // keyed 共享状态，暂不允许用户通过 setState 修改 key，让 key 固定下来
      if (isKeyed) {
        const { key, ...rest } = inputPartial;
        partialState = rest;
      }

      Object.assign(heluxObj, partialState);
      if (shouldSync) {
        Object.assign(rawState, partialState);
      }

      // find associate ins keys
      const keys = Object.keys(partialState).map((key) => prefixValKey(key, sharedKey));
      let allInsKeys: number[] = [];
      keys.forEach((key) => {
        const insKeys = key2InsKeys[key] || [];
        allInsKeys = allInsKeys.concat(insKeys);
      });
      // deduplicate
      allInsKeys = Array.from(new Set(allInsKeys));
      lifecycleVar.beforeSetState();
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
  isKeyed: boolean,
  stateOrStateFn: T | (() => T),
  options?: ModuleName | EnableReactive | ICreateOptions,
): [T, (partialState: Partial<T>) => void, Dict] {
  const parsedOpts = parseOptions(isKeyed, options);
  const rawState = parseRawState(stateOrStateFn);
  const heluxParams = getHeluxParams(isKeyed, rawState, parsedOpts);
  const sharedState = getSharedState(heluxParams, parsedOpts);
  bindInternalToShared(sharedState, heluxParams);
  record(parsedOpts.moduleName, sharedState);

  const state = sharedState;
  const internal = getInternal(sharedState);
  const setState = internal.setState;
  const actions = parsedOpts.actionsFactory({ state, setState });
  internal.actions = actions;

  return [sharedState, setState, actions];
}
