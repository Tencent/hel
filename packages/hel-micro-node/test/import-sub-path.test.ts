import { importNodeMod, mapNodeMods, setGlobalConfig } from '../src';
import './mock/mock-with-real-axios';
import { HEL_DEMO_LIB1, HEL_HELLO_HELPACK, SDK_GLOBAL_CONFIG } from './util/consts';

setGlobalConfig(SDK_GLOBAL_CONFIG);
mapNodeMods({
  // 映射为带子路径的hel模块
  [HEL_DEMO_LIB1]: { helModName: `${HEL_HELLO_HELPACK}/srv/hel-hello`, platform: 'hel' },
});

describe('import sub path', () => {
  test('import sub path should work', async () => {
    const { mod } = await importNodeMod(HEL_DEMO_LIB1);
    const { hello } = mod;
    console.log(require.resolve(HEL_DEMO_LIB1));
    expect(hello()).toBe('sub path hel hello');
  });
});
