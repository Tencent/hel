import { appParamSrv, preFetchLib } from 'index';
import * as util from '../util';

describe('test appParamSrv', () => {
  test('appParamSrv should not be null', () => {
    expect(appParamSrv).toBeTruthy();
    expect(appParamSrv.getGroupedStyleList).toBeInstanceOf(Function);
    expect(appParamSrv.getPlatAndVer).toBeInstanceOf(Function);
  });

  test('getGroupedStyleList', async () => {
    util.mockLoadModule({ platform: 'hel' });
    await preFetchLib('remote-vue-comps-tpl', { platform: 'hel' });
    const map = await appParamSrv.getGroupedStyleList('remote-vue-comps-tpl', { platform: 'hel' });
    expect(map.static.length).toBe(0);
    expect(map.build.length).toBe(2);
  });

  test('getPlatAndVer', async () => {
    const mockData = util.mockLoadModule();
    await preFetchLib('remote-vue-comps-tpl');
    const data = await appParamSrv.getPlatAndVer('remote-vue-comps-tpl');
    expect(data.versionId).toBe(mockData.version.sub_app_version);
  });
});
