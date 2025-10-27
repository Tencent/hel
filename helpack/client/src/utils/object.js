/* eslint-disable */

export function okeys(map) {
  return Object.keys(map);
}

export function isValidVal(val) {
  return val !== undefined && val !== null && val !== '';
}

/**
 * 判断是否是对象 {} []
 * @param {*} val
 */
export function isObject(val, allowArr = true) {
  // 防止 typeof null === 'object' 成立
  if (!val) return false;
  if (allowArr) {
    return typeof val === 'object';
  }
  return typeof val === 'object' && !Array.isArray(val);
}

export function clone(obj) {
  if (obj) return JSON.parse(JSON.stringify(obj));
  else {
    throw new Error('empty object');
  }
}

export function safeGetItemFromArray(arr, idx, defaultValue) {
  let item = arr[idx];
  if (!item) {
    item = arr[idx] = defaultValue;
  }
  return item;
}

export function safeGet(obj, key, defaultValue) {
  let item = obj[key];
  if (!item) {
    item = obj[key] = defaultValue;
  }
  return item;
}

export function safeAssign(to, from) {
  const newObj = { ...to };
  if (!from) return newObj;
  Object.keys(from).forEach((key) => {
    const value = from[key];
    if (value !== undefined && value !== null) {
      newObj[key] = value;
    }
  });
  return newObj;
}

export function safeParse(jsonStr, defaultValue = null) {
  if (!jsonStr) {
    return defaultValue || jsonStr;
  }
  try {
    return JSON.parse(jsonStr);
  } catch (err) {
    // 可能本身jsonStr已经是一个对象
    return defaultValue || jsonStr;
  }
}

/**
 *
 * @param value
 * @param nullDef
 */
export function isNull(value, nullDef = {}) {
  const { nullValues = [null, undefined, ''], emptyObjIsNull = true, emptyArrIsNull = true } = nullDef;

  const inNullValues = nullValues.includes(value);
  if (inNullValues) {
    return true;
  }

  if (Array.isArray(value)) {
    if (emptyArrIsNull) return value.length === 0;
    else return false;
  }

  if (typeof value === 'object') {
    if (emptyObjIsNull) return Object.keys(value).length === 0;
    else return false;
  }

  return false;
}

export function reverseMap(originalMap) {
  return Object.keys(originalMap).reduce((map, key) => {
    const value = originalMap[key];
    map[value] = key;
    return map;
  }, {});
}

/**
 * 后端有些接口返回空map的格式是数组 [],
 * 但其实期望的是 {},
 * 为了保证上传业务逻辑消费数据的格式一致性，使用此函数做修正
 */
export function ensureMap(obj, key) {
  if (Array.isArray(obj[key])) {
    obj[key] = {};
  }
}

export function transformMap(map, getValue, getKey) {
  const newMap = {};
  const _getKey = getKey || ((key) => key);

  okeys(map).forEach((key) => {
    const value = map[key];
    const mapKey = _getKey(key, value);
    newMap[mapKey] = getValue ? getValue(value, key) : value;
  });
  return newMap;
}

/**
 *
 * @param {*} list
 * @param {string} keyName 选择哪个key的值作为map的key，也可以是一个动态生成key的函数
 * @param {*} getValue
 */
export function toMap(list, keyNameOrFn, getValue) {
  const map = {};
  if (!list) return map;
  list.forEach((v) => {
    let mapKey;
    if (typeof keyNameOrFn === 'function') mapKey = keyNameOrFn(v);
    else mapKey = v[keyNameOrFn];

    if (getValue) map[mapKey] = getValue(v);
    else map[mapKey] = v;
  });
  return map;
}

/**
 * map 转为 list
 * @param map
 * @param keyName
 * @param valueName
 */
export function toList(map, getItem = (key, value) => value) {
  const list = [];
  okeys(map).forEach((key) => {
    const item = getItem(key, map[key]);
    list.push(item);
  });
  return list;
}

// export function toList(map, keyName, valueName = 'value') {
//   const list = [];
//   Object.keys(map).forEach(key => {
//     list.push({ [keyName]: key, [valueName]: map[key] });
//   })
//   return list;
// }

export function filterList(list, filterCb, getValCb) {
  const newList = [];
  list.forEach((item) => {
    if (filterCb(item)) newList.push(getValCb(item));
  });
  return newList;
}

/**
 * 对比新老对象，提取出新对象里发生变化的部分并单独返回
 * 注意此函数只做浅比较
 * @param {object} oldObj
 * @param {object} newObj
 * @param {string} [fixedKeys=[]] - 必定要包含的key
 */
export function extractChangedPart(oldObj, newObj, fixedKeys = []) {
  const changed = {};
  const oldObjKeys = okeys(oldObj);
  const newObjKeys = okeys(newObj);
  const traversalKeys = newObjKeys.length > oldObjKeys.length ? newObjKeys : oldObjKeys;

  traversalKeys.forEach((key) => {
    const newVal = newObj[key];
    if (fixedKeys.includes(key)) {
      changed[key] = newVal;
      return;
    }
    if (newVal === undefined) return;
    if (oldObj[key] !== newVal) changed[key] = newVal;
  });
  return changed;
}

export function hasProperty(obj, property) {
  return Object.prototype.hasOwnProperty.call(obj, property);
}

export function replaceMapKey(map, keyMapOrKeyConvertor) {
  const newMap = {};
  const getKey = typeof keyMapOrKeyConvertor === 'function' ? (key) => keyMapOrKeyConvertor(key) : (key) => keyMapOrKeyConvertor[key];

  okeys(map).forEach((key) => {
    const mapKey = getKey(key) || key;
    newMap[mapKey] = map[key];
  });
  return newMap;
}

export function purify(obj, isValueInvalid) {
  // isValidVal or isNull
  const _isInvalid = isValueInvalid || ((value) => !isNull(value));
  const pureObj = {};
  okeys(obj).forEach((key) => {
    if (_isInvalid(obj[key])) pureObj[key] = obj[key];
  });
  return pureObj;
}

export function noDupPush(arr, item) {
  if (!arr.includes(item)) arr.push(item);
}

export function ensureArr(obj, key) {
  if (!Array.isArray(obj[key])) obj[key] = [obj[key]];
}
