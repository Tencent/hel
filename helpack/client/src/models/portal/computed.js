/** @typedef {typeof import('./state').default} St*/
import { HEL_ADMINS } from 'configs/constant';

export function displaySubAppWithSideBar(n) {
  const { sideBarVisible, contentVisible } = n;
  // 显示了基座侧边栏显示了，但是它的主内容没显示，此时正在展示子应用
  return sideBarVisible && !contentVisible;
}

export function displaySubAppOnly(n) {
  const { sideBarVisible, contentVisible } = n;
  return !sideBarVisible && !contentVisible;
}

export function isCurActiveAppRich(/** @type St*/ n) {
  const { activeApp, name2SubApp } = n;
  const targetApp = name2SubApp[activeApp];
  return targetApp && targetApp.is_rich;
}

export function isAdmin(/** @type St*/ n) {
  const { userInfo } = n;
  return HEL_ADMINS.includes(userInfo.user);
}
