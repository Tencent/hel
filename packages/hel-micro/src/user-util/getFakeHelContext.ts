import { getAppPlatform, getGlobalThis } from 'hel-micro-core';
import type { Platform } from 'hel-types';

function getBodyContainer(idOrTriggerNode: any) {
  if (typeof idOrTriggerNode === 'string') {
    return getGlobalThis()?.document.getElementById(idOrTriggerNode);
  }
  return idOrTriggerNode;
}

export default function getFakeHelContext(name: string, options?: { platform?: Platform; versionId?: string }) {
  return {
    name,
    platform: options?.platform || getAppPlatform(name),
    versionId: options?.versionId || '',
    getShadowAppRoot: getBodyContainer,
    getShadowBodyRoot: getBodyContainer,
  };
}
