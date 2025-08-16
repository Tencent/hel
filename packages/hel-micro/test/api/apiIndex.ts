import { runTest } from '../testKit';

runTest(({ api, describe }) => {
  describe('test apiIndex', () => {
    test('expose 24 apis', () => {
      expect(api).toBeTruthy();
      expect(Object.keys(api).filter((apiName) => apiName !== 'default').length).toBe(24);
    });
  });
});
