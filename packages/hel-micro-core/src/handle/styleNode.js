import { setDataset } from '../base/commonUtil';
import { getGlobalThis } from '../base/globalRef';
import { getHelMicroShared } from '../base/microShared';
import { commonDataUtil } from '../data/common';
import { evName, getHelEventBus } from '../data/event';

const HEL_CSS_MARK_START = '/* @helstart ';
const HEL_CSS_MARK_END = ' @helend */';
const START_LEN = HEL_CSS_MARK_START.length;

function handleNodeAdded(/** @type {HTMLElement} */ node, ignoreStyleTagKey) {
  const { tagName, innerText } = node;
  if (tagName !== 'STYLE' || !innerText) {
    return;
  }
  const markStart = innerText.indexOf(HEL_CSS_MARK_START);
  // starts with '/* @helstart '
  if (markStart < 0) {
    return;
  }
  // /* @helstart hel-tpl-remote-react-comp-ts @helend */ --> hel-tpl-remote-react-comp-ts
  const markEnd = innerText.indexOf(HEL_CSS_MARK_END);
  const groupName = innerText.substring(START_LEN + markStart, markEnd);
  if (groupName) {
    setDataset(node, 'gname', groupName);
    setDataset(node, 'heltip', 'disabled-if-shadow');
    const trimGName = groupName.trim();
    if (ignoreStyleTagKey[trimGName]) {
      node.disabled = true;
    }
    const bus = getHelEventBus();
    commonDataUtil.setStyleTagText(trimGName, innerText);
    bus.emit(evName.styleTagAdded(trimGName), node);
  }
}

export function obStyleTagInsert() {
  const helMicroShared = getHelMicroShared();
  const globalThis = getGlobalThis();
  const { isStyleObInit, ignoreStyleTagKey } = helMicroShared;
  const doc = globalThis.document;
  if (isStyleObInit || !doc) {
    return;
  }

  // @ts-ignore
  const MutationObserver = globalThis.MutationObserver || globalThis.WebKitMutationObserver || globalThis.MozMutationObserver;
  if (!MutationObserver) return;
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      const { addedNodes } = mutation;
      const len = addedNodes.length;
      for (let i = 0; i < len; i++) {
        handleNodeAdded(addedNodes[i], ignoreStyleTagKey);
      }
    });
  });
  observer.observe(document.head, { childList: true });
}
