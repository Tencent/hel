/*
|--------------------------------------------------------------------------
| ATTENTION:
| 此包只能被每个应用独立安装，将此包提升到 external 将会导致 isSubApp 失效
|--------------------------------------------------------------------------
*/

/**
 * 判断当前应用（模块）是否是子应用
 */
export function isSubApp(): boolean;

/**
 * 判断当前应用（模块）是否是主应用
 */
export function isMasterApp(): boolean;

declare type DefaultExport = {
  isSubApp: typeof isSubApp;
  isMasterApp: typeof isMasterApp;
};

declare const defaultExport: DefaultExport;
export default defaultExport;
