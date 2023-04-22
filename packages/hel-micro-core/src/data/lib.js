import { log } from '../base/microDebug';
import { safeGetMap, setSubMapValue } from '../base/util';
import { DEFAULT_ONLINE_VER } from '../consts';
import { getSharedCache } from '../wrap/cache';
import inner from './util';

export function getVerLib(appName, inputOptions) {
  const options = inputOptions || {};
  const { versionId, platform } = options;
  const sharedCache = getSharedCache(platform);
  const { appName2verEmitLib, appName2Lib, strictMatchVer, appName2isLibAssigned } = sharedCache;
  const targetStrictMatchVer = options.strictMatchVer ?? strictMatchVer;
  const verEmitLibMap = safeGetMap(appName2verEmitLib, appName);
  inner.ensureOnlineModule(verEmitLibMap, appName);

  // 不传递具体版本号就执行默认在线版本
  const versionIdVar = versionId || DEFAULT_ONLINE_VER;
  const verLib = verEmitLibMap[versionIdVar];

  // 未分配的模块，直接返回 null 即可，因为 appName2Lib 里会被 exposeLib 提前注入一个 {} 对象占位
  const staticLib = appName2isLibAssigned[appName] ? appName2Lib[appName] : null;
  // 指定了版本严格匹配的话，兜底模块置为空
  const fallbackLib = targetStrictMatchVer ? null : staticLib;
  const result = verLib || fallbackLib || null;
  log('[[ core:getVerLib ]] appName,options,result:', appName, options, result);
  return result;
}

export function setEmitLib(appName, /** @type {import('hel-types').IEmitAppInfo} */ emitApp, options) {
  const { appGroupName } = options || {};
  const { versionId, appProperties } = emitApp;
  const platform = emitApp.platform || options.platform;
  const sharedCache = getSharedCache(platform);
  const { appName2verEmitLib, appName2Lib, appName2isLibAssigned } = sharedCache;
  const appMeta = inner.getAppMeta(appName, platform);

  const assignLibObj = (appName) => {
    // 使用文件头静态导入模块语法时，默认是从 appName2Lib 拿数据，
    // 这意味着 文件头静态导入 总是执行第一个加载的版本模块，
    // （ 注：文件头静态导入对接的是 hel-lib-proxy 的 exposeLib，该接口使用的是 appName2Lib ）
    // 所以 多版本同时导入 和 文件头静态导入 本身是冲突的，用户不应该两种用法一起使用，
    // 否则 文件头静态导入 的模块是不稳定的，除非用户知道后果并刻意这样做
    // marked at 2022-05-06
    const libObj = appName2Lib[appName];
    // 未静态导入时，libObj 是 undefined
    if (!libObj) {
      appName2Lib[appName] = appProperties;
    } else if (typeof libObj === 'object' && Object.keys(libObj).length === 0) {
      // 静态导入时，emptyChunk 那里调用 exposeLib 会提前生成一个 {} 对象
      // 这里只需负责 merge 模块提供方通过 libReady 提供的模块对象
      Object.assign(libObj, appProperties);
    }
    appName2isLibAssigned[appName] = true;
  };
  assignLibObj(appName);
  // 确保 preFetchLib 传入测试应用名时，exposeLib 获取的代理对象能够指到测试库
  // 这样静态导入才能正常工作
  if (appGroupName) {
    assignLibObj(appGroupName);
  } else {
    appMeta && assignLibObj(appMeta.app_group_name);
  }

  // 当前版本可作为默认线上版本来记录
  log('[[ core:setEmitLib ]] appMeta:', appMeta);
  const verEmitLibMap = safeGetMap(appName2verEmitLib, appName);
  // 记录第一个载入的版本号对应 lib
  if (!verEmitLibMap[DEFAULT_ONLINE_VER]) {
    setSubMapValue(appName2verEmitLib, appName, DEFAULT_ONLINE_VER, appProperties);
  }
  if (versionId) {
    setSubMapValue(appName2verEmitLib, appName, versionId, appProperties);
  }
}
