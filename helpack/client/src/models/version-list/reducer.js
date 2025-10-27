/* eslint-disable no-unused-vars */
/** @typedef {import('components/GeneralTable/type').FetchFnParams} FetchFnParams */
/** @typedef {ReturnType<import('./state').default>} St */
/** @typedef {Partial<St>} ReturnSt */
/** @typedef {import('types/store').AC<'VersionList'>} AC */
import { evNames } from 'components/GeneralTable';
import { emit } from 'concent';
import * as mods from 'configs/constant/ccModule';
import { ccReducer, getModelState } from 'services/concent';
import * as msgSrv from 'services/message';
import * as subAppSrv from 'services/subApp';
import * as subAppTool from 'services/subAppTool';
import * as subAppVersionSrv from 'services/subAppVersion';
import * as objUtil from 'utils/object';

const inner = {
  refreshTableCurPage() {
    emit([evNames.refreshTableCurPage, 'vTable']);
  },
  refreshTable() {
    emit([evNames.refreshTable, 'vTable']);
  },
};

// function forCopy(payload, /** @type St */m, /** @type AC*/ac) {}

export async function refreshTableCurPage() {
  inner.refreshTableCurPage();
}

export async function freshSubApp(appName) {
  const subApp = await subAppSrv.getSubApp(appName);
  subAppTool.formatSubApp(subApp);
  ccReducer.appStore.refreshStoreApp(subApp);
  return { subApp };
}

export async function freshSubAppGlobalMarkInfo(appName) {
  const globalData = await subAppSrv.getAppGlobalData(appName);
  const {
    mark_info: { markedList },
  } = globalData;
  return { globalMarkedList: markedList };
}

export async function freshSubAppAssociate(appName, /** @type St */ m, /** @type AC*/ ac) {
  const name = appName || m.subApp.name;
  await Promise.all([ac.dispatch(freshSubApp, name), ac.dispatch(freshSubAppGlobalMarkInfo, name)]);
}

export async function freshSubAppAssociateAndTable(payload, /** @type St */ m, /** @type AC*/ ac) {
  const { subApp } = m;
  await ac.dispatch(freshSubAppAssociate, subApp.name);
  await ac.dispatch(refreshTableCurPage);
}

export async function fetchVersionList(/** @type FetchFnParams */ payload, /** @type St */ m) {
  const { subApp, listMode, globalMarkedList } = m;
  const { userMarkedList } = getModelState(mods.PORTAL);
  const { current, pageSize } = payload;
  const { name: appName } = subApp;
  const countData = await subAppVersionSrv.countSubAppVersionList(appName);

  // 计算用户标记的版本
  let verList = [];
  const pushToVerList = (item) => objUtil.noDupPush(verList, item.ver);
  globalMarkedList.forEach(pushToVerList);
  userMarkedList.filter((item) => item.name === appName).forEach(pushToVerList);
  subApp.online_version && objUtil.noDupPush(verList, subApp.online_version);
  subApp.build_version && objUtil.noDupPush(verList, subApp.build_version);
  const markTotal = verList.length;
  const start = (current - 1) * pageSize;
  verList = verList.slice(start, start + pageSize);

  /** @type {Array{any}} */
  let pageList = [];
  let tableTotal = countData.total;
  if (listMode === 'all') {
    tableTotal = countData.total;
    pageList = await subAppVersionSrv.getSubAppVersionList(appName, current, pageSize);
    pageList.push({ $uiType: 'switchMarkTip', sub_app_version: Date.now() }); // 末尾添加一个跳转已标记列表的提示
  } else {
    tableTotal = markTotal;
    pageList = await subAppVersionSrv.getSubAppVersionListByVers(appName, verList);
    pageList.push({ $uiType: 'switchAllTip', sub_app_version: Date.now() }); // 末尾添加一个跳转所有列表的提示
  }
  // 表格头部翻页功能暂时关闭，如需打开，解开下面注释即可
  // pageList.unshift({ $uiType: 'topPagination' }); // 头部插入一个翻页组件

  return { total: tableTotal, pageList, markTotal, buildTotal: countData.total };
}

