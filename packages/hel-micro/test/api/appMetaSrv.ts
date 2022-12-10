import { appMetaSrv } from 'index';

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
    expect(str.startsWith('http')).toBeTruthy();
  });

  test('getMetaDataUrl options.protocol=https', async () => {
    const str = appMetaSrv.getMetaDataUrl('remote-vue-comps-tpl', { protocol: 'https' });
    expect(str.startsWith('https')).toBeTruthy();
  });

  test('getMetaDataUrl options.protocol=http', async () => {
    const str = appMetaSrv.getMetaDataUrl('remote-vue-comps-tpl', { protocol: 'http' });
    expect(str.startsWith('http')).toBeTruthy();
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
