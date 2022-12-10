import { getGlobalThis } from 'hel-micro-core';
import { bindExternals } from 'index';

describe('test bindExternals', () => {
  test('bindExternals should be function', () => {
    expect(bindExternals).toBeInstanceOf(Function);
  });

  test('bindExternals should work', () => {
    bindExternals({ mod1: { fn: () => 'mod1' } });
    expect(getGlobalThis().mod1).toBeTruthy();
    expect(getGlobalThis().mod1.fn() === 'mod1').toBeTruthy();
  });
});
