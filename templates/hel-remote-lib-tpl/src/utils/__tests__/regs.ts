import regs from '../regs';

/**
 * @author fancyzhong
 * @priority P0
 * @casetype unit
 */
describe('test regs', () => {
  test('regs', () => {
    expect(regs.en.test('123')).toBeFalsy();
    expect(regs.en.test('abc')).toBeTruthy();

    expect(regs.num1to9.test('123')).toBeTruthy();
    expect(regs.num1to9.test('abc')).toBeFalsy();

    expect(regs.enSnake.test('ab_cc')).toBeTruthy();
    expect(regs.enSnake.test('_aa_cc')).toBeFalsy();

    expect(regs.enOrNum.test('ab_cc')).toBeFalsy();
    expect(regs.enOrNum.test('aa11cc22AA')).toBeTruthy();
  });
});
