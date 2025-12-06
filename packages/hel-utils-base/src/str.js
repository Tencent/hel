export function pfstr(/** @type string */ mayLineBreakStr, mode = 'MULTI') {
  // MULTI ONE
  const lines = mayLineBreakStr.split('\n');
  const lastIdx = lines.length - 1;

  const formatLine = lines
    .map((line, idx) => {
      if (!line && (idx === 0 || idx === lastIdx)) {
        return '';
      }
      const replaceBr = (/** @type string */ line, hasBrStr, noBrStr = '') => {
        let result = line;
        if (line.endsWith('<br/>')) {
          result = line.substring(0, result.length - 5);
          return `${result}${hasBrStr}`;
        }
        return `${result}${noBrStr}`;
      };

      // 此处暂时规避可选链写法，因 rollup 对此未处理，编译后上层使用会报错
      // SyntaxError: Unexpected token '.'
      const { trimStart } = line;
      let result = trimStart ? line.trimStart() : line; // 去头部所有空格
      if (mode === 'MULTI') {
        return `${replaceBr(result, '')}\n`;
      }
      result = replaceBr(result, '\n', ' ');
      return result;
    })
    .join('');
  return formatLine;
}
