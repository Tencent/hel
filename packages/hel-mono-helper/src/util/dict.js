function safeGet(dict, key, val = {}) {
  let targetVal = dict[key];
  if (!targetVal) {
    targetVal = val;
    dict[key] = val;
  }

  return targetVal;
}

function safeOnlyGet(dict, key, val = {}) {
  if (!dict) {
    return val;
  }
  return dict[key] || val;
}

module.exports = {
  safeGet,
  safeOnlyGet,
};
