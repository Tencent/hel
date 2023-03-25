export function noop(...args) {
  return args;
}

export function safeParse(jsonStr, defaultValue, errMsg) {
  // 防止传入进来的已经是 json 对象
  if (jsonStr && typeof jsonStr !== 'string') {
    return jsonStr;
  }
  try {
    const result = JSON.parse(jsonStr); // 避免 JSON.parse('null') ---> null
    return result || defaultValue;
  } catch (err) {
    if (defaultValue !== undefined) return defaultValue;
    if (errMsg) throw new Error(errMsg);
    throw err;
  }
}

export function isNull(value, nullDef = {}) {
  const { nullValues = [null, undefined, ''], emptyObjIsNull = true, emptyArrIsNull = true } = nullDef;

  const inNullValues = nullValues.includes(value);
  if (inNullValues) {
    return true;
  }

  if (Array.isArray(value)) {
    if (emptyArrIsNull) return value.length === 0;
    return false;
  }

  if (typeof value === 'object') {
    const keys = okeys(value);
    const keyLen = keys.length;
    if (emptyObjIsNull) return keyLen === 0;
    return false;
  }

  return false;
}

export function noDupPush(list, item) {
  if (!list.includes(item)) {
    list.push(item);
  }
}

export function merge2List(list1, list2) {
  const mergedList = [];
  list1.forEach((v) => noDupPush(mergedList, v));
  list2.forEach((v) => noDupPush(mergedList, v));
  return mergedList;
}

export function okeys(map) {
  return Object.keys(map);
}

export function purify(obj, isValueValid) {
  // isValidVal or isNull
  const isValidFn = isValueValid || ((value) => !isNull(value));
  const pureObj = {};
  okeys(obj).forEach((key) => {
    if (isValidFn(obj[key])) pureObj[key] = obj[key];
  });
  return pureObj;
}

export function getObjsVal(objs, key, backupVal) {
  let val = backupVal;
  for (const item of objs) {
    const mayValidVal = item[key];
    if (![null, undefined, ''].includes(mayValidVal)) {
      val = mayValidVal;
      break;
    }
  }
  return val;
}
