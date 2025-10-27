/* eslint-disable camelcase */
/** @typedef {import('../../types/store').AC<'portal'>} AC*/
/** @typedef {ReturnType<typeof import('./state').default>} St */
/** @typedef {import('types/domain').SubApp} SubApp*/
import { message, Modal } from 'antd';
import { ADD_BG, REMOVE_BG } from 'configs/constant/event';
import cookie from 'react-cookies';
import { history } from 'react-router-concent';
import { getClassInfoList } from 'services/classInfo';
import * as commonService from 'services/common';
import { ccReducer } from 'services/concent';
import { emit } from 'services/event';
import { getBackendRenderPath } from 'services/shared/appPath';
import * as subAppService from 'services/subApp';
import * as arrUtil from 'utils/array';
import { noop } from 'utils/fn';
import * as urlUtil from 'utils/url';

// for copy
// export function redirectTo(p, /** @type St*/m, /** @type AC*/ac) {}

export function setLoading(loading, /** @type St*/ moduleState) {
  if (moduleState.loading !== loading) {
    return { loading };
  }
}

export function redirectTo(p, m, /** @type AC*/ ac) {
  // 出错要还原路由
  window.top.history.replaceState({}, commonService.getTitle(), '/');
  ac.setState({ contentVisible: true, sideBarVisible: true, loading: false, activeApp: null });
  const path = commonService.getLatestPushPath();
  history.push(path);
}

/**
 * 载入目标子应用
 */
export async function loadSubApp(activeApp, /** @type St*/ moduleState, /** @type AC*/ ac) {
  if (!activeApp) return;

  // await ac.dispatch(setLoading, true);
  await ac.setState({ loading: true, contentVisible: false, sideBarVisible: false });
  const stopLoad = (msg) => {
    if (msg) message.warn(msg);
    emit(REMOVE_BG);
    ac.setState({ activeApp: null, loading: false, contentVisible: true, sideBarVisible: true });
  };

  try {
    const { appVerId2detail, name2SubApp, activeApp: prevActiveApp } = moduleState;
    let targetSubApp = name2SubApp[activeApp];
    if (!targetSubApp) {
      targetSubApp = await subAppService.getSubApp(activeApp);
      if (!targetSubApp) {
        stopLoad(`[${activeApp}]未在应用中心注册过`);
        return;
      }
      name2SubApp[activeApp] = targetSubApp;
      await ac.setState({ name2SubApp });
    }

    if (!targetSubApp.is_local_render) {
      const url = targetSubApp.render_app_host || `${window.location.origin}/page/${targetSubApp.name}`;
      console.trace('targetSubApp', targetSubApp, url);
      console.trace(urlUtil);
      // urlUtil.openNewTab(url);
      return;
    }

    emit(ADD_BG, targetSubApp.splash_screen);

    // 如果应用配置了对应sec系统里的名字，则需要检验当前用户是否能访问
    const { online_version, build_version, enable_gray, is_in_gray, gray_users } = targetSubApp;
    /** @type string */
    let versionId = commonService.getAppVersionInUrl() || online_version;
    if (enable_gray && is_in_gray && gray_users.includes(moduleState.userInfo.user)) {
      versionId = build_version;
    }

    if (!versionId) {
      stopLoad(`[${activeApp}]还未发布任何版本`);
      return;
    }

    let subAppVersion = appVerId2detail[versionId];
    if (!subAppVersion) {
      subAppVersion = await subAppService.getSubAppVersion(targetSubApp.name, versionId);
    }

    if (!subAppVersion) {
      stopLoad(`版本[${versionId}]数据异常`);
      return;
    }

    const targetName = targetSubApp.name;
    if (targetSubApp.is_back_render) {
      const openBackRenderApp = (appName) => {
        window.top.history.replaceState({}, commonService.getTitle(), '/');
        if (appName) window.top.open(`${window.top.location.origin}/page/${appName}`);
      };

      stopLoad();
      if (Date.now() - moduleState.moduleLoadtime < 3000) {
        // 直接路由带appName打开，则提示弹窗，不能直接调用window.top.open，会被浏览器拦截
        Modal.confirm({
          title: `确认打开应用${targetName}`,
          onOk: () => openBackRenderApp(targetName),
          onCancel: () => openBackRenderApp(),
        });
      } else {
        openBackRenderApp(targetName);
      }
      return;
    }

    appVerId2detail[versionId] = subAppVersion;
    cookie.save('__leah_sub_app_name__', activeApp);
    await ac.setState({ activeApp, appVerId2detail, loading: false });

    const prevActiveAppInfo = name2SubApp[prevActiveApp];
    if (!moduleState.justLoadByHrefRefresh) {
      const hrefRefresh = () => {
        // 从富媒体切换到新应用时，用强刷url的方式来加载新应用，让其播放的声音等各种副作用彻底被清除
        commonService.loadAppWithForceRefresh(location.href);
      };
      // 移出 isSingleLoad(persistTime) 判断，前后app是否有联系需要更多的考虑维度 比如app_group参数
      if ((prevActiveApp !== targetName && prevActiveAppInfo && prevActiveAppInfo.is_rich) || targetSubApp.is_rich) {
        return hrefRefresh();
      }
    }

    // 置为false，让上面的富媒体跳转逻辑可以有机会再次被执行
    await ac.setState({ justLoadByHrefRefresh: false });
    const { sub_app_name: name, sub_app_version: versionIndex, version_tag: vtag } = subAppVersion;
    const versionTag = vtag || versionIndex;
    if (targetSubApp.render_mode === 'standalone' && !subAppVersion.html_content) {
      const fullVersion = await subAppService.getSubAppVersion(name, versionTag, true);
      document.write('');
      document.write(fullVersion.html_content);
      return;
    }
    await renderSubApp(targetSubApp, subAppVersion);
  } catch (err) {
    await ac.dispatch(setLoading, false);
    throw err;
  }
}

