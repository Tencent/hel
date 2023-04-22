import { log } from '../base/microDebug';
import { safeGetMap, setSubMapValue } from '../base/util';
import { DEFAULT_ONLINE_VER } from '../consts';
import { getSharedCache } from '../wrap/cache';
import inner from './util';

export function getVerApp(appName, inputOptions) {
  const options = inputOptions || {};
  const { versionId, platform } = options;
  const { appName2verEmitApp, appName2Comp, strictMatchVer, appName2EmitApp } = getSharedCache(platform);
  const targetStrictMatchVer = options.strictMatchVer ?? strictMatchVer;
  const verEmitAppMap = safeGetMap(appName2verEmitApp, appName);
  inner.ensureOnlineModule(verEmitAppMap, appName, platform);

  // 不传递具体版本号就指向默认的第一个载入的版本
  const versionIdVar = versionId || DEFAULT_ONLINE_VER;
  const verApp = verEmitAppMap[versionIdVar];

  const Comp = appName2Comp[appName];
  // { Comp } 是为了兼容老包写入的数据，老包未写入 appName2EmitApp
  const legacyWriteVerApp = Comp ? { Comp } : null;
  // 指定了版本严格匹配的话，兜底模块置为空
  const fallbackApp = targetStrictMatchVer ? null : appName2EmitApp[appName] || legacyWriteVerApp;
  const result = verApp || fallbackApp || null;
  log('[[ core:getVerApp ]] appName,options,result:', appName, options, result);
  return result;
}

export function setEmitApp(appName, /** @type {import('hel-types').IEmitAppInfo} */ emitApp) {
  log('[[ core:setEmitApp ]] appName,emitApp:', appName, emitApp);
  const { versionId, platform } = emitApp;
  const sharedCache = getSharedCache(platform);
  const { appName2verEmitApp, appName2Comp, appName2EmitApp } = sharedCache;

  // 记录第一个载入的版本号对应 emitApp
  const verEmitApp = safeGetMap(appName2verEmitApp, appName);
  if (!verEmitApp[DEFAULT_ONLINE_VER]) {
    appName2Comp[appName] = emitApp.Comp;
    appName2EmitApp[appName] = emitApp;
    setSubMapValue(appName2verEmitApp, appName, DEFAULT_ONLINE_VER, emitApp);
  }

  if (versionId) {
    setSubMapValue(appName2verEmitApp, appName, versionId, emitApp);
  }
}
