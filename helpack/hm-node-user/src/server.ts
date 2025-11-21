import { mapAndPreload } from './libs/hmnLib';

export async function startServer() {
  try {
    console.log('s 1111111111111111111111111');
    await mapAndPreload({
      '@hel-demo/mono-libs': true,
    });
    console.log('s 2222222222222222222222222222222');

    // 返回启动整个应用的句柄
    const { start } = await import('./at/core/runApp');
    start();
  } catch (err) {
    console.error('start failed: ', err);
  }
}
