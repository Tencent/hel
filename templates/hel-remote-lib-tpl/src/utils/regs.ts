/**
 * 采取getter模式，让外界来每次获取的都是新的正则表达式
 * 避免同一个表达式反复使用出现bug
 */

const regs = {
  get num1to9() {
    return /^[1-9]+[0-9]*$/;
  },
  /** 必需全部是英文 */
  get en() {
    return /^[A-Za-z]+$/;
  },
  /** 蛇形英文命名方式，且首尾不能是下划线，开头不能是数字 */
  get enSnake() {
    // return /^[a-z][0-9a-z]*(_[0-9a-z]*[a-z]+)+$/;
    return /^[a-z][_0-9a-z]*[a-z0-9]+$/;
  },
  get enOrNumOrUnderline() {
    return /^[A-Za-z0-9_]+$/;
  },
  /** 必需全部是英文或数字 */
  get enOrNum() {
    return /^[A-Za-z0-9]+$/;
  },
};

export default regs;
