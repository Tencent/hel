import { disableNode, setDataset } from '../base/commonUtil';
import { getGlobalThis } from '../base/globalRef';
import { getHelMicroShared } from '../base/microShared';
import { commonDataUtil } from '../data/common';
import { evName, getHelEventBus } from '../data/event';

const HEL_CSS_MARK_START = '/* @helstart ';
const HEL_CSS_MARK_END = ' @helend */';
const START_LEN = HEL_CSS_MARK_START.length;

function matchIgnoreCssPrefix(node, url) {
  const bus = getHelEventBus();
  const matchedPrefix = commonDataUtil.getMatchedIgnoreCssPrefix(url);
  // 分析 url ，符合 shadow 特征的不追加 dom，仅发射事件让上层适配层去处理
  if (matchedPrefix) {
    commonDataUtil.setIgnoreCssPrefixCssUrl(matchedPrefix, url);
    bus.emit(evName.cssLinkTagAdded(matchedPrefix), { nodes: [node] });
  }
  return matchedPrefix;
}

function resetStyleText(groupName) {
  const g = getGlobalThis();
  if (!g) return;

  const list = g.document.head.querySelectorAll(`style[data-gname="${groupName}"]`);
  if (list.length) {
    commonDataUtil.clearStyleTagText(groupName);
    list.forEach((node) => {
      disableNode(node);
      commonDataUtil.appendStyleTagText(groupName, node.innerText);
    });
    const bus = getHelEventBus();
    bus.emit(evName.styleTagAdded(groupName), { nodes: list });
  }
}

function handleStyleAdded(/** @type {HTMLElement} */ node, ignoreStyleTagMap) {
  const { tagName, innerText, href } = node;
  if (!['STYLE', 'LINK'].includes(tagName)) return;

  // is style tag or link tag
  const isStyleTag = tagName === 'STYLE';
  if (tagName === 'STYLE' && !innerText) {
    return;
  }

  if (isStyleTag) {
    const markStart = innerText.indexOf(HEL_CSS_MARK_START);
    // starts with '/* @helstart '
    if (markStart < 0) {
      return;
    }
    // 处理 css-loader 动态向 heade 添加 style 标签的情况
    // /* @helstart hel-tpl-remote-react-comp-ts @helend */ --> hel-tpl-remote-react-comp-ts
    const markEnd = innerText.indexOf(HEL_CSS_MARK_END);
    if (markEnd < 0) {
      return;
    }

    const helKey = innerText.substring(START_LEN + markStart, markEnd);
    if (helKey) {
      const trimedStr = helKey.trim(); // may groupName or plat/groupName
      let plat = '';
      let groupName = trimedStr;
      if (trimedStr.includes('/')) {
        const arr = trimedStr.split('/');
        plat = arr[0];
        groupName = arr[1];
      }

      setDataset(node, 'gname', groupName);
      plat && setDataset(node, 'plat', plat);
      if (ignoreStyleTagMap[trimedStr]) {
        disableNode(node);
      }
      const bus = getHelEventBus();
      commonDataUtil.appendStyleTagText(trimedStr, innerText);
      bus.emit(evName.styleTagAdded(trimedStr), { nodes: [node] });
    }
    return;
  }

  // process link tag
  const matchedPrefix = matchIgnoreCssPrefix(node, href);
  if (matchedPrefix) {
    disableNode(node);
  }
}

function handleHotUpdate(/** @type {HTMLElement} */ node, ignoreStyleTagMap) {
  const { tagName, src = '' } = node;
  if (tagName !== 'SCRIPT') return false;
  if (!src.endsWith('.hot-update.js')) return false;

  const matchedPrefix = commonDataUtil.getMatchedIgnoreCssPrefix(src);
  if (!matchedPrefix) return false;
  const keys = commonDataUtil.getIgnoreCssPrefixKeys(matchedPrefix);
  if (!keys.length) return false;

  let handled = false;
  keys.forEach((key) => {
    if (ignoreStyleTagMap[key]) {
      resetStyleText(key);
      handled = true;
    }
  });
  return handled;
}

export function obStyleTagInsert() {
  const helMicroShared = getHelMicroShared();
  const globalThis = getGlobalThis();
  const { isStyleObInit } = helMicroShared;
  const doc = globalThis.document;
  if (isStyleObInit || !doc) {
    return;
  }
  helMicroShared.isStyleObInit = true;

  const ignoreStyleTagMap = commonDataUtil.getIgnoreStyleTagMap();
  // @ts-ignore
  const MutationObserver = globalThis.MutationObserver || globalThis.WebKitMutationObserver || globalThis.MozMutationObserver;
  if (!MutationObserver) return;
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      const { addedNodes, removedNodes } = mutation;

      const len = addedNodes.length;
      for (let i = 0; i < len; i++) {
        handleStyleAdded(addedNodes[i], ignoreStyleTagMap);
      }

      const remLen = removedNodes.length;
      for (let i = 0; i < remLen; i++) {
        if (handleHotUpdate(removedNodes[i], ignoreStyleTagMap)) {
          break;
        }
      }
    });
  });
  observer.observe(document.head, { childList: true });
}
