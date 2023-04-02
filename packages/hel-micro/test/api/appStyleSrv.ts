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
      expect(appStyleSrv.fetchStyleStr).toBeInstanceOf(Function);
      expect(appStyleSrv.getStyleStr).toBeInstanceOf(Function);
      expect(appStyleSrv.getStyleUrlList).toBeInstanceOf(Function);
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

    test('fetchStyleStr', async () => {
      await preFetchLib('remote-vue-comps-tpl');
      const str = await appStyleSrv.fetchStyleStr('remote-vue-comps-tpl');
      expect(str).toBe('html{width:100%;height:100%;}body{font-size:12px;}p{padding:1px;}');
    });

    test('getStyleStr', async () => {
      await preFetchLib('remote-vue-comps-tpl');
      const str = appStyleSrv.getStyleStr('remote-vue-comps-tpl');
      expect(str).toBe('html{width:100%;height:100%;}body{font-size:12px;}p{padding:1px;}');
    });

    test('getStyleUrlList', async () => {
      await preFetchLib('remote-vue-comps-tpl');
      const list = appStyleSrv.getStyleUrlList('remote-vue-comps-tpl');
      expect(list).toBeTruthy();
      expect(list.length).toBe(2);
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
