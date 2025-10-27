export function removeIfExist(arr, strItem) {
  const arrCopy = arr.slice();
  const idx = arrCopy.indexOf(strItem);
  if (idx >= 0) {
    arrCopy.splice(idx, 1);
  }
  return arrCopy;
}

export function nodupStrPush(oriList, toPush) {
  if (!oriList.includes(toPush)) oriList.push(toPush);
}
