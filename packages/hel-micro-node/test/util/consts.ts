import * as path from 'path';
import type { IBaseConfig } from '../../src';

export const HEL_HELLO_HELPACK = 'hel-hello-helpack';

/** 这一版没有包含任何服务端模块产物 */
export const HEL_HELLO_NO_SERVER_FILES_VER = '20250808092441';

/** 这个版本包含服务端模块，且有带子路径的模块 */
export const HEL_HELLO_SUB_PATH = '20251121090408';

/** 这个版本服务端模块带子路径 */
export const HEL_HELLO_VER = '20251121090826';

export const HEL_DEMO_LIB1 = '@hel-demo/mono-libs';

export const HEL_DEMO_LIB1_VER1 = '1.0.1';

export const HEL_DEMO_LIB1_VER2 = '1.0.2';

export const HEL_DEMO_LIB1_LATEST_VER = '1.0.3';

export const HEL_HELLO_VER2 = '20250809053212';

// 本地单测时获取真实的hel元数据需要走https，否则 axios 会报错
export const HEL_API_URL = 'https://helmicro.com/openapi/meta';

export const DATA_DIR = path.join(__dirname, '../data');

export const BACKUP_DATA_FILE = path.join(__dirname, '../data/backup-data.json');

export const HEL_MODULES_DIR = path.join(__dirname, '../hel_modules');

export const HEL_PROXY_MODULES_DIR = path.join(__dirname, '../hel_proxy_modules');

export const MOD_NPM_NAME = 'hel-hello';

export const SDK_GLOBAL_CONFIG: IBaseConfig = {
  helModulesDir: HEL_MODULES_DIR,
  helProxyFilesDir: HEL_PROXY_MODULES_DIR,
  dangerouslySetDirPath: true,
};
