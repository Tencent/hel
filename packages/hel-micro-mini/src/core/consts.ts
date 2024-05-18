const PLAT_HEL = 'hel';

const PLAT_UNPKG = 'unpkg';

export const logModeEnum = {
  NONE: 0,
  LOG: 1,
  TRACE: 2,
};

/**
 * 第一个载入的版本号，后续接口未指定版本时，总是优先载入一个载入的版本号对应的模块，确保优先使用全局已存在的模块
 * 内部很多地方用，这里额外独立暴露一下
 */
export const DEFAULT_ONLINE_VER = '__default_online_ver__';

/** 内部很多地方用，这里额外独立暴露一下  */
export const DEFAULT_PLAT = PLAT_UNPKG;

export const helConsts = {
  CORE_VER: '0.0.1-mini',
  PLAT_HEL,
  PLAT_UNPKG,
  DEFAULT_API_URL: '/openapi/v1/app/info',
  LS_LOG_MODE: 'HelConfig.logMode',
  LS_LOG_FILTER: 'HelConfig.logFilter',
  DEFAULT_API_PREFIX: 'https://unpkg.com',
};

export const helEvents = {
  // libReady 发射的是 SUB_LIB_LOADED
  SUB_LIB_LOADED: 'SubLibLoaded',
};

/**
 * 作为应用是否加载 或 样式字符串 是否获取的枚举 map
 * @type {{NOT_LOAD:0, LOADING:1, LOADED:2}}
 */
export const helLoadStatus = {
  NOT_LOAD: 0,
  LOADING: 1,
  LOADED: 2,
};
