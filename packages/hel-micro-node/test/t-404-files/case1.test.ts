import { importNodeMod, mapNodeMods, setGlobalConfig } from '../../src';
import '../mock/mock-with-real-axios';
import { HEL_DEMO_LIB1, HEL_HELLO_HELPACK, HEL_HELLO_VER, SDK_GLOBAL_CONFIG } from './../util/consts';

const platform = 'hel';
setGlobalConfig(SDK_GLOBAL_CONFIG);
mapNodeMods({
  [HEL_DEMO_LIB1]: { helModName: `${HEL_HELLO_HELPACK}/srv/hel-hello`, platform },
});

describe('test download 404 files', () => {
  test('should retry 3 times', async () => {
    let retryCount = 0;
    const a404File = 'http://this-is-a-404-not-found-file/just-for-test.js';
    try {
      await importNodeMod(HEL_DEMO_LIB1, {
        ver: HEL_HELLO_VER,
        reuseLocalFiles: false,
        prepareFiles: async (params) => {
          retryCount += 1;
          await params.downloadFile(a404File, params.filePaths[0].fileLocalPath);
        },
      });
    } catch (err: any) {
      console.log(err);
      expect(err.message.includes('ENOTFOUND')).toBeTruthy();
    }

    // 内部应重试3次
    expect(retryCount).toBe(3);

    // importNodeMod 失败，调用的应是 node_modules 目录下的包的方法
    const { hello } = await import(HEL_DEMO_LIB1);
    console.log(require.resolve(HEL_DEMO_LIB1));
    expect(hello()).toBe('hel hello v1.0.3');
  });
});
