function orValue(left, right) {
  if (['', null, undefined].includes(left)) {
    return right;
  }

  return left;
}

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
function chooseBool(valList, defaultBool = false) {
  let boolVal = null;
  for (let i = 0; i < valList.length; i++) {
    const val = valList[i];
    if (typeof val === 'boolean') {
      boolVal = val;
      break;
    }
  }

  if (boolVal !== null) {
    return boolVal;
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
  orValue,
};
