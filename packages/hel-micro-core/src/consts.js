const PLAT_HEL = 'hel';

const PLAT_UNPKG = 'unpkg';

/**
 * 第一个载入的版本号，后续接口未指定版本时，总是优先载入一个载入的版本号对应的模块，确保优先使用全局已存在的模块
 * 内部很多地方用，这里额外独立暴露一下
 */
export const DEFAULT_ONLINE_VER = '__default_online_ver__';

/** 内部很多地方用，这里额外独立暴露一下  */
export const DEFAULT_PLAT = PLAT_UNPKG;

export const helConsts = {
  CORE_VER: '4.7.3',
  DEFAULT_API_PREFIX: 'https://unpkg.com',
  DEFAULT_API_URL: '/openapi/v1/app/info',
  DEFAULT_ONLINE_VER,
  DEFAULT_USER_LS_KEY: 'HelUserRtxName',
  DEFAULT_PLAT,
  PLAT_HEL,
  PLAT_UNPKG,
  /** commonData.CSS_STR ，存放样式字符串 map */
  KEY_CSS_STR: 'CSS_STR',
  /** commonData.ASSET_CTX ，资源对应的具体上下文 */
  KEY_ASSET_CTX: 'ASSET_CTX',
  /** commonData.STYLE_TAG_ADDED ，对应的样式字符串 { [key: 'app-group-name' ]: string } */
  KEY_STYLE_TAG_ADDED: 'STYLE_TAG_ADDED',
  /** commonData.CSS_LINK_TAG_ADDED ，对应的样式url列表 { [key: 'http://localhost:3000' ]: string[] } */
  KEY_CSS_LINK_TAG_ADDED: 'CSS_LINK_TAG_ADDED',
  /** commonData.IGNORE_CSS_PREFIX_LIST ，忽略样式前缀列表 string[] */
  KEY_IGNORE_CSS_PREFIX_LIST: 'IGNORE_CSS_PREFIX_LIST',
  /** commonData.IGNORE_STYLE_TAG_KEY ，忽略样式前缀列表 { [key: string ]: 1|0 } */
  KEY_IGNORE_STYLE_TAG_KEY: 'IGNORE_STYLE_TAG_KEY',
  /** commonData.IGNORE_CSS_PREFIX_2_KEYS ，忽略样式前缀对应的key { [key: 'http://localhost:3000' ]: string } */
  KEY_IGNORE_CSS_PREFIX_2_KEYS: 'IGNORE_CSS_PREFIX_2_KEYS',
};

export const helEvents = {
  // renderApp 发射的是 SUB_APP_LOADED
  // 此处有个小写开头的瑕疵不再做纠正，
  SUB_APP_LOADED: 'subAppLoaded',
  // libReady 发射的是 SUB_LIB_LOADED
  SUB_LIB_LOADED: 'SubLibLoaded',
  // 3.2+ 新增样式字符串获取完毕事件
  STYLE_STR_FETCHED: 'StyleStrFetched',
  /** 4.2.3+ 用于监听动态添加的 style 标签，方便上层用到 shadowdom 的地方可以接收样式并转移到 shadowdom 内部 */
  STYLE_TAG_ADDED: 'StyleTagAdded',
  /** 4.2.6+ 用于监听动态添加的 link 标签，方便上层用到 shadowdom 的地方可以接收样式并转移到 shadowdom 内部 */
  CSS_LINK_TAG_ADDED: 'CssLinkTagAdded',
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
