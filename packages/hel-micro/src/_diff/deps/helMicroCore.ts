// 采用以下 export * 写法会导致在线IDE如codesandbox取到空属性对象 {} 的bug，故这里全部再导出去一次
import * as core from 'hel-micro-core';
export type {
  HelLoadStatusEnum,
  IAppAndVer,
  IGetOptions,
  IGetSubAppAndItsVersionFn,
  IOnFetchMetaFailed,
  IPlatformConfig,
  IShouldUseGray,
} from 'hel-micro-core';
export {
  DEFAULT_ONLINE_VER,
  helEvents,
  helLoadStatus,
  getHelEventBus,
  getUserEventBus,
  getHelDebug,
  getSharedCache,
  libReady,
  appReady,
  getPlatform,
  getPlatformHost,
  getPlatformConfig,
  initPlatformConfig,
  isSubApp,
  // 应用Comp get set
  getVerApp,
  setEmitApp,
  // 应用lib get set
  getVerLib,
  setEmitLib,
  // 应用元数据 get set
  getAppMeta,
  setAppMeta,
  // 版本元数据 get set
  getVersion,
  setVersion,
  // 应用的所有样式字符串 get set
  getAppStyleStr,
  setAppStyleStr,
  // 版本获取状态 get set
  setVerLoadStatus,
  getVerLoadStatus,
  // 样式字符串获取状态 get set
  getVerStyleStrStatus,
  setVerStyleStrStatus,
  // sdk注入的额外样式列表 get set
  getVerExtraCssList,
  setVerExtraCssList,
  getAppPlatform,
  setAppPlatform,
  tryGetVersion,
  tryGetAppName,
  log,
  allowLog,
  getGlobalThis,
  setGlobalThis,
  trySetMasterAppLoadedSignal,
  resetGlobalThis,
};

const {
  DEFAULT_ONLINE_VER,
  helEvents,
  helLoadStatus,
  getHelEventBus,
  getUserEventBus,
  getHelDebug,
  getSharedCache,
  libReady,
  appReady,
  getPlatform,
  getPlatformHost,
  getPlatformConfig,
  initPlatformConfig,
  isSubApp,
  // 应用Comp get set
  getVerApp,
  setEmitApp,
  // 应用lib get set
  getVerLib,
  setEmitLib,
  // 应用元数据 get set
  getAppMeta,
  setAppMeta,
  // 版本元数据 get set
  getVersion,
  setVersion,
  // 应用的所有样式字符串 get set
  getAppStyleStr,
  setAppStyleStr,
  // 版本获取状态 get set
  setVerLoadStatus,
  getVerLoadStatus,
  // 样式字符串获取状态 get set
  getVerStyleStrStatus,
  setVerStyleStrStatus,
  // sdk注入的额外样式列表 get set
  getVerExtraCssList,
  setVerExtraCssList,

  getAppPlatform,
  setAppPlatform,
  tryGetVersion,
  tryGetAppName,
  log,
  allowLog,
  getGlobalThis,
  setGlobalThis,
  resetGlobalThis,
  trySetMasterAppLoadedSignal,
} = core;
