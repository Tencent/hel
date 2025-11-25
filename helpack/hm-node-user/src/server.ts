import path from 'path';
import { mapAndPreload, setGlobalConfig } from './libs/hmn';

export async function startServer() {
  setGlobalConfig({
    // 允许虚拟的 node 模块存在
    strict: false,
  });

  try {
    await mapAndPreload({
      '@hel-demo/mono-libs': true,
      // 这是一个未安装到项目里的虚拟模块，映射为hel模块，可以被程序 import
      'hel-hello-helpack': {
        platform: 'hel',
        helpackApiUrl: 'https://helmicro.com/openapi/meta',
        modShape: { fnKeys: ['hello'] },
      },
      // 这是一个未安装到项目里的虚拟模块，映射为本地磁盘模块，可以被程序 import
      'my-mod': {
        fallback: {
          force: true,
          path: path.join(__dirname, '../my-mod/lib-v1/srv/index.js'),
        },
      },
    });

    // 返回启动整个应用的句柄
    const { start } = await import('./at/core/runApp');
    start();
  } catch (err) {
    console.error('start failed: ', err);
  }
}
