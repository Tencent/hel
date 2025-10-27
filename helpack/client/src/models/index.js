import * as ccModule from 'configs/constant/ccModule';
import appStore from './app-store';
import portal from './portal';
import serverModList from './server-mod-list';
import versionList from './version-list';

export default {
  [ccModule.APP_STORE]: appStore,
  [ccModule.VERSION_LIST]: versionList,
  [ccModule.SERVER_MOD_LIST]: serverModList,
  [ccModule.PORTAL]: portal,
  // 克隆 appStore 的逻辑
  [ccModule.LATEST_VISIT]: appStore,
  [ccModule.STAR_LIST]: appStore,
  [ccModule.CREATED_LIST]: appStore,
  [ccModule.TOP]: appStore,
};
