import defaults from 'consts/defaults';
import { getGlobalThis } from 'hel-micro-core';
import { setExtraData } from 'index';

describe('test setExtraData', () => {
  test('setExtraData should be function', () => {
    expect(setExtraData).toBeInstanceOf(Function);
  });

  test('setExtraData should work', () => {
    setExtraData('app1', { key1: 1, key2: true }, true);
    const str = getGlobalThis().localStorage.getItem(`${defaults.EXTRA_DATA_PREFIX}.app1`);
    expect(str).toBe('{"key1":1,"key2":true}');
  });
});
