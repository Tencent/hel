import path from 'path';
import { mapAndPreload, setGlobalConfig } from './libs/hmn';

export async function startServer() {
  setGlobalConfig({
    // 允许虚拟的 node 模块存在
    strict: false,
    shouldAcceptVersion(params) {
      // 可参考 params 提供参数确定是否接受新版本
      console.log('params', params);
      return true;
    },
  });

  try {
    await mapAndPreload({
      // 未指定模块时，模块来自于那个平台取决于 mapAndPreload 是原始库导出的还是封装库导出的
      // 原始库导出的则模块默认来自于 unpkg 平台
      // 封装后导出的则模块默认来自于 hel 平台
      '@hel-demo/mono-libs': true,
      // 这是一个未安装到项目里的虚拟模块，映射为hel模块，可以被程序 import
      'hel-hello-helpack': {
        // 强制指定此模块来自于 hel 平台
        platform: 'hel',
        // 指定其元数据请求路径前缀，如不指定具体路径，具体请求路径取决于由 mapAndPreload 原始库导出的还是封装库导出的
        helpackApiUrl: 'https://helmicro.com/openapi/meta',
        modShape: { fnKeys: ['hello'] },
        // ver: '1.1.0',
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
    console.error('start failed: ', err.message);
  }
}
