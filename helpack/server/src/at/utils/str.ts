function randomNumber(lessThan = 100) {
  const seed = Math.random();
  return parseInt(`${seed * lessThan}`, 10);
}

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

export function isJsonStr(str: string) {
  if (typeof str !== 'string') {
    return false;
  }
  // JSON.parse('true') JSON.parse('222') 等并不会报错
  if ((str.startsWith('{') && str.endsWith('}')) || (str.startsWith('[') && str.endsWith(']'))) {
    try {
      JSON.parse(str);
      return true;
    } catch (err: any) {
      return false;
    }
  }
  return false;
}

/**
 * @param {string} inputPath
 * @param {Object} options
 * @param {'end' | 'start'} [options.loc='end']
 * @param {boolean} [options.need=false]
 */
export function ensureSlash(inputPath: string, options) {
  const { need, loc = 'end' } = options;
  const isEnd = loc === 'end';
  const hasSlash = isEnd ? inputPath.endsWith('/') : inputPath.startsWith('/');

  const shouldDelSlash = hasSlash && !need;
  const shouldAddSlash = !hasSlash && need;
  if (isEnd) {
    if (shouldDelSlash) {
      return inputPath.substring(0, inputPath.length - 1);
    }
    if (shouldAddSlash) {
      return `${inputPath}/`;
    }
  }
  if (!isEnd) {
    if (shouldDelSlash) {
      // del start slash
      return inputPath.substring(1);
    }
    if (shouldAddSlash) {
      return `/${inputPath}`;
    }
  }

  return inputPath;
}

/** 语义化 slash 相关操作，方便上层理解和使用 */
export const slash = {
  start: (path) => ensureSlash(path, { loc: 'start', need: true }),
  noStart: (path) => ensureSlash(path, { loc: 'start', need: false }),
  end: (path) => ensureSlash(path, { loc: 'end', need: true }),
  noEnd: (path) => ensureSlash(path, { loc: 'end', need: false }),
};
