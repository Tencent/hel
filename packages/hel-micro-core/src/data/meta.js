import { getSharedCache } from '../wrap/cache';

export function getAppMeta(appName, platform) {
  const { appName2app } = getSharedCache(platform);
  return appName2app[appName];
}

export function setAppMeta(/** @type {import('hel-types').ISubApp}*/ appMeta, platform) {
  const { appName2app } = getSharedCache(platform);
  appName2app[appMeta.name] = appMeta;
}
