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

function isValNull(val) {
  return [null, undefined, ''].includes(val);
}

function purify(dict, isValNullCb) {
  const fn = isValNullCb || isValNull;
  const newDict = {};
  Object.keys(dict).forEach((key) => {
    const val = dict[key];
    const isNull = fn(val);
    if (!isNull) {
      newDict[key] = val;
    }
  });
  return newDict;
}

function purifyUndefined(dict) {
  const isValNull = (val) => val === undefined;
  return purify(dict, isValNull);
}

function clone(dict) {
  return JSON.parse(JSON.stringify(dict));
}

module.exports = {
  clone,
  safeGet,
  safeOnlyGet,
  purify,
  purifyUndefined,
};
