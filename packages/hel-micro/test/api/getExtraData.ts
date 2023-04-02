import { runTest } from '../testKit';

runTest(({ api, describe }) => {
  const { getExtraData, setExtraData } = api;

  describe('test getExtraData', () => {
    test('getExtraData should be function', () => {
      expect(getExtraData).toBeInstanceOf(Function);
    });

    test('getExtraData should work', () => {
      const obj = { key1: 1, key2: true };
      setExtraData('app1', obj, true);
      const parsedObj = getExtraData('app1', true);
      expect(parsedObj.key1).toBe(obj.key1);
      expect(parsedObj.key2).toBe(obj.key2);
    });
  });
});
