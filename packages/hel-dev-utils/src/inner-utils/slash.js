/**
 * @param {string} inputPath
 * @param {Object} options
 * @param {'end' | 'start'} [options.loc='end']
 * @param {boolean} [options.need=false]
 */
export function ensureSlash(inputPath, options) {
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
