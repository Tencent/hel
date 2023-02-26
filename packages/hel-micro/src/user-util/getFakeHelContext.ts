import { getAppPlatform, getGlobalThis } from '../deps/helMicroCore';
import type { Platform } from '../deps/helTypes';

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
