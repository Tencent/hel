import { runTest } from '../testKit';

runTest(({ api, describe }) => {
  const { setExtraData, core } = api;
  const { getGlobalThis } = core;

  describe('test setExtraData', () => {
    test('setExtraData should be function', () => {
      expect(setExtraData).toBeInstanceOf(Function);
    });

    test('setExtraData should work', () => {
      setExtraData('app1', { key1: 1, key2: true }, true);
      const str = getGlobalThis().localStorage.getItem('HelExtraData.app1');
      expect(str).toBe('{"key1":1,"key2":true}');
    });
  });
});
