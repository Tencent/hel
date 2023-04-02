import { runTest } from '../testKit';
const appName = 'tmpName';

runTest(({ api, describe, util, semverApi, platform }) => {
  const { preFetchApp } = api;

  describe('test preFetchApp', () => {
    beforeAll(() => {
      util.mockEmitAppRootComponent({ app: { name: appName }, platform, semverApi });
    });

    test('preFetchApp should not be null', () => {
      expect(preFetchApp).toBeTruthy();
    });

    test('fetch invalid app root component', async () => {
      try {
        await preFetchApp('invalid-module', { versionId: '1', apiMode: 'get' });
      } catch (err: any) {
        expect(err.message).toMatch(/(?=it may be an invalid module)/);
      }
    });

    test('fetch app root component with localStorage', async () => {
      const compInfo = await preFetchApp(appName, { enableDiskCache: true, storageType: 'localStorage' });
      expect(compInfo.appName).toBe(appName);
      expect(compInfo.Comp).toBeTruthy();
    });

    test('fetch app root component with indexedDB', async () => {
      const compInfo = await preFetchApp(appName, { enableDiskCache: true, storageType: 'indexedDB' });
      expect(compInfo.appName).toBe(appName);
      expect(compInfo.Comp).toBeTruthy();
    });
  });
});
