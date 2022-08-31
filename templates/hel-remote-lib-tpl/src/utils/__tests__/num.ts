import { canBeNum } from '../num';

/**
 * @author fancyzhong
 * @priority P0
 * @casetype unit
 */
describe('test num util', () => {
  test('canBeNum should works as expect', () => {
    expect(canBeNum(1)).toBeTruthy();
    expect(canBeNum(1.0)).toBeTruthy();
    expect(canBeNum('1')).toBeTruthy();
    expect(canBeNum('1.')).toBeTruthy();
    expect(canBeNum('1.0')).toBeTruthy();
    expect(canBeNum('1.s')).toBeFalsy();
    expect(canBeNum('1s')).toBeFalsy();
    expect(canBeNum(null)).toBeFalsy();
  });
});
