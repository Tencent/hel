function safeGet(dict, key, val = {}) {
  let targetVal = dict[key];
  if (!targetVal) {
    targetVal = val;
    dict[key] = val;
  }

  return targetVal;
}

module.exports = {
  safeGet,
};
