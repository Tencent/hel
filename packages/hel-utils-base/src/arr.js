/**
 *
 * @param {Array<string>} arr
 * @param {string} item
 */
export function noDupPush(arr, item) {
  if (!arr.includes(item)) arr.push(item);
  return arr;
}