export async function updateAppVersion(payload = {}, /** @type St */ m, /** @type AC*/ ac) {
  const inputVersion = payload.inputVersion || m.inputVersion;
  const changeMode = payload.changeMode || m.changeMode;

  const { subApp } = m;
  const { id, name } = subApp;
  const pureVersion = inputVersion.replace(/ /g, '');
  if (!pureVersion) {
    return void msgSrv.warn('请输入版本号', 2);
  }
  const toUpdate = { id, name };

  try {
    if (changeMode === 'online') {
      if (subApp.online_version === pureVersion) {
        return void msgSrv.info('线上版本无变化', 2);
      }
      // 线上版本必需是来自线上应用
      const versionData = await subAppSrv.getSubAppVersion(name, pureVersion);
      if (!versionData || objUtil.isNull(versionData)) {
        return void msgSrv.warn('版本不存在', 2);
      }
      if (versionData.sub_app_name !== subApp.name) {
        return void msgSrv.warn('当前修改版本所属的应用名和目标应用不一致', 2);
      }
      toUpdate.online_version = pureVersion;
    } else if (changeMode === 'gray') {
      if ((subApp.build_version === pureVersion) & (subApp.is_in_gray === 1)) {
        return void msgSrv.info('灰度版本无变化', 2);
      }
      toUpdate.build_version = pureVersion;
      toUpdate.is_in_gray = 1;
    } else {
      return void msgSrv.warn(`未知的 changeMode ${changeMode}`, 2);
    }

    await ac.setState({ updateLoading: true });
    const res = await subAppSrv.updateSubApp(toUpdate);
    if (`${res.code}` !== '0') {
      msgSrv.warn(res.msg, 2);
      return { updateLoading: false };
    }
    Object.assign(subApp, toUpdate);
    return { updateLoading: false, subApp };
  } catch (err) {
    msgSrv.info(err.message, 2);
    return { updateLoading: false };
  }
}

export async function clickUpdateVersionBtn(payload, /** @type St */ m, /** @type AC*/ ac) {
  await ac.dispatch(updateAppVersion, payload);
  emit([evNames.refreshTableCurPage, 'vTable']);
  await ccReducer.appStore.initAllPage();
}

/**
 * @returns {ReturnSt}
 */
export function clear() {
  return { subApp: {}, inputVersion: '', showInput: false };
}

export function showChangeOnlineInput() {
  return { showInput: true, changeMode: 'online' };
}

export function showChangeGrayInput() {
  return { showInput: true, changeMode: 'gray' };
}

export async function agreeGray(payload, /** @type St */ m, /** @type AC*/ ac) {
  const { subApp } = m;
  try {
    await ac.setState({ updateLoading: true });
    const res = await subAppSrv.updateSubApp({ id: subApp.id, name: subApp.name, online_version: subApp.build_version, is_in_gray: 0 });
    if (`${res.code}` !== '0') {
      msgSrv.warn(res.msg);
      return { updateLoading: false };
    }
    subApp.online_version = subApp.build_version;
    subApp.is_in_gray = 0;
    msgSrv.success('灰度通过成功', 1);
    return { updateLoading: false, subApp };
  } catch (err) {
    msgSrv.info(err.message);
    return { updateLoading: false };
  }
}

export async function clickAgreeGrayBtn(payload, /** @type St */ m, /** @type AC*/ ac) {
  await ac.setState({ grayBtnLoading: true });
  await ac.dispatch(agreeGray);
  await ac.setState({ grayBtnLoading: false });
  emit([evNames.refreshTableCurPage, 'vTable']);
  await ccReducer.appStore.initAllPage();
}

export async function delAppUserMark(params, /** @type St */ m, /** @type AC*/ ac) {
  const { appName, ver } = params;
  await subAppSrv.delAppUserMarkInfo({ name: appName, ver });
  await ccReducer.portal.initUserExtendData(); // 刷新用户扩展数据
  inner.refreshTableCurPage();
}

export async function delAppGlobalMark(params, /** @type St */ m, /** @type AC*/ ac) {
  const { appName, ver } = params;
  await subAppSrv.delAppGlobalMarkInfo({ name: appName, ver });
  await ac.dispatch(freshSubAppGlobalMarkInfo, appName);
  inner.refreshTableCurPage();
}

export async function changeListMode(listMode, /** @type St */ m, /** @type AC*/ ac) {
  await ac.setState({ listMode });
  await ac.dispatch(freshSubAppAssociate, m.subApp.name);
  inner.refreshTable();
}

export async function updateProjVer(dataList, /** @type St */ m, /** @type AC*/ ac) {
  const { subApp } = m;
  await ac.setState({ updateLoading: true });
  // utime 用于后台校验，简单防止数据提交脏写（严格来说后台加锁更保险），后台校验通过后会自动变更为最新的时间戳
  const proj_ver = { map: {}, utime: subApp.proj_ver.utime };
  dataList.forEach((item) => {
    proj_ver.map[item.id] = { o: item.onlineVerId, b: item.buildVerId };
  });
  try {
    const res = await subAppSrv.updateSubApp({ id: subApp.id, name: subApp.name, proj_ver });
    if (`${res.code}` !== '0') {
      msgSrv.warn(res.msg);
      return { updateLoading: false };
    }

    msgSrv.success('【项目与版本】配置更新成功', 1);
    subApp.proj_ver = res.data.proj_ver;
    return { updateLoading: false, subApp };
  } catch (err) {
    msgSrv.info(err.message);
    return { updateLoading: false };
  }
}

export async function resetVerCache(payload) {
  const { verAppName, verID } = payload;
  await subAppVersionSrv.resetVerCache(verAppName, verID);
}
