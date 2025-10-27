const linkInfoList = getHubCssLinkInfoList();
window.__HUB_LINK_INFO_LIST__ = linkInfoList;

function getHubCssLinkInfoList() {
  const linkDoms = document.querySelectorAll('link');
  const len = linkDoms.length;
  const linkInfoList = [];

  for (let i = 0; i < len; i++) {
    const dom = linkDoms[i];
    const href = dom.href;
    // 只清除构建生成的非 main.xxxx.chunk.css 和 HUB_ANTD_CSS_LINK 对应的 antd css
    if ((href.endsWith('.chunk.css') && !href.includes('/main.')) || dom.id === 'HUB_ANTD_CSS_LINK') {
      linkInfoList.push({ dom, href });
    }
  }
  return linkInfoList;
}

/**
 * 加载子应用时，清除基座样式，防止污染子应用
 */
export function removeStyle() {
  linkInfoList.forEach((item) => {
    item.dom.href = '';
  });
}

export function recoverStyle() {
  linkInfoList.forEach((item) => {
    item.dom.href = item.href;
  });
}
