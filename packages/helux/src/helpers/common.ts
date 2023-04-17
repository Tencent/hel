import { EXPIRE_MS, FIRST_UNMOUNT, INTERNAL, LIMIT_DELTA, LIMIT_SEED, OBJECT_KEY, SECOND_UNMOUNT } from '../consts';
import type { Dict } from '../typing';

export interface IUnmountInfo {
  t: number;
  s: typeof FIRST_UNMOUNT | typeof SECOND_UNMOUNT;
  /** 前一个示例id */
  prev: number;
}

export const UNMOUNT_INFO_MAP = new Map<number, IUnmountInfo>();

export function genInternalContainer(state: any) {
  if (!state.__proto__[INTERNAL]) {
    state.__proto__[INTERNAL] = {};
  }
}

export function getInternal(state: any) {
  const key = getObjectKey(state);
  return state.__proto__[INTERNAL][key];
}

export function getRawState(state: any) {
  const internal = getInternal(state);
  return internal.rawState;
}

export function getObjectKey(state: any) {
  return state[OBJECT_KEY] || 0;
}

export function bindInternal(state: any, internal: any) {
  const key = getObjectKey(state);
  state[INTERNAL][key] = internal;
}

let keySeed = 0;
export function markObjectKey(state: any) {
  keySeed += 1;
  state[OBJECT_KEY] = keySeed;
}

let infoLimit = LIMIT_SEED;

/**
 * check UNMOUNT_INFO_MAP expire data
 */
export function checkUnmountInfo(internal: any) {
  if (!(UNMOUNT_INFO_MAP.size > infoLimit)) {
    return;
  }
  const now = Date.now();
  const mapCopy = new Map(UNMOUNT_INFO_MAP);
  const prevInsKeys: number[] = [];

  mapCopy.forEach((value, insKey) => {
    if (value.t - now > EXPIRE_MS || value.s === SECOND_UNMOUNT) {
      UNMOUNT_INFO_MAP.delete(insKey);
      prevInsKeys.push(value.prev);
    }
  });

  if (prevInsKeys.length) {
    // trigger clear insKey2Updater logic
    prevInsKeys.forEach((insKey) => internal.delInsKeyUpdater(insKey));
    infoLimit = LIMIT_SEED;
  } else {
    // expand the upper limit
    infoLimit += LIMIT_DELTA;
  }
}

interface IRocoverDepOptions {
  keyMap: Dict<number>;
  internal: any;
  setState: any;
}

/**
 * recover dep
 */
export function recoverDep(insKey: number, options: IRocoverDepOptions) {
  if (UNMOUNT_INFO_MAP.get(insKey)) {
    // 是因为双调用导致的前一刻已触发了 unmount 行为
    const { keyMap, internal, setState } = options;
    Object.keys(keyMap).forEach((key) => internal.recordDep(key, insKey));
    internal.mapInsKeyUpdater(insKey, setState);
  }
}

/**
 * clear dep
 */
export function clearDep(insKey: number, keyMap: Dict<number>, internal: any) {
  let info = UNMOUNT_INFO_MAP.get(insKey);
  if (info) {
    info.s = SECOND_UNMOUNT;
    info.prev = insKey - 1;
  } else {
    info = { s: FIRST_UNMOUNT, t: Date.now(), prev: 0 };
    UNMOUNT_INFO_MAP.set(insKey, info);
  }

  // del dep before unmount
  Object.keys(keyMap).forEach((key) => internal.delDep(key, insKey));
  internal.delInsKeyUpdater(insKey);

  checkUnmountInfo(internal);
}

export function updateDep(insCtx: any, internal: any) {
  const { insKey, keyMap, prevKeyMap } = insCtx;
  Object.keys(prevKeyMap).forEach((prevKey) => {
    if (!keyMap[prevKey]) {
      // lost dep
      internal.delDep(prevKey, insKey);
    }
  });
}

let insKey = 0;
export function buildInsCtx(insCtxRef: any, options: any) {
  const { internal, setState, state, enableReactive } = options;
  insKey += 1;
  insCtxRef.current.insKey = insKey;
  internal.mapInsKeyUpdater(insKey, setState);
  // TODO: downgrade to defineProperty
  const proxyedState = new Proxy(state, {
    get(target, key) {
      insCtxRef.current.keyMap[key] = 1;
      internal.recordDep(key, insCtxRef.current.insKey);
      return target[key];
    },
    set(target, key, val) {
      // @ts-ignore
      target[key] = val;
      if (enableReactive) {
        internal.setState({ [key]: val });
      }
      return true;
    },
  });
  const updater = internal.setState;
  insCtxRef.current.reactiveUpdater = updater;
  insCtxRef.current.sharedState = proxyedState;
  return { updater, proxyedState };
}
