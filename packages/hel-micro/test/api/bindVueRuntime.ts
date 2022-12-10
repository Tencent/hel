import { getGlobalThis } from 'hel-micro-core';
import { bindVueRuntime } from 'index';

describe('test bindVueRuntime', () => {
  test('bindVueRuntime should be function', () => {
    expect(bindVueRuntime).toBeInstanceOf(Function);
  });

  test('bindVueRuntime should work', () => {
    bindVueRuntime({ Vue: { tip: 'fake Vue' } });
    expect(getGlobalThis().LEAH_Vue).toBeTruthy();
  });
});
