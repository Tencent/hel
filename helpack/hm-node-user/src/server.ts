import { mapAndPreload, setGlobalConfig } from './libs/hmnLib';

export async function startServer() {
  setGlobalConfig({
    // 允许虚拟的 node 模块存在
    strict: false,
  });

  try {
    await mapAndPreload({
      '@hel-demo/mono-libs': true,
      // 这是一个未安装到项目里的虚拟模块，可以被程序 import
      'hel-hello-helpack': {
        platform: 'hel',
        modShape: { fnKeys: ['hello'] },
      },
    });

    // 返回启动整个应用的句柄
    const { start } = await import('./at/core/runApp');
    start();
  } catch (err) {
    console.error('start failed: ', err);
  }
}
