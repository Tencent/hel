import { runTest } from '../testKit';

runTest(({ api, describe, isIns }) => {
  const { appMetaSrv, core } = api;

  describe('test appMetaSrv', () => {
    test('appMetaSrv should not be null', () => {
      expect(appMetaSrv).toBeTruthy();
      expect(appMetaSrv.getMetaDataUrl).toBeInstanceOf(Function);
      expect(appMetaSrv.getSubAppMeta).toBeInstanceOf(Function);
      expect(appMetaSrv.getSubAppVersion).toBeInstanceOf(Function);
    });

    test('getMetaDataUrl', async () => {
      const str = appMetaSrv.getMetaDataUrl('remote-vue-comps-tpl');
      expect(str.endsWith('openapi/v1/app/info/getSubAppAndItsVersion?name=remote-vue-comps-tpl')).toBeTruthy();
      if (isIns) {
        expect(str.startsWith('http')).toBeTruthy();
      } else {
        expect(str.includes(core.helConsts.DEFAULT_API_URL)).toBeTruthy();
      }
    });

    test('getMetaDataUrl options.protocol=https', async () => {
      const str = appMetaSrv.getMetaDataUrl('remote-vue-comps-tpl', { protocol: 'https' });
      console.log('getMetaDataUrl str is ', str);
      if (isIns) {
        expect(str.startsWith('https')).toBeTruthy();
      } else {
        expect(str.includes(core.helConsts.DEFAULT_API_URL)).toBeTruthy();
      }
    });

    test('getMetaDataUrl options.protocol=http', async () => {
      const str = appMetaSrv.getMetaDataUrl('remote-vue-comps-tpl', { protocol: 'http' });
      if (isIns) {
        expect(str.startsWith('http')).toBeTruthy();
      } else {
        expect(str.includes(core.helConsts.DEFAULT_API_URL)).toBeTruthy();
      }
    });

    test('getSubAppMeta', async () => {
      const meta = await appMetaSrv.getSubAppMeta('remote-vue-comps-tpl', { apiMode: 'get' });
      expect(meta.app).toBeTruthy();
      expect(meta.version).toBeTruthy();
      expect(meta.app.name).toBe('remote-vue-comps-tpl');
    });

    test('getSubAppVersion', async () => {
      const versionData = await appMetaSrv.getSubAppVersion('remote-vue-comps-tpl_20220602022833', {
        appName: 'remote-vue-comps-tpl',
        apiMode: 'get',
        platform: 'hel',
      });
      expect(versionData.sub_app_version).toBe('remote-vue-comps-tpl_20220602022833');
    });
  });
});
