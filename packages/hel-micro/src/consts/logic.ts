export const styleFetchStatus = {
  NO_FETCH: 1,
  FETCHED: 2,
};

/** api 服务模块的相关常量 */
export const apiSrvConst = {
  GET_APP_AND_VER: 'getSubAppAndItsVersion',
  GET_APP_AND_FULL_VER: 'getSubAppAndItsFullVersion',
  BATCH_GET_APP_AND_VER: 'batchGetSubAppAndItsVersion',
  BATCH_GET_APP_AND_FULL_VER: 'batchGetSubAppAndItsFullVersion',
  GET_APP_VER: 'getSubAppVersion',
  GET_APP_FULL_VER: 'getSubAppFullVersion',
} as const;

export const PLAT_UNPKG = 'unpkg';

export const API_NORMAL_GET = 'get';

export const JSONP_MARK = 'Jsonp';
