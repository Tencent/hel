import { FIRST_UNMOUNT, INTERNAL, OBJECT_KEY, SECOND_UNMOUNT } from '../consts';

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
  keySeed = keySeed === Number.MAX_SAFE_INTEGER ? 1 : keySeed + 1;
  state[OBJECT_KEY] = keySeed;
}
