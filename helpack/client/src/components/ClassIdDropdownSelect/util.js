export const cache = {
  classInfoList: [
    // { class_key: '11', class_label: 'xxx', create_by: 'xxx' }
  ],
};

export function filterOption(input, option) {
  const { originalLabel, classKey } = option;
  if (!originalLabel.toLowerCase) return false;
  if (!classKey.toLowerCase) return false;
  const inputStr = input.toLowerCase();
  return originalLabel.toLowerCase().includes(inputStr) || classKey.toLowerCase().includes(inputStr);
}

export function getList(user) {
  return {
    myClassItems: cache.classInfoList.filter((v) => v.create_by === user),
    visibleClassItems: cache.classInfoList.slice(0, 100),
    allClassItems: cache.classInfoList,
  };
}
