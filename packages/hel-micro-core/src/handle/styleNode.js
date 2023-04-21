import { getGlobalThis } from '../base/globalRef';
import { getHelMicroShared } from '../base/microShared';
import { helConsts, helEvents } from '../consts';
import { setCommonData } from '../data/common';
import { getHelEventBus } from '../data/event';

const { KEY_STYLE_TAG_ADDED } = helConsts;
const { STYLE_TAG_ADDED } = helEvents;
const HEL_CSS_MARK_START = '/* @helstart ';
const HEL_CSS_MARK_END = ' @helend */';
const START_LEN = HEL_CSS_MARK_START.length;

function handleNodeAdded(/** @type {HTMLElement} */ node) {
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
    const bus = getHelEventBus();
    setCommonData(KEY_STYLE_TAG_ADDED, groupName, innerText);
    bus.emit(`${STYLE_TAG_ADDED}/${groupName}`, node);
  }
}

export function obStyleTagInsert() {
  const helMicroShared = getHelMicroShared();
  const globalThis = getGlobalThis();
  const doc = globalThis.document;
  const isStyleObInit = helMicroShared.isStyleObInit;
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
        handleNodeAdded(addedNodes[i]);
      }
    });
  });
  observer.observe(document.head, { childList: true });
}
