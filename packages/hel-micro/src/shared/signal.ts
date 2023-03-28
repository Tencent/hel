import * as core from 'hel-micro-core';

/**
 * 此方法已不鼓励使用，请尽快替换为 hel-iso 包体里的 isSubApp
 * 因为当 hel-micro/hel-lib-proxy 提升到 webpack external 里时，此方法将返回错误结果
 * 此处保留是为了让老用户升级到最新版本时，如未使用 hel-micro/hel-lib-proxy external 模式依然能够编译通过并正常运行
 * @deprecated
 */
export function isSubApp() {
  return core.isSubApp();
}
