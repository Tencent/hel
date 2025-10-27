/* eslint-disable no-param-reassign,camelcase,no-underscore-dangle */
/** @typedef {import('types/store').AC<'appStore'>} AC*/
/** @typedef {ReturnType<typeof import('./state').default>} St*/
/** @typedef {import('types/domain').SubApp} SubApp*/
import { path2Module } from 'configs/constant';
import * as ccModule from 'configs/constant/ccModule';
import { OPEN_SUB_APP_DRAWER } from 'configs/constant/event';
import { CREATED, LATEST_VISIT, STAR, STORE, TOP } from 'configs/constant/page';
import * as commonService from 'services/common';
import { ccReducer, emit, getRootState } from 'services/concent';
import * as msgService from 'services/message';
import * as subAppService from 'services/subApp';
import * as subAppTool from 'services/subAppTool';
import * as arrUtil from 'utils/array';
import regs from 'utils/regs';
import * as strUtil from 'utils/str';
import * as urlUtil from 'utils/url';

function canFetch(/** @type St*/ moduleState, /** @type AC*/ ac) {
  const ret = moduleState.subApps.length === 0 || moduleState.needRefresh;
  if (moduleState.needRefresh) {
    ac.setState({ needRefresh: false });
  }
  return ret;
}

function syncAppMapToPortalSilently(name2SubApp) {
  ccReducer.portal.mergeSubAppMap(name2SubApp, { silent: true });
}

/**
 * 初始化应用商店页面
 */
export async function initPage(forceInit, /** @type St*/ moduleState, /** @type AC*/ ac) {
  const obj = urlUtil.getSearchObj();
  if (obj.app) {
    const toSet = { searchStr: obj.app, listMode: 'all' };
    if (obj.openver === '1') {
      toSet.isVerTabOpen = true;
    }
    await ac.setState(toSet);
  }

  if (forceInit || canFetch(moduleState, ac)) {
    ac.dispatch(fetchDataList, { page: 1 });
  }
}

/**
 * 初始化我的收藏页面
 */
export async function initStarList(forceInit, /** @type St*/ moduleState, /** @type AC*/ ac) {
  if (forceInit || canFetch(moduleState, ac)) {
    const { starAppNames } = ac.rootState.portal;
    const queryOptions = subAppTool.makeQueryOptions({ page: 1, size: 100, appNames: starAppNames });
    ac.dispatch(fetchDataList, queryOptions);
  }
}

/**
 * 初始化我的创建页面
 */
export async function initCreatedList(forceInit, /** @type St*/ moduleState, /** @type AC*/ ac) {
  if (forceInit || canFetch(moduleState, ac)) {
    const user = getRootState().portal.userInfo.user;
    const queryOptions = subAppTool.makeQueryOptions({ page: 1, size: 100, user });
    ac.dispatch(fetchDataList, queryOptions);
  }
}

/**
 * 初始化最近访问页面
 */
export async function initVisitList(forceInit, /** @type St*/ moduleState, /** @type AC*/ ac) {
  if (forceInit || canFetch(moduleState, ac)) {
    const { visitAppNames } = ac.rootState.portal;
    const queryOptions = subAppTool.makeQueryOptions({ page: 1, size: 100, appNames: visitAppNames });
    ac.dispatch(fetchDataList, queryOptions);
  }
}

/**
 * 初始化置顶推荐页面
 */
export async function initTop(forceInit, /** @type St*/ moduleState, /** @type AC*/ ac) {
  if (forceInit || canFetch(moduleState, ac)) {
    const queryOptions = subAppTool.makeQueryOptions({ page: 1, size: 100, isTop: 1 });
    ac.dispatch(fetchDataList, queryOptions);
  }
}

export async function initAllPage(p, /** @type St*/ moduleState, /** @type AC*/ ac) {
  let curPathname = commonService.getRouteRelativePath();
  if (curPathname === '/') curPathname = LATEST_VISIT;
  const path2Reducer = {
    [LATEST_VISIT]: initVisitList,
    [STAR]: initStarList,
    [STORE]: initPage,
    [TOP]: initTop,
    [CREATED]: initCreatedList,
  };
  const paths = Object.keys(path2Reducer);
  const restPathnames = arrUtil.removeIfExist(paths, curPathname);
  const needRefreshReducer = path2Reducer[curPathname];
  // 指明模块，表示reducer是修改对应模块的数据
  await ac.dispatch([path2Module[curPathname], needRefreshReducer], true);
  // 剩余的页面仅标记需要刷新标记为true即可
  restPathnames.forEach((pathname) => {
    const moduleName = path2Module[pathname];
    ccReducer[moduleName].setState({ needRefresh: true });
  });
}

