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

  // 兼容一些第三方库对 Element.prototype.appendChild 打了补丁的情况（如micro-app）
  const getAppend = function getAppend(nativeAppend, bindTarget, loc) {
    const { patchedHeadAppend, patchedBodyAppend } = helMicroShared;
    const isHead = loc === 'head';
    if (patchedHeadAppend && isHead) { // 如果用户手动传递了 headAppend 句柄
      return patchedHeadAppend;
    }
    if (patchedBodyAppend && !isHead) { // 如果用户手动传递了 bodyAppend 句柄
      return patchedBodyAppend;
    }
    if (gs.__POWERED_BY_WUJIE__) { // 兼容 wujie
      return nativeAppend;
    }

    const el = gs.Element; // 某些框架会代理 Element，如 micro-app
    return el ? el.prototype.appendChild.bind(bindTarget) : nativeAppend;
  };

  // replace appendChild
  doc.head.appendChild = (el) => doAppend(getAppend(nativeHeadAppend, head, 'head'), el);
  doc.body.appendChild = (el) => doAppend(getAppend(nativeBodyAppend, body, 'body'), el);
}
