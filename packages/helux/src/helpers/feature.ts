import { FIRST_UNMOUNT, INTERNAL, SECOND_UNMOUNT, SHARED_KEY } from '../consts';

const UNMOUNT_INFO_MAP = new Map<number, IUnmountInfo>();

export interface IUnmountInfo {
  t: number;
  s: typeof FIRST_UNMOUNT | typeof SECOND_UNMOUNT;
  /** 前一个示例id */
  prev: number;
}

export function getUnmountInfoMap() {
  return UNMOUNT_INFO_MAP;
}

export function genInternalContainer(state: any) {
  if (!state.__proto__[INTERNAL]) {
    state.__proto__[INTERNAL] = {};
  }
}

export function getInternal(state: any) {
  const key = getSharedKey(state);
  return state.__proto__[INTERNAL][key];
}

export function getRawState(state: any) {
  const internal = getInternal(state);
  return internal.rawState;
}

export function getSharedKey(state: any) {
  return state[SHARED_KEY] || 0;
}

export function bindInternal(state: any, internal: any) {
  const key = getSharedKey(state);
  state[INTERNAL][key] = internal;
}

let keySeed = 0;
export function markSharecKey(state: any) {
  keySeed = keySeed === Number.MAX_SAFE_INTEGER ? 1 : keySeed + 1;
  state[SHARED_KEY] = keySeed;
}
