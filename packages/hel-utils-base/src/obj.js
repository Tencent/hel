export function okeys(obj) {
  return Object.keys(obj);
}

/**
 *
 * @param value
 * @param {{nullValues: any[], isEmptyObjNull: boolean, isEmptyArrNull: boolean}} nullDef - 空定义
 */
export function isNull(value, nullDef = {}) {
  const { nullValues = [null, undefined, ''], isEmptyObjNull = true, isEmptyArrNull = true } = nullDef;

  const inNullValues = nullValues.includes(value);
  if (inNullValues) {
    return true;
  }

  if (Array.isArray(value)) {
    if (isEmptyArrNull) return value.length === 0;
    return false;
  }

  if (typeof value === 'object') {
    if (isEmptyObjNull) return okeys(value).length === 0;
    return false;
  }

  return false;
}

/**
 *
 * @param {{[key:string]: any}} obj
 * @param {(value:any, key:string)=>boolean} judgeValueValid - 判断value有效的函数
 */
export function purify(obj, judgeValueValid) {
  // isValidVal or isNull
  const isValid = judgeValueValid || ((value) => !isNull(value));
  const pureObj = {};
  okeys(obj).forEach((key) => {
    const value = obj[key];
    if (isValid(value, key)) pureObj[key] = value;
  });
  return pureObj;
}
