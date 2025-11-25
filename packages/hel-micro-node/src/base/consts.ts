import * as path from 'path';
import { purify } from './util';

const { SUMERU_CONTAINER_NAME, WORKER_ID, SUMERU_ENV, NODE_APP_INSTANCE } = process.env;

export const PLATFORM = 'unpkg';

export const PLATFORM_HEL = 'hel';

export const HEL_API_URL = 'https://unpkg.com';

export const HELPACK_API_URL = 'https://helmicro.com/openapi/meta';

export const SDK_NAME = 'hel-micro-node';

/** 应用自身数据变化 */
export const CHANNEL_APP_INFO_CHANGED = 'appInfoChanged';

/** 应用版本数据变化 */
export const CHANNEL_APP_VERSION_CHANGED = 'appVersionChanged';

/**
 * hel-micro-node 所在的的 node_modules 的位置
 */
export const SDK_PKG_ROOT = path.join(__dirname, '../../');

/** hel 基础包 cdn 地址，用户在 initMiddleware 时可覆盖此值 */
export const HEL_SDK_SRC = 'https://tnfe.gtimg.com/hel-runtime/level1/hel-base-v28.js';

export const SERVER_INFO = {
  containerName: SUMERU_CONTAINER_NAME || '',
  workerId: WORKER_ID || NODE_APP_INSTANCE || 0,
  env: SUMERU_ENV || '',
};

/** 内部维护的环境变量，可能会被 init-middleware 时调用 setCtxEnv 重写部分用户自定义值 */
export const CTX_ENV = {
  isProd: SERVER_INFO.env === 'formal',
};

export function setCtxEnv(options: Partial<typeof CTX_ENV>) {
  const pured = purify(options);
  Object.assign(CTX_ENV, pured);
}

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
