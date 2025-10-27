import { OUT_URL_PREFIX, OUT_URL_PREFIX_V2 } from 'configs/constant';

// TODO: 使用qs替代
export function getSearchObj() {
  const { search } = window.top.location;
  const map = {};
  if (search && search.startsWith('?')) {
    const pureSearch = search.substring(1);
    const items = pureSearch.split('&');
    items.forEach((item) => {
      const [key, value] = item.split('=');
      map[key] = value;
    });
    return map;
  }
  return map;
}

/** @type {HTMLAnchorElement} 辅助打开新窗口*/
let cacheLinkHelper = null;
export function openNewTab(href) {
  // console.error('openNewTab', href);
  // return;
  const topWindow = window.top;
  // 不使用open方式，避免当前页面白屏
  // topWindow.open(targetSubApp.render_app_host);

  if (!cacheLinkHelper) {
    const link = topWindow.document.createElement('a');
    cacheLinkHelper = link;
  }
  cacheLinkHelper.href = href;
  cacheLinkHelper.target = '_blank';
  cacheLinkHelper.rel = 'noopener norefferrer';
  cacheLinkHelper.click();
  try {
    // 故意触发错误，阻碍白屏
    cacheLinkHelper.parentNode.removeChild(cacheLinkHelper);
  } catch (err) {
    throw new Error('新窗口打开应用成功');
  }
}

function getPrefixAndVersionQuery(options) {
  const { isOut = true, isV2 = true, version = '' } = options || {};
  const versionQuery = !!version ? `&version=${version}` : '';
  let prefix = window.location.origin;
  if (isOut) {
    prefix = isV2 ? OUT_URL_PREFIX_V2 : OUT_URL_PREFIX;
  }
  return { prefix, versionQuery };
}

// TODO: 接入 meta/xxx/yyy 格式 url
export function getMetaApiUrl(name, options) {
  const { prefix, versionQuery } = getPrefixAndVersionQuery(options);
  return `${prefix}/openapi/v1/app/info/getSubAppAndItsFullVersion?name=${name}${versionQuery}`;
}

// TODO: 接入 meta/xxx/yyy 格式 url
export function getNoHtmlContentMetaApiUrl(name, options) {
  const { prefix, versionQuery } = getPrefixAndVersionQuery(options);
  return `${prefix}/openapi/v1/app/info/getSubAppAndItsVersion?name=${name}${versionQuery}`;
}
