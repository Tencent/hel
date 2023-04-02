import { runTest } from '../testKit';

runTest(({ api, describe }) => {
  const { emitApp, preFetchApp } = api;

  describe('test emitApp', () => {
    test('emitApp should be function', () => {
      expect(emitApp).toBeInstanceOf(Function);
    });

    test('emitApp should work', async () => {
      const Comp = function FakeComp() {
        return 'FakeComp';
      };
      emitApp({ appGroupName: 'group1', Comp });
      const compInfo = await preFetchApp('group1');
      expect(compInfo.appName).toBe('group1');
    });
  });
});
