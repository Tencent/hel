import { getGlobalThis } from '../base/globalRef';
import { getHelMicroShared } from '../base/microShared';
import { findNode, getOB } from '../base/util';
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
  const gs = getGlobalThis();
  // 当前阶段 qiankun 不做任何补丁，否则会导致一切一些莫名的bug，例如 react 组件切换 unmountAtNode 报错
  // 意味着当前阶段 beforeAppend 机制无作用
  if (gs.__POWERED_BY_QIANKUN__) {
    return;
  }

  const helMicroShared = getHelMicroShared();
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
  helMicroShared.nativeHeadAppend = nativeHeadAppend;

  if (body) {
    nativeBodyAppend = body.appendChild.bind(body);
    helMicroShared.nativeBodyAppend = nativeBodyAppend;
  } else {
    // 可能 js 脚本在 head 里被引入并执行，此时 body 对象为 undefined，
    // 需要用 MutationObserver 监听到 body 被插入然后做相关替换
    const MutationObserver = getOB();
    const observer = new MutationObserver(function (mutations) {
      let body;
      for (let i = 0; i < mutations.length; i++) {
        const { addedNodes } = mutations[i];
        body = findNode(addedNodes, 'BODY');
        if (body) break;
      }

      if (body) {
        nativeBodyAppend = body.appendChild.bind(body);
        helMicroShared.nativeBodyAppend = nativeBodyAppend;
        body.appendChild = (el) => doAppend(getAppend(nativeBodyAppend, body, 'body'), el);
        observer.disconnect();
      }
    });

    const htmlNode = findNode(doc.childNodes, 'HTML');
    if (htmlNode) {
      observer.observe(htmlNode, { childList: true });
    }
  }

  // 兼容一些第三方库对 Element.prototype.appendChild 打了补丁的情况（如micro-app）
  const getAppend = function getAppend(nativeAppend, bindTarget, loc) {
    const { patchedHeadAppend, patchedBodyAppend } = helMicroShared;
    const isHead = loc === 'head';
    if (patchedHeadAppend && isHead) {
      // 如果用户手动传递了 headAppend 句柄
      return patchedHeadAppend;
    }
    if (patchedBodyAppend && !isHead) {
      // 如果用户手动传递了 bodyAppend 句柄
      return patchedBodyAppend;
    }
    // 兼容 wujie
    if (gs.__POWERED_BY_WUJIE__) {
      return nativeAppend;
    }

    const el = gs.Element; // 某些框架会代理 Element，如 micro-app
    return el ? el.prototype.appendChild.bind(bindTarget) : nativeAppend;
  };

  // replace appendChild
  head.appendChild = (el) => doAppend(getAppend(nativeHeadAppend, head, 'head'), el);
  if (body) {
    body.appendChild = (el) => doAppend(getAppend(nativeBodyAppend, body, 'body'), el);
  }
}
