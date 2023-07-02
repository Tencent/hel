import { SHARED_KEY } from '../consts';
import { Dict, IUnmountInfo } from '../typing';

const UNMOUNT_INFO_MAP = new Map<number, IUnmountInfo>();
const SHARED_KEY_STATE_MAP = new Map<number, Dict>();
const INTERMAL_MAP: Dict = {};

export function getInternalMap() {
  return INTERMAL_MAP;
}

export function getUnmountInfoMap() {
  return UNMOUNT_INFO_MAP;
}

export function getInternal(state: Dict) {
  const key = getSharedKey(state);
  return INTERMAL_MAP[key];
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
