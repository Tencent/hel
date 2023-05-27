import { FIRST_UNMOUNT, INTERNAL, SECOND_UNMOUNT, SHARED_KEY } from '../consts';
import { Dict } from '../typing';

const UNMOUNT_INFO_MAP = new Map<number, IUnmountInfo>();

export interface IUnmountInfo {
  t: number;
  s: typeof FIRST_UNMOUNT | typeof SECOND_UNMOUNT;
  /** 前一个实例 id */
  prev: number;
}

export function getUnmountInfoMap() {
  return UNMOUNT_INFO_MAP;
}

export function genInternalContainer(state: Dict) {
  if (!state.__proto__[INTERNAL]) {
    state.__proto__[INTERNAL] = {};
  }
}

export function getInternal(state: Dict) {
  const key = getSharedKey(state);
  return state.__proto__[INTERNAL][key];
}

export function getRawState(state: Dict) {
  const internal = getInternal(state);
  return internal.rawState;
}

export function getSharedKey(state: Dict) {
  return state[SHARED_KEY] || 0;
}

export function bindInternal(state: Dict, internal: any) {
  const key = getSharedKey(state);
  state[INTERNAL][key] = internal;
}

let keySeed = 0;
export function markSharedKey(state: Dict) {
  keySeed = keySeed === Number.MAX_SAFE_INTEGER ? 1 : keySeed + 1;
  state[SHARED_KEY] = keySeed;
}
