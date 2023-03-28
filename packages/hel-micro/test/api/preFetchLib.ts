import { runTest } from '../testKit';

runTest(({ api, describe, util, semverApi, platform }) => {
  const { preFetchLib } = api;

  describe('test preFetchLib', () => {
    beforeAll(() => {
      util.mockEmitModule({ semverApi, platform });
    });

    test('preFetchLib should not be null', () => {
      expect(preFetchLib).toBeTruthy();
    });

    test('fetch invalid module', async () => {
      try {
        await preFetchLib('invalid-module', { versionId: '1', apiMode: 'get' });
      } catch (err: any) {
        expect(err.message).toMatch(/(?=it may be an invalid module)/);
      }
    });

    test('fetch module with localStorage', async () => {
      // 开始加载模块
      const lib = await preFetchLib('remote-vue-comps-tpl', { enableDiskCache: true, storageType: 'localStorage' });
      expect(lib).toBeTruthy();
      expect(lib.getNum()).toBe(1);
    });

    test('fetch module with indexedDB', async () => {
      // 开始加载模块
      const lib = await preFetchLib('remote-vue-comps-tpl', { enableDiskCache: true, storageType: 'indexedDB' });
      expect(lib).toBeTruthy();
      expect(lib.getNum()).toBe(1);
    });
  });
});
