import { getCustomData, getGlobalThis, IGetVerOptions, setCustomData } from 'hel-micro-core';
import defaults from '../consts/defaults';

const { SHADOW_BODY, SHADOW_BODY_STATUS } = defaults;

export function getStaticShadowBodyRef(name: string, options?: IGetVerOptions) {
  return getCustomData(name, { customKey: SHADOW_BODY, ...(options || {}) });
}

export function setStaticShadowBodyRef(name: string, customValue: any, options?: IGetVerOptions) {
  setCustomData(name, { customKey: SHADOW_BODY, customValue, ...(options || {}) });
}

export function getStaticShadowBodyStatus(name: string, options?: IGetVerOptions) {
  return getCustomData(name, { customKey: SHADOW_BODY_STATUS, ...(options || {}) });
}

export function setStaticShadowBodyStatus(name: string, customValue: any, options?: IGetVerOptions) {
  setCustomData(name, { customKey: SHADOW_BODY_STATUS, customValue, ...(options || {}) });
}

interface IGetMayStaticShadowNodeOptions extends IGetVerOptions {
  fallbackNode?: HTMLElement;
}

export function getMayStaticShadowNode(name: string, options?: IGetMayStaticShadowNodeOptions): HTMLElement {
  const bodyNode = getGlobalThis().document.body;
  return getStaticShadowBodyRef(name, options) || options?.fallbackNode || bodyNode;
}
