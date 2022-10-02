import { getHelDebug, getHelEventBus, helEvents, setAppMeta, setEmitLib, setVersion } from 'hel-micro-core';
import type { IEmitAppInfo } from 'hel-types';
import { preFetchLib } from 'index';
import * as mockData from '../mockData';

const eventBus = getHelEventBus();
getHelDebug().logMode = 1;

describe('test preFetchLib', () => {
  test('preFetchLib should not be null', () => {
    expect(preFetchLib).toBeTruthy();
  });

  test('fetch invalid module', async () => {
    try {
      await preFetchLib('invalid-module', { versionId: '1', apiMode: 'get' });
    } catch (err) {
      expect(err.message).toMatch(/(?=it may be an invalid module)/);
    }
  });

  test('fetch module', async () => {
    try {
      // 模拟模块获取到并发射的行为
      const app = mockData.makeApp();
      // @ts-ignore 保持和 services/app.cacheApp 逻辑一致
      setAppMeta({ __setByLatest: true, ...app });
      setVersion(app.name, mockData.makeVersion());
      setTimeout(() => {
        const libDesc: IEmitAppInfo = {
          platform: 'unpkg',
          appName: 'app',
          appGroupName: 'app',
          versionId: mockData.makeVersion().sub_app_version,
          appProperties: { getNum: () => 1 },
          isLib: true,
          Comp: null,
        };
        setEmitLib(app.name, libDesc);
        eventBus.emit(helEvents.SUB_LIB_LOADED, libDesc);
      }, 500);

      // 开始加载模块
      const lib = await preFetchLib('app');
      expect(lib).toBeTruthy();
      expect(lib.getNum()).toBe(1);
    } catch (err) {
      console.log(err);
      expect(err.message).toMatch(/(?=it may be an invalid module22)/);
    }
  });
});
