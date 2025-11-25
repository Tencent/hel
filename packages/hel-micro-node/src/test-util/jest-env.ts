/**
 * 是否处于 jest 环境中在运行
 */
export function isRunInJest() {
  return !!process.env.JEST_WORKER_ID;
}
