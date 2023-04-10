/**
 * for friendly print mulit line with no break-line strategy when use \`...\`
 * ```
 * // usage
 * nbstr(`
 *   line1 line1 line1,
 *   line2 line2 line2.
 * `);
 * ```
 */
export function nbstr(mayLineBreakStr) {
  const lines = mayLineBreakStr.split('\n');
  return lines
    .filter((line) => !!line)
    .map((line) => line.trimStart?.() || line)
    .map((line) => (line.endsWith(' ') ? line : `${line} `))
    .join('');
}
