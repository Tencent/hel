import { importNodeMod, mapAndPreload, resolveNodeMod, setGlobalConfig } from '../src';
import './mock/mock-with-real-axios';
import { HEL_DEMO_LIB1, HEL_DEMO_LIB1_VER1, HEL_DEMO_LIB1_VER2, SDK_GLOBAL_CONFIG } from './util/consts';

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
    const firstImportVer = HEL_DEMO_LIB1_VER1;
    // 激活新版本hel模块后再调用
    await importNodeMod(HEL_DEMO_LIB1, { ver: firstImportVer });

    // 注意：因处于 jest 运行环境中时，jset 接管了 import/require，此处解构的 hello 不能感知到最新的代码，
    // 但实际运行中在这里解构是 ok 的，只要在 mapAndPreload 调用之后触发 import/require，模块都会指向代理文件
    // const { hello } = await import(HEL_DEMO_LIB1);
    // expect(hello()).toBe('hel hello v1.0.0');
    const { hello } = await import(HEL_DEMO_LIB1);
    expect(hello()).toBe(`hel hello v${firstImportVer}`);

    const pathInfo = resolveNodeMod(HEL_DEMO_LIB1);
    expect(pathInfo.helModFilePath.includes('/hel_modules/')).toBeTruthy();
    const oriPath = require.resolve(HEL_DEMO_LIB1);
    expect(oriPath.includes('/node_modules/')).toBeTruthy();

    // 激活另一个新版本，复用之前的 hello 句柄
    const mod = await importNodeMod(HEL_DEMO_LIB1, { ver: HEL_DEMO_LIB1_VER2 });
    // 此处不复用上面的 hello 句柄理由见上面注意描述
    // expect(hello()).toBe('hel hello v1.0.0');
    const { hello: h2 } = await import(HEL_DEMO_LIB1);
    expect(h2()).toBe(`hel hello v${HEL_DEMO_LIB1_VER2}`);
  });
});
