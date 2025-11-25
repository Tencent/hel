/* eslint-disable @typescript-eslint/no-require-imports */
import { mapAndPreload } from '../src';
import './mock';

describe('test mapNodeMods map self', () => {
  // 注意：此测试仅适用于 jest 测试，
  // 实际运行情况是一旦先 require 再 mapAndPreload，后续的 require 并不会指向 hel 代理模块
  test('map hel-hello', async () => {
    // 处于 node_modules 的模块版本是 1.0.0
    const helHelloRaw = require('hel-hello');
    expect(helHelloRaw.hello()).toBe('hel-hello v1.0.0');

    const modInfoList = await mapAndPreload({ 'hel-hello': true });
    expect(modInfoList.length).toBe(1);
    const modInfo = modInfoList[0];
    expect(modInfo.name).toBe('hel-hello');

    // 已被 hel 加载为 1.0.1 版本
    const helHello = require('hel-hello');
    expect(helHello.hello()).toBe('hel-hello v1.0.1');
  });
});
