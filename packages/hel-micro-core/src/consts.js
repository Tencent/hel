import * as diffBase from './diff/base';

export const VER = diffBase.VER;

export const DEFAULT_API_URL = '/openapi/v1/app/info';

export const DEFAULT_ONLINE_VER = '__default_online_ver__';

export const UNPKG_PREFIX = 'https://unpkg.com';

export const PLAT_UNPKG = 'unpkg';

export const PLAT_HEL = 'hel';

export const DEFAULT_PLAT = diffBase.PACK_MODE === 'inner' ? PLAT_HEL : PLAT_UNPKG;

export const HEL_EVENTS = {
  // renderApp 发射的是 SUB_APP_LOADED
  // 此处有个小写开头的瑕疵不再做纠正，
  SUB_APP_LOADED: 'subAppLoaded',
  // libReady 发射的是 SUB_LIB_LOADED
  SUB_LIB_LOADED: 'SubLibLoaded',
  // 3.2+ 新增样式字符串获取完毕事件
  STYLE_STR_FETCHED: 'StyleStrFetched',
};

/**
 * 作为应用是否加载 或 样式字符串 是否获取的枚举 map
 * @type {{NOT_LOAD:0, LOADING:1, LOADED:2}}
 */
export const HEL_LOAD_STATUS = {
  NOT_LOAD: 0,
  LOADING: 1,
  LOADED: 2,
};
