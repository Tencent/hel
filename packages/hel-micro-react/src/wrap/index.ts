import { getCustomData, IGetVerOptions, setCustomData } from 'hel-micro-core';
import defaults from '../consts/defaults';

const { REACT_SHADOW_BODY, REACT_SHADOW_BODY_STATUS } = defaults;

export function getStaticShadowBodyRef(name: string, options?: IGetVerOptions) {
  return getCustomData(name, { customKey: REACT_SHADOW_BODY, ...(options || {}) });
}

export function setStaticShadowBodyRef(name: string, customValue: any, options?: IGetVerOptions) {
  setCustomData(name, { customKey: REACT_SHADOW_BODY, customValue, ...(options || {}) });
}

export function getStaticShadowBodyStatus(name: string, options?: IGetVerOptions) {
  return getCustomData(name, { customKey: REACT_SHADOW_BODY_STATUS, ...(options || {}) });
}

export function setStaticShadowBodyStatus(name: string, customValue: any, options?: IGetVerOptions) {
  setCustomData(name, { customKey: REACT_SHADOW_BODY_STATUS, customValue, ...(options || {}) });
}
