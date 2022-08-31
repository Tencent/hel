import regs from './regs';

/**
 * 检查输入值是否能转化为数字且没有包含其他除.以外的非法字符
 * input: '22.s' ---> outpur: false
 * input: '22.1' ---> outpur: true
 * input: '22' ---> outpur: true
 * input: 22 ---> outpur: true
 * input: 22.1 ---> outpur: true
 * @param val
 */
export function canBeNum(val: any) {
  const valType = typeof val;
  if (valType === 'string') {
    if (val.includes('.')) {
      const pureStr = val.replace(/\./g, '');
      // 去掉.之后，如果还包含有其他字符，则直接返回false
      if (!regs.num1to9.test(pureStr)) return false;

      const parsed = parseFloat(val);
      return !Number.isNaN(parsed);
    }
    return regs.num1to9.test(val);
  } if (valType === 'number') {
    return true;
  }
  return false;
}

export function random(seed: number) {
  return Math.floor(seed * Math.random());
  // return 10000;
  // return 888;
}
