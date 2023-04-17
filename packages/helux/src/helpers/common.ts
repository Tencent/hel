import { INTERNAL, RAW_STATE } from '../consts';

export function getInternal(state: any) {
  return state.__proto__[INTERNAL];
}

export function getRawState(state: any) {
  return state.__proto__[RAW_STATE] || state;
}

export function bindInternal(state: any, internal: any) {
  state.__proto__[INTERNAL] = internal;
}

export function bindRawState(state: any, rawState: any) {
  state.__proto__[RAW_STATE] = rawState;
}
