import { EXPIRE_MS, FIRST_UNMOUNT, LIMIT_DELTA, LIMIT_SEED, SECOND_UNMOUNT } from '../consts';
import type { Dict } from '../typing';
import { getUnmountInfoMap } from './feature';

export interface IUnmountInfo {
  t: number;
  /** 是第几次卸载 */
  s: typeof FIRST_UNMOUNT | typeof SECOND_UNMOUNT;
  /** 前一个示例id */
  prev: number;
}

const UNMOUNT_INFO_MAP = getUnmountInfoMap();

let infoLimit = LIMIT_SEED;

/**
 * check UNMOUNT_INFO_MAP expire data
 */
function checkUnmountInfo(internal: any) {
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
  let info = UNMOUNT_INFO_MAP.get(insKey);
  if (info) {
    info.s = SECOND_UNMOUNT;
    info.prev = insKey - 1;
  } else {
    info = { s: FIRST_UNMOUNT, t: Date.now(), prev: 0 };
    UNMOUNT_INFO_MAP.set(insKey, info);
  }

  const { s: unmoutStatus, prev: prevInsKey } = info;
  if (unmoutStatus === SECOND_UNMOUNT) {
    // 是因为双调用导致的前一刻已触发了 unmount 行为
    const { keyMap, internal, setState } = options;
    internal.mapInsKeyUpdater(insKey, setState);
    // 把前一个更新器移除，避免冗余更新
    internal.delInsKeyUpdater(info.prev);
    Object.keys(keyMap).forEach((key) => {
      internal.recordDep(key, insKey);
      internal.delDep(key, prevInsKey);
    });
  }
}

/**
 * clear dep
 */
export function clearDep(insKey: number, keyMap: Dict<number>, internal: any) {
  // del dep before unmount
  Object.keys(keyMap).forEach((key) => internal.delDep(key, insKey));
  internal.delInsKeyUpdater(insKey);

  checkUnmountInfo(internal);
}

export function updateDep(insCtx: any, internal: any) {
  const { insKey, keyMap, keyMapPrev } = insCtx;
  Object.keys(keyMapPrev).forEach((prevKey) => {
    if (!keyMap[prevKey]) {
      // lost dep
      internal.delDep(prevKey, insKey);
    }
  });
  insCtx.keyMapStrict = null;
}

export function updateReadTrack(insCtx: any) {
  const { keyMap, keyMapStrict } = insCtx;
  if (keyMapStrict) {
    // second call
    insCtx.keyMapPrev = keyMapStrict;
    insCtx.keyMapStrict = null;
  } else {
    insCtx.keyMapPrev = keyMap;
    insCtx.keyMapStrict = keyMap;
    insCtx.keyMap = {}; // reset dep map
  }
}
