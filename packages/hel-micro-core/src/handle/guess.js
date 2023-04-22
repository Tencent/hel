import { log } from '../base/microDebug';
import { getJsRunLocation } from '../base/util';
import { DEFAULT_ONLINE_VER, DEFAULT_PLAT } from '../consts';
import { getSharedCache } from '../wrap/cache';

export function tryGetVersion(appGroupName, platform) {
  // 形如: at c (https://{cdn_host_name}/{platform}/{appname_prefixed_version}/static/js/4.b60c0895.chunk.js:2:44037
  // 用户串改过的话，可能是：at c (https://{user_cdn}/{user_dir1}/{user_dir2 ...}/{platform}/{appname_prefixed_version}/...)
  const loc = getJsRunLocation();
  log(`[[ core:tryGetVersion ]] may include source > ${loc}`);

  const { appGroupName2firstVer } = getSharedCache(platform);
  const callerSpecifiedVer = appGroupName2firstVer[appGroupName] || '';

  if (loc.includes('https://') || loc.includes('http://')) {
    const [, restStr] = loc.split('//');
    const strList = restStr.split('/');

    // 优先判断可能包含的版本特征
    if (callerSpecifiedVer) {
      if (platform === DEFAULT_PLAT && strList.some((item) => item.includes(callerSpecifiedVer))) {
        return callerSpecifiedVer;
      }
      if (strList.includes(callerSpecifiedVer)) {
        return callerSpecifiedVer;
      }
      // strList: ['xxxx.com:8888', 'static', 'js']，本地联调时的特征
      if ((strList['1'] === 'static' && strList['2'] === 'js') || strList['1'] === 'js') {
        return callerSpecifiedVer;
      }
    }

    // [ 'unpkg.com' , 'hel-lodash@1.1.0' , ... ]
    if (platform === DEFAULT_PLAT) {
      return strList[1].split('@')[1] || callerSpecifiedVer;
    }

    // 走默认的规则： {cdn_host_name}/{platform}/{appname_prefixed_version}，取下标2对应元素作为版本号
    return strList[2] || callerSpecifiedVer;
  }

  // 在微容器里运行时，js全是在VM里初始化的，此时拿不到具体的加载链接了
  return callerSpecifiedVer;
}

export function tryGetAppName(/** @type string */ version, appGroupName) {
  if (version === DEFAULT_ONLINE_VER) {
    return appGroupName || '';
  }

  // 来自 helpack 管理台的版本号规则
  if (version.includes('_')) {
    // lib-test_20220621165953 ---> lib-test
    const appName = version.substring(0, version.length - 15);
    return appName;
  }

  // 来自 unpkg
  return appGroupName || '';
}
