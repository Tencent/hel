import { sayHelloToHel } from '../myMod';

/**
 * @author fancyzhong
 * @priority P0
 * @casetype unit
 */
describe('test myMod', () => {
  test('sayHelloToHel', () => {
    const yourRtxName = ''; // 此处改写为你的rtx名字
    const ret = `hello hel, I am ${yourRtxName}, I come from bj`;
    expect(sayHelloToHel('bj') === ret).toBeTruthy();
  });
});
