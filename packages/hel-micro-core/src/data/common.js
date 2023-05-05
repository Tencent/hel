import { noDupPush, safeGetMap } from '../base/util';
import { helConsts } from '../consts';
import { getCacheRoot } from '../wrap/cache';

const { KEY_CSS_LINK_TAG_ADDED, KEY_STYLE_TAG_ADDED, KEY_IGNORE_CSS_PREFIX_LIST, KEY_IGNORE_STYLE_TAG_KEY, KEY_IGNORE_CSS_PREFIX_2_KEYS } =
  helConsts;

function getDataMap(customKey) {
  const { common } = getCacheRoot();
  const dataMap = safeGetMap(common, customKey);
  return dataMap;
}

/** perf: 内置的 key 已在 microShared 初始化时做了检查，此处可直接获取 */
function getDataNode(customKey) {
  const { common } = getCacheRoot();
  return common[customKey]; // map or list
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

/** 操作 commonData 的内置方法集合 */
export const commonDataUtil = {
  setIgnoreCssPrefix(cssPrefix) {
    const list = getDataNode(KEY_IGNORE_CSS_PREFIX_LIST);
    noDupPush(list, cssPrefix);
  },
  setIgnoreStyleTagKey(key) {
    const map = commonDataUtil.getIgnoreStyleTagMap();
    map[key] = 1;
  },
  getIgnoreStyleTagMap() {
    const map = getDataNode(KEY_IGNORE_STYLE_TAG_KEY);
    return map;
  },
  setIgnoreCssPrefixKey(ignoreCssPrefix, key) {
    let list = getCommonData(KEY_IGNORE_CSS_PREFIX_2_KEYS, ignoreCssPrefix);
    if (!list) {
      list = [];
      setCommonData(KEY_IGNORE_CSS_PREFIX_2_KEYS, ignoreCssPrefix, list);
    }
    noDupPush(list, key);
  },
  getIgnoreCssPrefixKeys(ignoreCssPrefix) {
    const map = getDataNode(KEY_IGNORE_CSS_PREFIX_2_KEYS);
    return map[ignoreCssPrefix] || [];
  },
  getMatchedIgnoreCssPrefix(/** @type string */ url) {
    const ignoreCssPrefixList = getDataNode(KEY_IGNORE_CSS_PREFIX_LIST);
    let matchedPrefix = '';
    for (let i = 0; i < ignoreCssPrefixList.length; i++) {
      const cssPrefix = ignoreCssPrefixList[i];
      if (url.startsWith(cssPrefix)) {
        matchedPrefix = cssPrefix;
        break;
      }
    }
    return matchedPrefix;
  },
  getIgnoreCssPrefixCssUrlList(ignoreCssPrefix) {
    let cssUrlList = getCommonData(KEY_CSS_LINK_TAG_ADDED, ignoreCssPrefix);
    if (!cssUrlList) {
      cssUrlList = [];
      setCommonData(KEY_CSS_LINK_TAG_ADDED, ignoreCssPrefix, cssUrlList);
    }
    return cssUrlList;
  },
  setIgnoreCssPrefixCssUrl(ignoreCssPrefix, url) {
    const cssUrlList = commonDataUtil.getIgnoreCssPrefixCssUrlList(ignoreCssPrefix);
    cssUrlList.push(url);
  },
  getStyleTagText(key) {
    const text = getCommonData(KEY_STYLE_TAG_ADDED, key) || '';
    return text;
  },
  clearStyleTagText(key) {
    setCommonData(KEY_STYLE_TAG_ADDED, key, '');
  },
  appendStyleTagText(key, text) {
    const oldText = commonDataUtil.getStyleTagText(key);
    // 继续拼接新的样式字符串
    setCommonData(KEY_STYLE_TAG_ADDED, key, `${oldText} ${text}`);
  },
};
