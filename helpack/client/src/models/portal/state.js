/** @typedef {import('types/domain').User} User*/
/** @typedef {import('hel-types').ISubApp} ISubApp*/
/** @typedef {import('hel-types').ISubAppVersion} ISubAppVersion*/
import * as cst from 'configs/constant';
import { getUrlAppName } from 'services/common';
import * as objUtil from 'utils/object';

export function getInitialState() {
  let toMerge = {};
  try {
    const persistedState = JSON.parse(localStorage.getItem(cst.LS_HUB_PORTAL_STATE));
    const { userInfo, starAppNames, name2SubApp, visitAppNames, justLoadByHrefRefresh, persistTime, basicDataReady } = persistedState;

    const timeDiff = Date.now() - persistTime;
    if (timeDiff > 3000) {
      // 浏览器直接访问携带应用名的url，限定取3秒之类的storage数据并入store，防止并入过期数据
      toMerge = { persistTime };
    } else {
      // 先访问hel主页面，然后再点击具体的应用名跳转到直应用，无论走commonServ.historyPush，还是走commonServ.loadAppWithForceRefresh
      // 都会持久化portalState并写入persistTime，
      // refresh模式时，会重新解析整个hel应用，此时timeDiff通常都会小于3秒，就会进入此段逻辑了
      toMerge = {
        userInfo,
        starAppNames,
        name2SubApp,
        visitAppNames,
        justLoadByHrefRefresh,
        persistTime,
        basicDataReady,
      };
    }
  } catch (err) {
    // pass
  }

  let activeApp = getUrlAppName();
  // __hub是hel的内置basename，不作为应用名
  if (activeApp.startsWith('__hub')) {
    activeApp = '';
  }

  // 无激活应用时才展示边栏
  const sideBarVisible = !activeApp;

  let initialState = {
    delayRemoveStyle: 0,
    /** 全局loading，在renderFullPage时有效 */
    loading: false,
    /** 基座边栏是否显示，当打开具体的子应用时，会隐藏为浮球 */
    sideBarVisible,
    /** 小球的显示和边栏互斥 */
    ballVisible: !sideBarVisible,
    /** 基座自己的主内容区是否显示，当打开具体的子应用时，会消失 */
    contentVisible: sideBarVisible,
    basicDataReady: false,
    /** @type {User} - 用户信息 */
    userInfo: { user: '', icon: '' },
    /** @type {string[]} - 用户收藏的应用列表 */
    starAppNames: [],
    /** @type {string[]} - 用户最近访问的应用列表 */
    visitAppNames: [],
    /** @type {{ name: string, ver: string, desc: string, time: number }[]} - 用户对应用的标记信息 */
    userMarkedList: [],
    activeApp, // 当前子应用名称
    /** @type {Record<string, ISubAppVersion>} 版本id 版本详情 map */
    appVerId2detail: {},
    /** @type {Record<string, ISubApp>} - 子应用列表map */
    name2SubApp: {},
    persistTime: 0,
    moduleLoadtime: Date.now(),
    /** 标记是否刚刚才利用location.href赋值刷新了页面，防止自己跳自己无限刷新 */
    justLoadByHrefRefresh: false,
  };

  initialState = objUtil.safeAssign(initialState, toMerge);
  return initialState;
}

export default getInitialState;
