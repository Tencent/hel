import { FIRST_UNMOUNT, IS_SERVER, SECOND_UNMOUNT, SHARED_KEY } from '../consts';
import type { Dict } from '../typing';
import { fakeInternal } from '../utils/fake';

const UNMOUNT_INFO_MAP = new Map<number, IUnmountInfo>();
const SHARED_KEY_STATE_MAP = new Map<number, Dict>();
const INTERMAL_MAP: Dict = {};

export interface IUnmountInfo {
  t: number;
  s: typeof FIRST_UNMOUNT | typeof SECOND_UNMOUNT;
  /** 前一个实例 id */
  prev: number;
}

export function getInternalMap() {
  return INTERMAL_MAP;
}

export function getUnmountInfoMap() {
  return UNMOUNT_INFO_MAP;
}

export function getInternal(state: Dict) {
  if (IS_SERVER) return fakeInternal;
  const key = getSharedKey(state);
  return INTERMAL_MAP[key];
}

export function getRawState(state: Dict) {
  if (IS_SERVER) return state;
  const internal = getInternal(state);
  return internal.rawState;
}

export function getSharedKey(state: Dict) {
  return state[SHARED_KEY] || 0;
}

export function bindInternal(state: Dict, internal: any) {
  const key = getSharedKey(state);
  INTERMAL_MAP[key] = internal;
}

let keySeed = 0;
export function markSharedKey(state: Dict) {
  keySeed = keySeed === Number.MAX_SAFE_INTEGER ? 1 : keySeed + 1;
  state.__proto__[SHARED_KEY] = keySeed;
  return keySeed;
}

export function mapSharedState(sharedKey: number, state: Dict) {
  SHARED_KEY_STATE_MAP.set(sharedKey, state);
}

export function getSharedState(sharedKey: number) {
  return SHARED_KEY_STATE_MAP.get(sharedKey);
}
