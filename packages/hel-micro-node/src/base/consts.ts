import * as path from 'path';
import { IEnvInfo } from './types-srv-mod';

const { SUMERU_ENV, SUMERU_CONTAINER_NAME, WORKER_ID, NODE_APP_INSTANCE } = process.env;

/**
 * hel-micro-node 所在的的 node_modules 的位置
 */
export const SDK_PKG_ROOT = path.join(__dirname, '../../');

export const VER = '0.2.0';

export const PLATFORM = 'unpkg';

export const PLATFORM_HEL = 'hel';

export const HEL_API_URL = 'https://unpkg.com';

export const HELPACK_API_URL = 'https://helmicro.com/openapi/meta';

export const SDK_NAME = 'hel-micro-node';

export const HEL_DIR_KEYS = ['helModulesDir', 'helProxyFilesDir', 'helLogFilesDir'];

export const HEL_MOD_VIEW_MIDDLEWARE = 'hel-mod-view-middleware';

/** 定时更新的时间间隔，3 min */
export const UPDATE_INTERVAL = 3 * 60 * 1000;

/** 应用自身数据变化 */
export const CHANNEL_APP_INFO_CHANGED = 'appInfoChanged';

/** 应用版本数据变化 */
export const CHANNEL_APP_VERSION_CHANGED = 'appVersionChanged';

/** hel 基础包 cdn 地址，用户在 initMiddleware 时可覆盖此值 */
export const HEL_SDK_SRC = 'https://tnfe.gtimg.com/hel-runtime/level1/hel-base-v28.js';

/** 内部默认的推导值，支撑用户 setGlobalConfig 重写 getEnvInfo 后来覆盖此默认值 */
export const SERVER_INFO: IEnvInfo = {
  containerName: SUMERU_CONTAINER_NAME || '',
  workerId: WORKER_ID || NODE_APP_INSTANCE || '0',
  envName: SUMERU_ENV || '',
  city: '',
  containerIP: '',
  podName: '',
  imgVersion: '',
};

export const CODE = {
  success: 200,
};

export const AS_TRUE = '1';

export const AS_FALSE = '0';

export const HOOK_TYPE = {
  onInitialHelMetaFetched: 'onInitialHelMetaFetched',
  onHelModLoaded: 'onHelModLoaded',
  onMessageReceived: 'onMessageReceived',
} as const;

export const STATUS_OK = '0';

/** hel 模块更新来源 */
export const SET_BY = {
  init: 'init',
  timer: 'timer',
  watch: 'watch',
};

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
