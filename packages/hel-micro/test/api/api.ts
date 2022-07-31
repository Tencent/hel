import { appStyleSrv } from 'index';


describe('test appStyleSrv', () => {
  test('appStyleSrv should not be null', () => {
    expect(appStyleSrv).toBeTruthy();
  });

  test('appStyleSrv.fetchStyleByUrlList should be a fn', () => {
    expect(appStyleSrv.fetchStyleByUrlList).toBeInstanceOf(Function);
  });

  test('appStyleSrv.fetchStyleStr should be a fn', () => {
    expect(appStyleSrv.fetchStyleStr).toBeInstanceOf(Function);
  });

  test('appStyleSrv.getStyleStr should be a fn', () => {
    expect(appStyleSrv.getStyleStr).toBeInstanceOf(Function);
  });

  test('appStyleSrv.getStyleUrlList should be a fn', () => {
    expect(appStyleSrv.getStyleUrlList).toBeInstanceOf(Function);
  });

  test('appStyleSrv.isStyleFetched should be a fn', () => {
    expect(appStyleSrv.isStyleFetched).toBeInstanceOf(Function);
  });
});
