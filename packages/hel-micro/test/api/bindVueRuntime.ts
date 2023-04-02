import { runTest } from '../testKit';

runTest(({ api, describe }) => {
  const { bindVueRuntime, core } = api;
  const { getGlobalThis } = core;

  describe('test bindVueRuntime', () => {
    test('bindVueRuntime should be function', () => {
      expect(bindVueRuntime).toBeInstanceOf(Function);
    });

    test('bindVueRuntime should work', () => {
      bindVueRuntime({ Vue: { tip: 'fake Vue' } });
      expect(getGlobalThis().LEAH_Vue).toBeTruthy();
    });
  });
});
