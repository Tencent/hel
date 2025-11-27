export const STATUS_OK = '0';

/** hel 模块更新来源 */
export const SET_BY = {
  init: 'init',
  timer: 'timer',
  watch: 'watch',
};

export const HEL_SOCKET_URL = '';

export const UPDATE_MODE = {
  /**
   * 服务于 initMiddleware 同步流程，此模式下优先更新客户端模块，
   * 顺带检查服务端模块是否存在，如存在则异步更新，适用于前后端模块版本可短时间不一致的场景
   */
  clientModFirst: 1,
  /**
   * 服务于 preloadMiddleware 异步流程，此模式下优先更新服务端模块（如存在），
   * 更新成功后再更新客户端模块，适用于需要前后端模块版本强一致的场景
   */
  serverModFirst: 2,
};
