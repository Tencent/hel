/* eslint-disable @typescript-eslint/no-require-imports */
import { mapAndPreload, resolveNodeMod } from '../src';
import './mock';
import { HEL_HELLO_HELPACK } from './util/consts';
import { getResultBeforeMock, updateLib } from './util/updator';

describe('test mapNodeMods', () => {
  test('update to different vers', async () => {
    // 初始版本来自 node_modules，结果应是 hel-hello v1.0.0
    expect(getResultBeforeMock()).toBe('hel-hello v1.0.0');
    await mapAndPreload({
      [HEL_HELLO_HELPACK]: { platform: 'hel' },
    });

    // 更新至本地模块文件 mod-v1，代码见 test/data/mod-v1
    updateLib('mod-v1');
    const helHelloV1 = require('hel-hello');
    expect(helHelloV1.hello()).toBe('hello v1');
    const result1 = resolveNodeMod(HEL_HELLO_HELPACK);
    expect(result1.helModFilePath.endsWith('/mod-v1/index.js')).toBeTruthy();
    expect(result1.helModFilePath.includes('/.hel_modules/')).toBeTruthy();
    expect(result1.isMainMod).toBeTruthy();

    // 更新至本地模块文件 mod-v2，代码见 test/data/mod-v2
    updateLib('mod-v2');
    const helHelloV2 = require('hel-hello');
    expect(helHelloV2.hello()).toBe('hello v2');
    const result2 = resolveNodeMod(HEL_HELLO_HELPACK);
    expect(result2.helModFilePath.endsWith('/mod-v2/index.js')).toBeTruthy();
    expect(result2.helModFilePath.includes('/.hel_modules/')).toBeTruthy();
    expect(result2.isMainMod).toBeTruthy();

    // 更新至本地模块文件 mod-v1，代码见 test/data/mod-v1
    updateLib('mod-v1');
    const helHelloV1Again = require('hel-hello');
    expect(helHelloV1Again.hello()).toBe('hello v1');
    const result3 = resolveNodeMod(HEL_HELLO_HELPACK);
    expect(result3.helModFilePath.endsWith('/mod-v1/index.js')).toBeTruthy();
    expect(result3.helModFilePath.includes('/.hel_modules/')).toBeTruthy();
    expect(result3.isMainMod).toBeTruthy();
  });
});
