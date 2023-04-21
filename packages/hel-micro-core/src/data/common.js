import { safeGetMap } from '../base/util';
import { helConsts } from '../consts';
import { getCacheRoot } from '../wrap/cache';

const { KEY_CSS_LINK_TAG_ADDED, KEY_STYLE_TAG_ADDED } = helConsts;

function getDataMap(customKey) {
  const { common } = getCacheRoot();
  const dataMap = safeGetMap(common, customKey);
  return dataMap;
}

export function getCommonData(customKey, dataKey) {
  const dataMap = getDataMap(customKey);
  const result = dataMap[dataKey];
  return result !== undefined ? result : null;
}

export function setCommonData(customKey, dataKey, data) {
  const dataMap = getDataMap(customKey);
  dataMap[dataKey] = data;
}

export const commonDataUtil = {
  getCssUrlList(cssPrefix) {
    let cssUrlList = getCommonData(KEY_CSS_LINK_TAG_ADDED, cssPrefix);
    if (!cssUrlList) {
      cssUrlList = [];
      setCommonData(KEY_CSS_LINK_TAG_ADDED, cssPrefix, cssUrlList);
    }
    return cssUrlList;
  },
  setCssUrl(cssPrefix, url) {
    const cssUrlList = commonDataUtil.getCssUrlList(cssPrefix);
    cssUrlList.push(url);
  },
  getStyleTagText(groupName) {
    const text = getCommonData(KEY_STYLE_TAG_ADDED, groupName) || '';
    return text;
  },
  setStyleTagText(groupName, text) {
    const oldText = commonDataUtil.getStyleTagText(groupName);
    // 继续拼接新的样式字符串
    setCommonData(KEY_STYLE_TAG_ADDED, groupName, `${oldText} ${text}`);
  },
};
