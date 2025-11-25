import { importNodeMod, mapNodeMods, resolveNodeMod, setGlobalConfig, setPlatformConfig } from '../src';
import './mock/mock-with-real-axios';
import { HEL_DEMO_LIB1, HEL_DEMO_LIB1_VER1, SDK_GLOBAL_CONFIG } from './util/consts';
// 提前使用原生 import 载入 node 模块
// 代码: https://github.com/hel-eco/hel-mono-dev/tree/main/packages/hel-demo-lib1
import { hello } from 'hel-demo-lib1';

setGlobalConfig(SDK_GLOBAL_CONFIG);
setPlatformConfig({
  platform: 'unpkg',
});

mapNodeMods({
  [HEL_DEMO_LIB1]: true,
});

describe('test native import node mod before importNodeMod', () => {
  test('map-node-mod ', async () => {
    const oriPath = require.resolve(HEL_DEMO_LIB1);
    expect(oriPath.includes('/node_modules/')).toBeTruthy();
    try {
      resolveNodeMod(HEL_DEMO_LIB1);
    } catch (err: any) {
      expect(err.message.includes('not preloaded')).toBeTruthy();
    }

    expect(hello()).toBe('hel hello v1.0.0');

    // 头部导入后，这里在触发hel模块激活逻辑
    const { mod } = await importNodeMod(HEL_DEMO_LIB1, { ver: HEL_DEMO_LIB1_VER1 });
    // 此时 hello 始终指向原始模块，结果不再是 v1.0.1
    expect(hello()).toBe('hel hello v1.0.0');
    // mod.hello 是最新版本代码
    expect(mod.hello()).toBe('hel hello v1.0.1');
  });
});
