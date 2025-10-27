import { leftPad } from './str';

/**
 * UTC 时间字符串转 locale 时间字符串
 * 2022-04-15T06:29:14.000Z --->2019/4/15 14:29:14
 * @param {string} str
 */
export function formatISODateStr(str) {
  if (!str) return '';
  return new Date(str).toLocaleString();
}

/**
 * 使用 toLocaleString('zh', { hour12: false }) 得到的字符串形如
 * 2021/8/1 14:41:55 ---> 2021-08-01 14:41:55
 *
 * 使用 toLocaleString() 得到的字符串形如
 * 2021/8/1 下午2:41:57 ---> 2021-08-01 14:41:55
 */
export function formatLocaleString(str) {
  const hasMorning = str.includes(' 上午');
  const hasAfternoon = str.includes(' 下午');
  let keyword = ' ';
  if (hasMorning) keyword = ' 上午';
  if (hasAfternoon) keyword = ' 下午';

  const lep = (str) => leftPad(str, 2, '0');
  const [left, right] = str.split(keyword);
  const [year, month, day] = left.split('/');
  const [h, m, s] = right.split(':');
  return `${year}-${lep(month)}-${lep(day)} ${lep(h)}:${lep(m)}:${lep(s)}`;
}

/**
 * 2021-09-06T08:31:16.000Z ---> 2021/9/6 16:31:06
 */
export function tryGetLocaleStrOfISOStr(isoStr, replaceSlash = true) {
  try {
    const d = new Date(isoStr);
    let str = d.toLocaleString('zh', { hour12: false });
    if (replaceSlash) str = str.replace(/\//g, '-');
    return str;
  } catch (err) {
    return isoStr;
  }
}
