import { runTest } from '../testKit';

runTest(({ api, describe, util, semverApi, platform }) => {
  const { appParamSrv, preFetchLib } = api;

  describe('test appParamSrv', () => {
    // test('appParamSrv should not be null', () => {
    //   expect(appParamSrv).toBeTruthy();
    //   expect(appParamSrv.getGroupedStyleList).toBeInstanceOf(Function);
    //   expect(appParamSrv.getPlatAndVer).toBeInstanceOf(Function);
    // });

    test('getGroupedStyleList', async () => {
      util.mockEmitModule({ platform, semverApi });
      await preFetchLib('remote-vue-comps-tpl', { semverApi });
      const map = await appParamSrv.getGroupedStyleList('remote-vue-comps-tpl');
      expect(map.static.length).toBe(0);
      expect(map.build.length).toBe(2);
    });

    // test('getPlatAndVer', async () => {
    //   const mockData = util.mockEmitModule({ platform, semverApi });
    //   await preFetchLib('remote-vue-comps-tpl');
    //   const data = await appParamSrv.getPlatAndVer('remote-vue-comps-tpl');
    //   expect(data.versionId).toBe(mockData.version.sub_app_version);
    // });
  });
});