export async function initUserExtendData(payload, /** @type St*/ moduleState) {
  const { user } = moduleState.userInfo;
  const { starAppNames, visitAppNames, markedInfo } = await subAppService.combine3api(user);
  return {
    starAppNames,
    visitAppNames,
    userMarkedList: markedInfo.markedList,
  };
}

/**
 * 登录流程在根节点挂载完毕时触发
 */
export async function login(payload, /** @type St*/ moduleState, /** @type {AC}*/ ac) {
  await ac.setState({ userInfo: { user: 'test-user', icon: '', login: true } });
  await ac.dispatch(initUserExtendData);
  return { loading: false, basicDataReady: true };
}

export async function updateUserVisitApp(appName) {
  try {
    const visitAppNames = await subAppService.updateUserVisitApp(appName);
    // 此处异步的去更新访问记录数据
    // 标记最近访问页面需要刷新
    ccReducer.latestVisit.setState({ needRefresh: true });
    return { visitAppNames };
  } catch (err) {
    // 静默失败
  }
}

/**
 * 切换到具体的子应用
 */
export async function changeSubApp(payload, /** @type St*/ moduleState, /** @type {AC}*/ ac) {
  const { appName, isLocalRender, noNewTab, renderAppPath } = payload;
  let targetIsLocalRender = isLocalRender;
  let targetRenderPath = renderAppPath;
  if (targetIsLocalRender === undefined || !targetRenderPath) {
    const name2SubApp = ac.rootState.appStore.name2SubApp;
    let cachedSubApp = name2SubApp[appName];
    if (!cachedSubApp) {
      cachedSubApp = await subAppService.getSubApp(appName);
      if (!cachedSubApp) {
        message.warn(`应用 ${appName} 不存在`);
        return;
      }
      name2SubApp[appName] = cachedSubApp;
      ccReducer.appStore.setState({ name2SubApp });
    }
    targetIsLocalRender = cachedSubApp.is_local_render;
    targetRenderPath = cachedSubApp.render_app_host || getBackendRenderPath(appName);
  }

  const shouldOpenAppAtCurrentTab = targetIsLocalRender && noNewTab;
  if (!shouldOpenAppAtCurrentTab) {
    message.success(`在新页签里访问 ${appName}`);
    window.open(targetRenderPath);
    return;
  }

  try {
    // 异步的去更新最近访问记录
    ac.dispatch(updateUserVisitApp, appName);
  } catch (err) {}
  // 使用replaceState来修改路由，让浏览器切换子应用后，不存在回退或者前进操作
  window.top.history.replaceState({}, appName, `/${appName}`);
  // 然后再次reload确保应用能够加载
  window.top.location.reload(`${window.top.location.origin}/${appName}`);
}

export function checkPageUrl(p, /** @type St*/ moduleState) {
  const urlAppName = commonService.getUrlAppName();
  const { activeApp } = moduleState;

  // 视图和路由不同步，重定向到首页
  if ((activeApp && (urlAppName === '__hub' || urlAppName === '')) || (!activeApp && urlAppName !== '__hub')) {
    console.log(`[hel] redirect to ${window.top.location.origin}`);
    window.top.location.href = `${window.top.location.origin}${window.top.location.pathname}`;
    window.top.location.reload();
  }
}

export function updateStarApps({ appName, _star }, /** @type St*/ moduleState) {
  const { starAppNames } = moduleState;
  if (_star) {
    if (!starAppNames.includes(appName)) starAppNames.push(appName);
  } else {
    if (starAppNames.includes(appName)) {
      const idx = starAppNames.indexOf(appName);
      starAppNames.splice(idx, 1);
    }
  }

  return { starAppNames };
}

export function mergeSubAppMap(inputName2SubApp, /** @type St*/ moduleState) {
  const { name2SubApp } = moduleState;
  Object.assign(name2SubApp, inputName2SubApp);
  return { name2SubApp };
}

export function delVisitApp(appName, /** @type St*/ moduleState) {
  const { visitAppNames } = moduleState;
  const newNames = arrUtil.removeIfExist(visitAppNames, appName);
  return { visitAppNames: newNames };
}

export function delStarApp(appName, /** @type St*/ moduleState) {
  const { starAppNames } = moduleState;
  const newNames = arrUtil.removeIfExist(starAppNames, appName);
  return { starAppNames: newNames };
}

export async function initClassInfoList(payload, /** @type St*/ moduleState, /** @type AC*/ ac) {
  noop(payload, moduleState, ac);
  const allClassInfoList = await getClassInfoList();
  return { allClassInfoList };
}