export function changePageAndLoading({ page, loading }) {
  return { loading, page };
  // if (page === 1) {
  //   return { loading, page };
  // }
  // return { btnLoading: loading, page };
}

export async function fetchDataList(payload = {}, /** @type St*/ moduleState, /** @type AC*/ ac) {
  const { listMode, searchStr, classKey, isVerTabOpen, searchType, searchUser, loading } = moduleState;
  if (loading) {
    return;
  }

  const page = payload && payload.page ? payload.page : moduleState.page;
  const size = payload && payload.size ? payload.size : moduleState.size;
  const queryOptions = { page, size, where: {} };
  await ac.setState({ page, size });

  // 仅针对应用商店才区分正式或测试，才拼接 searchUser 或其他查询参数
  if (ac.module === ccModule.APP_STORE) {
    if (listMode === 'test') {
      queryOptions.where.is_test = 1;
    } else if (listMode === 'prod') {
      queryOptions.where.is_test = 0;
    }

    if (['name', 'name_exact'].includes(searchType) && searchStr) {
      const pureStr = searchStr.replace(/ /g, '');
      if (pureStr) {
        // 模糊匹配 or 精确匹配
        queryOptions.where.name = searchType === 'name' ? `%%${pureStr}%%` : pureStr;
      }
    } else if (searchType === 'creator' && searchUser) {
      queryOptions.where.create_by = searchUser;
    }

    if (classKey !== '-10000') {
      queryOptions.where.class_key = classKey;
    }
  }

  if (payload.where) Object.assign(queryOptions.where, payload.where);

  const { name2SubApp } = moduleState;
  try {
    await ac.dispatch(changePageAndLoading, { loading: true, page });

    const { apps: fetchedSubApps, total } = await subAppService.querySubApps(queryOptions);
    const { starAppNames } = ac.rootState.portal;
    const { subApps, name2SubApp: new_name2SubApp } = subAppTool.formatSubApps(fetchedSubApps, starAppNames);

    await ac.dispatch(changePageAndLoading, { loading: false, page });
    if (subApps.length === 0 && page > 1) {
      msgService.warn('没有更多子应用了', 1);
      return null;
    }

    if (ac.module !== ccModule.APP_STORE) {
      subApps.sort(strUtil.buildStrSorter((o) => o.app_group_name));
    }

    Object.assign(name2SubApp, new_name2SubApp);
    syncAppMapToPortalSilently(new_name2SubApp);

    // 需要自动打开版本列表弹窗
    if (isVerTabOpen) {
      await ac.setState({ isVerTabOpen: false });
      const toOpenSubApp = subApps.find((item) => item.name === searchStr);
      if (toOpenSubApp) {
        emit(OPEN_SUB_APP_DRAWER, toOpenSubApp, 'version');
      }
    }

    return { subApps, name2SubApp, total };
  } catch (err) {
    msgService.error(err.message);
    return { loading: false };
  }
}

/**
 * 处理搜藏按钮点击(可能是新增收藏，也可能是取消收藏)
 */
export async function handleStarIconClick({ appName, needDel = false }, /** @type St*/ moduleState, /** @type AC*/ ac) {
  const { name2SubApp } = moduleState;
  const subAppName = appName;
  const subApp = name2SubApp[subAppName];

  if (subApp) {
    subApp._loading = true;
    await ac.setState({ name2SubApp });
    // 是未收藏状态则标记收藏，反之则标记取消收藏
    const starIt = !subApp._star;
    const payload = { appName: subAppName, _star: starIt };

    try {
      await subAppService.updateUserStarApp(subAppName, starIt);
      await ccReducer.portal.updateStarApps(payload);
      subApp._loading = false;
      subApp._star = starIt;
      await ac.setState({ name2SubApp });

      if (needDel) {
        await ac.dispatch(delSubAppInView, subAppName);
        ccReducer.portal.delStarApp(subAppName);
      }

      await ac.dispatch(handleOtherPages, payload);
    } catch (err) {
      subApp._loading = false;
      await ac.setState({ name2SubApp });
    }
  }
}

