import { getGlobalThis } from 'hel-micro-core';
import { bindReactRuntime } from 'index';

describe('test bindReactRuntime', () => {
  test('bindReactRuntime should be function', () => {
    expect(bindReactRuntime).toBeInstanceOf(Function);
  });

  test('bindReactRuntime should work', () => {
    bindReactRuntime({ React: { tip: 'fake React' }, ReactDOM: { tip: 'fake ReactDOM' } });
    expect(getGlobalThis().LEAH_React).toBeTruthy();
    expect(getGlobalThis().LEAH_ReactDOM).toBeTruthy();
  });
});
