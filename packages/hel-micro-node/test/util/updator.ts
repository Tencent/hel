/* eslint-disable @typescript-eslint/no-require-imports */
import { mapNodeMods, requireNodeMod } from '../../src';
import { HEL_HELLO_HELPACK } from '../util/consts';
import { updateModTo } from './mod';
// 提前获取结果
const helHello = require('hel-hello');

const resultBeforeMock = helHello.hello();

export function getResultBeforeMock() {
  return resultBeforeMock;
}

// 模块映射
mapNodeMods({ 'hel-hello': { helModName: HEL_HELLO_HELPACK, resolveRawMod: false } });

/**
 * 更新模块至指定版本后，
 * 调用 sdk 的 requireNodeMod 获取模块实例，并对接 jest.doMock 做模块替换
 */
export function updateLib(ver: string) {
  updateModTo(HEL_HELLO_HELPACK, ver);
  jest.doMock('hel-hello', () => requireNodeMod(HEL_HELLO_HELPACK));
}
