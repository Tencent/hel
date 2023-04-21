import { getGlobalThis } from '../base/globalRef';
import { getHelMicroShared } from '../base/microShared';
import { helConsts } from '../consts';
import { getCommonData } from '../data/common';
import { markElFeature } from './feature';

const { KEY_ASSET_CTX } = helConsts;

function doAppend(nativeAppend, /** @type {HTMLLinkElement | HTMLScriptElement }*/ el) {
  if (!el || !['LINK', 'SCRIPT'].includes(el.tagName)) {
    return nativeAppend(el);
  }
  const { href, tagName, src } = el;
  const url = href || src;
  const isLink = tagName === 'LINK';

  const assetCtx = getCommonData(KEY_ASSET_CTX, url) || {};
  const { platform, groupName, name, ver, beforeAppend, append } = assetCtx;
  // append 设定仅对 LINK 有效，用于辅助 shadow-dom 控制样式加载时机
  if (append === false && isLink) {
    return el; // just return;
  }

  let mayChangedEl = el;
  if (beforeAppend) {
    const urlKey = isLink ? 'href' : 'src';
    const url = el.getAttribute(urlKey);
    const setAssetUrl = (newUrl) => el.setAttribute(urlKey, newUrl);
    mayChangedEl = beforeAppend({ el, nativeAppend, setAssetUrl, url, tagName }) || el;
  }

  const elName = isLink ? 'HelLink' : 'HelScript';
  platform && markElFeature(mayChangedEl, { platform, groupName, name, ver, elName });
  return nativeAppend(mayChangedEl);
}

export function patchAppendChild() {
  const helMicroShared = getHelMicroShared();
  const doc = getGlobalThis().document;
  let nativeHeadAppend = helMicroShared.nativeHeadAppend;
  let nativeBodyAppend = helMicroShared.nativeBodyAppend;
  // already patched or a mock enviroment
  if (nativeHeadAppend || !doc) {
    return;
  }
  const { head, body } = doc;
  // record may native appendChild, use bind to avoid Illegal invocation
  nativeHeadAppend = head.appendChild.bind(head);
  nativeBodyAppend = body.appendChild.bind(body);
  helMicroShared.nativeHeadAppend = nativeHeadAppend;
  helMicroShared.nativeBodyAppend = nativeBodyAppend;
  // replace appendChild
  doc.head.appendChild = (el) => doAppend(nativeHeadAppend, el);
  doc.body.appendChild = (el) => doAppend(nativeBodyAppend, el);
}