/**
 * 处理删除最近访问点击
 */
export async function handleDelIconClick(subAppName, /** @type St*/ moduleState, /** @type AC*/ ac) {
  const { name2SubApp } = moduleState;
  const subApp = name2SubApp[subAppName];

  if (subApp) {
    subApp._loading = true;
    await ac.setState({ name2SubApp });

    await subAppService.delUserVisitApp(subAppName);
    await ac.dispatch(delSubAppInView, subAppName);
    ccReducer.portal.delVisitApp(subAppName);
  }
}

/**
 * 删除列表里的子应用视图
 */
export function delSubAppInView(subAppName, /** @type St*/ moduleState) {
  const { name2SubApp, subApps } = moduleState;
  const idx = subApps.findIndex((v) => v.name === subAppName);
  if (idx >= 0) {
    delete name2SubApp[subAppName];
    subApps.splice(idx, 1);
    return { name2SubApp, subApps };
  }
}

/**
 * 该appStore模块被克隆为startList latestVist top 这3个其他模块了
 * 任意一个模块的subApp发生变化时，通知其他两个模块进行相应的数据更新
 */
export function handleOtherPages(toUpdatePartial) {
  const curPathname = commonService.getRouteRelativePath();
  const restPathnames = arrUtil.removeIfExist([LATEST_VISIT, STAR, STORE, TOP], curPathname);
  restPathnames.forEach((pathname) => {
    const moduleName = path2Module[pathname];
    if (pathname === LATEST_VISIT || pathname === STAR || pathname === TOP) {
      ccReducer[moduleName].setState({ needRefresh: true });
    } else {
      // 应用商店页面时无限多的，值针对性的该目标子应用属性即可
      ccReducer.appStore.updateSubAppViewModel(toUpdatePartial);
    }
  });
}

export function updateSubAppViewModel({ appName, ...rest }, /** @type St*/ moduleState) {
  const { name2SubApp } = moduleState;
  const subApp = name2SubApp[appName];

  if (subApp) {
    Object.keys(rest).forEach((key) => {
      subApp[key] = rest[key];
    });
    return { name2SubApp };
  }
}

export async function updateSubApp(toUpdate, /** @type St*/ moduleState, /** @type AC*/ ac) {
  const { is_local_render, render_app_host, class_key } = toUpdate;
  if (is_local_render === false) {
    if (!render_app_host) {
      msgService.info('应用选择了不在当前平台渲染，请填写【应用的渲染域名】');
      return false;
    } else if (!regs.url.test(render_app_host)) {
      msgService.info('填写的应用渲染域名不合法');
      return false;
    }
  }

  if (!class_key) {
    toUpdate.class_key = '';
    toUpdate.class_name = '';
  }

  const res = await subAppService.updateSubApp(toUpdate);
  if (parseInt(res.code, 10) !== 0) {
    msgService.warn(res.msg);
    return false;
  }
  await ac.dispatch(initAllPage);
  return true;
}

export async function searchApp(payload, /** @type St*/ moduleState, /** @type AC*/ ac) {
  // 点击搜索就自动置为 all，方便查询出所有应用
  // await ac.setState({ listMode: 'all' });
  await ac.dispatch(fetchDataList, { page: 1 });
}

export async function refreshCurPage(payload, /** @type St*/ moduleState, /** @type AC*/ ac) {
  await ac.dispatch(fetchDataList);
}

export function refreshStoreApp(/** @type SubApp */ appInfo, /** @type St*/ moduleState, /** @type AC*/ ac) {
  const { subApps, name2SubApp } = moduleState;
  const { starAppNames } = ac.rootState.portal;
  subAppTool.formatSubApp(appInfo, starAppNames);
  const oldData = name2SubApp[appInfo.name];
  if (oldData) {
    Object.assign(oldData, appInfo);
  } else {
    name2SubApp[appInfo.name] = appInfo;
  }
  return { subApps, name2SubApp };
}

export async function resetAppInfoCache(appName, /** @type St*/ moduleState, /** @type AC*/ ac) {
  const appInfo = await subAppService.resetAppInfoCache(appName);
  if (appInfo) {
    await ac.dispatch(refreshStoreApp, appInfo);
  }
}
