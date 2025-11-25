import { importNodeMod, mapAndPreload, resolveNodeMod, setGlobalConfig } from '../src';
import './mock/mock-with-real-axios';
import { HEL_DEMO_LIB1, HEL_DEMO_LIB1_LATEST_VER, HEL_DEMO_LIB1_VER1, HEL_DEMO_LIB1_VER2, SDK_GLOBAL_CONFIG } from './util/consts';

setGlobalConfig(SDK_GLOBAL_CONFIG);

describe('test native require', () => {
  test('see hello result', async () => {
    const nativePath = require.resolve(HEL_DEMO_LIB1);
    expect(nativePath.includes('/node_modules/')).toBeTruthy();
    try {
      resolveNodeMod(HEL_DEMO_LIB1);
    } catch (err: any) {
      expect(err.message.includes('Unmapped node module')).toBeTruthy();
    }
    await mapAndPreload({
      [HEL_DEMO_LIB1]: true,
    });
    const { hello } = await import(HEL_DEMO_LIB1);
    expect(hello()).toBe(`hel hello v${HEL_DEMO_LIB1_LATEST_VER}`);

    // 激活新版本hel模块后再调用
    await importNodeMod(HEL_DEMO_LIB1, { ver: HEL_DEMO_LIB1_VER2 });
    expect(hello()).toBe(`hel hello v${HEL_DEMO_LIB1_VER2}`);

    const pathInfo = resolveNodeMod(HEL_DEMO_LIB1);
    expect(pathInfo.helModFilePath.includes('/hel_modules/')).toBeTruthy();
    const oriPath = require.resolve(HEL_DEMO_LIB1);
    expect(oriPath.includes('/node_modules/')).toBeTruthy();

    // 激活另一个新版本，复用之前的 hello 句柄
    await importNodeMod(HEL_DEMO_LIB1, { ver: HEL_DEMO_LIB1_VER1 });
    expect(hello()).toBe(`hel hello v${HEL_DEMO_LIB1_VER1}`);
  });
});
