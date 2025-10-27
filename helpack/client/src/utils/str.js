import { randomNumber } from './num';

const cache = ['', ' ', '  ', '   ', '    ', '     ', '      ', '       ', '        ', '         '];

/**
 * from leftpad
 * why copy? this lib unpublished before...
 */
export function leftPad(str, len, ch) {
  // convert `str` to a `string`
  str = `${str}`;
  // `len` is the `pad`'s length now
  len = len - str.length;
  // doesn't need to pad
  if (len <= 0) return str;
  // `ch` defaults to `' '`
  // @ts-ignore
  if (!ch && ch !== 0) ch = ' ';
  // convert `ch` to a `string` cuz it could be a number
  ch = `${ch}`;
  // cache common use cases
  if (ch === ' ' && len < 10) return cache[len] + str;
  // `pad` starts with an empty string
  let pad = '';
  // loop
  while (true) {
    // add `ch` to `pad` if `len` is odd
    if (len & 1) pad += ch;
    // divide `len` by 2, ditch the remainder
    len >>= 1;
    // "double" the `ch` so this operation count grows logarithmically on `len`
    // each time `ch` is "doubled", the `len` would need to be "doubled" too
    // similar to finding a value in binary search tree, hence O(log(n))
    if (len) ch += ch;
    // `len` is 0, exit the loop
    else break;
  }
  // pad `str`!
  return pad + str;
}

const letters = [
  'a',
  'A',
  'b',
  'B',
  'c',
  'C',
  'd',
  'D',
  'e',
  'E',
  'f',
  'F',
  'g',
  'G',
  'h',
  'H',
  'i',
  'I',
  'j',
  'J',
  'k',
  'K',
  'l',
  'L',
  'm',
  'M',
  'n',
  'N',
  'o',
  'O',
  'p',
  'P',
  'q',
  'Q',
  'r',
  'R',
  's',
  'S',
  't',
  'T',
  'u',
  'U',
  'v',
  'V',
  'w',
  'W',
  'x',
  'X',
  'y',
  'Y',
  'z',
  'Z',
];
const letterCount = letters.length;

export function genNonceStr(length = 6) {
  let ret = '';
  for (let i = 0; i < length; i++) {
    ret += letters[randomNumber(letterCount)];
  }
  return ret;
}

export function getByteLength(str) {
  let count = 0;
  for (let i = 0, l = str.length; i < l; i++) {
    count += str.charCodeAt(i) <= 128 ? 1 : 2;
  }
  return count;
}

export function getCharCodeSum(/** @type string */ str) {
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }
  return sum;
}

/**
 * @param {(obj:any)=>string} getStr
 * @returns
 */
export function buildStrSorter(getStr) {
  return (o1, o2) => {
    const str1 = getStr(o1);
    const str2 = getStr(o2);
    if (str1 < str2) {
      return -1;
    }
    if (str1 > str2) {
      return 1;
    }
    return 0;
  };
}
