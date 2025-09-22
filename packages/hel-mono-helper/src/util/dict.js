/**
 * 考虑兼容性，使用 getBool 替代 ?? 语法
 */
function getBool(dict, key, defaultBool = false) {
  const val = dict[key];
  if (typeof val === 'boolean') {
    return val;
  }

  return defaultBool;
}

/**
 * 考虑兼容性，使用 chooseBool 替代 ?? 语法
 */
function chooseBool(val1, val2, defaultBool = false) {
  if (typeof val1 === 'boolean') {
    return val1;
  }
  if (typeof val2 === 'boolean') {
    return val2;
  }

  return defaultBool;
}

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

function isDictNull(dict) {
  return !dict || Object.keys(dict).length === 0;
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
  isDictNull,
  clone,
  safeGet,
  safeOnlyGet,
  purify,
  purifyUndefined,
  getBool,
  chooseBool,
};
