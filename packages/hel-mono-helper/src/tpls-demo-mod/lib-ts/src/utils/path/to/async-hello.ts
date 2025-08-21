/**
 * 延迟多少米后执行剩余的逻辑
 */
export function delay(ms = 1000) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * 异步地对 hel 说你好
 */
export async function helloAsync() {
  await delay();
  return 'sync hel hello v2.2';
}
