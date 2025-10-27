export function pushIfNotExist(/** @type Array*/ arr, strItem, unshift = false) {
  const arrCopy = arr.slice();
  if (!arrCopy.includes(strItem)) {
    unshift ? arrCopy.unshift(strItem) : arrCopy.push(strItem);
  }
  return arrCopy;
}

/**
 * 检查元素存在则先删除，再执行push
 */
export function pushAndDelBeforePush(/** @type Array*/ arr, strItem, unshift = false) {
  const arrCopy = arr.slice();
  const idx = arrCopy.indexOf(strItem);
  if (idx >= 0) {
    arrCopy.splice(idx, 1);
  }

  unshift ? arrCopy.unshift(strItem) : arrCopy.push(strItem);
  return arrCopy;
}

export function removeIfExist(arr, strItem) {
  const arrCopy = arr.slice();
  const idx = arrCopy.indexOf(strItem);
  if (idx >= 0) {
    arrCopy.splice(idx, 1);
  }
  return arrCopy;
}

export function removeLastItem(arr) {
  const newArr = arr.slice();
  newArr.splice(newArr.length - 1);
  return newArr;
}

/** 保留前多少个元素 */
export function remainItem(arr, remainCount = 20) {
  const newArr = arr.slice();
  newArr.splice(remainCount); // 从下标 remainCount 开始删数据
  return newArr;
}
