/**
/**
 * for pretty format multi line string when use \`...\`
 * @param {*} mayLineBreakStr
 * @param {'MULTI' | 'ONE'} [mode='MULTI']
 * @returns
 * ```
 * // usage 1
 * pfstr(`
 *   line1 line1 line1,
 *   line2 line2 line2.
 * `);
 * // will print:
 * line1 line1 line1,
 * line2 line2 line2.
 * // attention: end <br/> will be removed automatically in MULTI mode
 * pfstr(`
 *   line1 line1 line1,<br/>
 *   line2 line2 line2.
 * `);
 * // will print:
 * line1 line1 line1,
 * line2 line2 line2.
 *
 * // usage 2, set mode='ONE' to print no line break string
 * pfstr(`
 *   line1 line1 line1,
 *   line2 line2 line2.
 * `, 'ONE');
 * // will print:
 * line1 line1 line1, line2 line2 line2.
 *
 * // usage 3, add <br/> to control line break
 * pfstr(`
 *   line1 line1 line1,
 *   line2 line2 line2,<br/>
 *   line3 line3 line3.
 * `, 'ONE');
 * // will print:
 * line1 line1 line1,
 * line2 line2 line2,line3 line3 line3.
 * ```
 */
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

      let result = line.trimStart?.() || line; // 去头部所有空格
      if (mode === 'MULTI') {
        return `${replaceBr(result, '')}\n`;
      }
      result = replaceBr(result, '\n', ' ');
      return result;
    })
    .join('');
  return formatLine;
}
