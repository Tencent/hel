import { runTest } from '../testKit';

runTest(({ api, describe, util, semverApi, platform }) => {
  const { appStyleSrv, preFetchLib } = api;

  describe('test appStyleSrv', () => {
    beforeAll(() => {
      util.mockEmitModule({ semverApi, platform });
    });

    test('appStyleSrv should not be null', () => {
      expect(appStyleSrv).toBeTruthy();
      expect(appStyleSrv.fetchStyleByUrlList).toBeInstanceOf(Function);
      expect(appStyleSrv.fetchAppStyleData).toBeInstanceOf(Function);
      expect(appStyleSrv.getAppStyleStr).toBeInstanceOf(Function);
      expect(appStyleSrv.getAppCssList).toBeInstanceOf(Function);
      expect(appStyleSrv.isStyleFetched).toBeInstanceOf(Function);
    });

    test('fetchStyleByUrlList', async () => {
      await preFetchLib('remote-vue-comps-tpl');
      const cssList = [
        'https://tnfe.gtimg.com/hel/remote-vue-comps-tpl_20220602022833/css/chunk1.css',
        'https://tnfe.gtimg.com/hel/remote-vue-comps-tpl_20220602022833/css/chunk2.css',
      ];
      const str = await appStyleSrv.fetchStyleByUrlList(cssList);
      expect(str).toBe('html{width:100%;height:100%;}body{font-size:12px;}p{padding:1px;}');
    });

    test('fetchAppStyleData', async () => {
      await preFetchLib('remote-vue-comps-tpl');
      const res = await appStyleSrv.fetchAppStyleData('remote-vue-comps-tpl', { cssListToStr: true });
      expect(res.renderStyleStr).toBe('html{width:100%;height:100%;}body{font-size:12px;}p{padding:1px;}');
    });

    test('getAppStyleStr', async () => {
      await preFetchLib('remote-vue-comps-tpl');
      const str = appStyleSrv.getAppStyleStr('remote-vue-comps-tpl');
      expect(str).toBe('html{width:100%;height:100%;}body{font-size:12px;}p{padding:1px;}');
    });

    test('getAppCssList', async () => {
      await preFetchLib('remote-vue-comps-tpl');
      const res = appStyleSrv.getAppCssList('remote-vue-comps-tpl');
      expect(res.buildCssList).toBeTruthy();
      expect(res.buildCssList.length).toBe(2);
    });

    test('isStyleFetched with preFetchLib', async () => {
      await preFetchLib('remote-vue-comps-tpl');
      const isFetched = appStyleSrv.isStyleFetched('remote-vue-comps-tpl');
      expect(isFetched).toBeTruthy();
    });

    test('isStyleFetched with no preFetchLib', async () => {
      const isFetched = appStyleSrv.isStyleFetched('someLib');
      expect(isFetched).toBeFalsy();
    });
  });
});
