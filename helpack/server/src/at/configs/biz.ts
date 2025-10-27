export default {
  HEL_OWNER: 'fantasticsoul',
  CACHE_APP_PREFIX: 'SubApp_',
  CACHE_VERSION_PREFIX: 'SubAppVer_',
  /** 应用自身数据变化 */
  CHANNEL_APP_INFO_CHANGED: 'appInfoChanged',
  /** 应用被删除 */
  CHANNEL_APP_INFO_DELED: 'appInfoDeled',
  /** 应用版本数据变化  */
  CHANNEL_APP_VERSION_CHANGED: 'appVersionChanged',
  /** 用户名字符串数据变化 */
  CHANNEL_STAFF_STR_CHANGED: 'CHANNEL_STAFF_STR_CHANGED',
  /** 白名单应用列表新增子项 */
  CHANNEL_ALLOWED_APPS_ADD: 'CHANNEL_ALLOWED_APPS_ADD',
  /** 白名单应用列表删除子项 */
  CHANNEL_ALLOWED_APPS_DEL: 'CHANNEL_ALLOWED_APPS_DEL',
  /** 白名单应用列表初始化 */
  CHANNEL_ALLOWED_APPS_INIT: 'CHANNEL_ALLOWED_APPS_INIT',
};

export const AS = {
  true: '1',
  false: '0',
} as const;

/** 特殊处理过的需参与加密的key */
export const MIXED_KEY = 'ayxfbrysVczsIVjsgo';

/** 蓝盾插件专用 sec str，暂做不让七彩石动态下发，后期让用户手动传 sec_str 后，这里才可以删除掉 */
export const PLUGIN_SEC_STR = 'xc_is_cool_bilibalaweiwei';
