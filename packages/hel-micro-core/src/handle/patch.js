import { getGlobalThis } from '../base/globalRef';
import { getHelMicroShared } from '../base/microShared';
import { helConsts } from '../consts';
import { getCommonData } from '../data/common';
import { markElFeature } from './feature';

const { KEY_ASSET_CTX } = helConsts;

function doAppend(nativeAppend, /** @type {HTMLLinkElement | HTMLScriptElement}*/ el) {
  if (!el || !['LINK', 'SCRIPT'].includes(el.tagName)) {
    return nativeAppend(el);
  }
  const { href, tagName, src } = el;
  /** @type string */
  const url = href || src || '';
  const isLink = tagName === 'LINK';

  const assetCtx = getCommonData(KEY_ASSET_CTX, url) || {};
  const { platform, groupName, name, ver, beforeAppend } = assetCtx;

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
  const gs = getGlobalThis();
  const doc = gs.document;
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

  let elAp = gs.Element.prototype.appendChild;
  const apMap = { head: null, body: null };
  // 兼容一些第三方库对 Element.prototype.appendChild 打了补丁的情况
  const getAppend = (nativeAppend, bindTarget, nodeName) => {
    const gEl = gs.Element;
    if (!gEl) return nativeAppend;

    const curAp = gEl.prototype.appendChild;
    // 确保 Element.prototype.appendChild 未被替换
    if (apMap[nodeName] && elAp === curAp) return apMap[nodeName];

    elAp = curAp;
    apMap[nodeName] = gEl.prototype.appendChild.bind(bindTarget);
    return apMap[nodeName];
  };

  // replace appendChild
  doc.head.appendChild = (el) => doAppend(getAppend(nativeHeadAppend, head, 'head'), el);
  doc.body.appendChild = (el) => doAppend(getAppend(nativeBodyAppend, body, 'body'), el);
}
