import * as objUtil from 'at/utils/obj';
import { has } from 'lodash';

interface IEnsureDataJsonStrOptions {
  /** 为 json 字符串的 keys */
  jsonStrKeys: string[];
  /** 为 json 字符串 key 对应的默认对象 */
  key2DefaultObj: xc.Dict;
  /**
   * true: 转为 json 字符串时，允许 key 对应值缺失，不会做补齐
   * false: 发现 key 对应值缺失时会自动取 key2DefaultObj 对应值来补齐
   */
  allowMiss?: boolean;
}

export function ensureDataJsonObj(item, options: { jsonStrKeys: string[]; key2DefaultObj: xc.Dict }) {
  const { jsonStrKeys, key2DefaultObj } = options;
  jsonStrKeys.forEach((key) => {
    item[key] = objUtil.safeParse(item[key], key2DefaultObj[key]);
  });

  return item;
}

export function ensureDataJsonStr(item, options: IEnsureDataJsonStrOptions) {
  const { jsonStrKeys, key2DefaultObj, allowMiss = false } = options;
  jsonStrKeys.forEach((key) => {
    if (allowMiss && !has(item, key)) {
      return;
    }

    const val = item[key];
    const valType = typeof val;
    const defaultObj = key2DefaultObj[key];

    let targetVal = val;
    if (val && valType === 'object') {
      targetVal = JSON.stringify(val || defaultObj);
    } else if (valType === 'string') {
      targetVal = objUtil.isJsonStr(val) ? val : JSON.stringify(defaultObj);
    } else {
      targetVal = JSON.stringify(defaultObj);
    }
    item[key] = targetVal;
  });

  return item;
}
