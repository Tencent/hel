import { log } from '../base/microDebug';
import { getJsRunLocation } from '../base/util';
import { DEFAULT_ONLINE_VER } from '../consts';
import { getSharedCache } from '../wrap/cache';

// 正常情况只有一个 @ 形如： xxxx@1.1.1 ---> 1.1.1
// 如果有多个 @ 这样写能保证准确还原，形如：xxx@1.1.1@my@s ---> 1.1.1@my@s，
// 不过写入版本的地方已卡死格式，所以这里理论上来说不能存在两个以上的@符号
function getVerFromAtInMiddle(nameAndVer, callerSpecifiedVer) {
  const list = nameAndVer.split('@');
  const verList = list.slice(1);
  const ver = verList.join('@');
  return ver || callerSpecifiedVer || nameAndVer;
}

function isJs(str) {
  return str === 'js' || str === 'mjs';
}

/**
 * 根据执行脚本链接猜测当前模块的版本号，脚本链接例如：
 * https://cdn.jsdelivr.net/npm/hel-lodash@2.3.4/hel_dist/hel_userChunk_1.js
 * https://unpkg.com/hel-lodash@2.3.4/hel_dist/hel_userChunk_1.js
 * https://tnfe.gtimg.com/hel/remote-react-comps-tpl_20241228190308/xxx.js
 * https://tnfe.gtimg.com/hel/@my/remote-react-comps-tpl@1.1.1/xxx.js
 * 对于新版协议meta返回的是版本号标签（即后台的version_tag）
 * 对于旧版协议meta返回的是版本号索引（即后台的sub_app_version）
 */
export function tryGetVersion(appGroupName, platform) {
  // 形如: at c (https://{cdn_host_name}/{platform}/{appname_prefixed_version}/static/js/4.b60c0895.chunk.js:2:44037
  // 如果用户调整过，可能是：at c (https://{user_cdn}/{user_dir1}/{user_dir2 ...}/{platform}/{appname_prefixed_version}/...)
  const loc = getJsRunLocation();
  log(`[[ core:tryGetVersion ]] may include ver source > ${loc}`);

  const { appGroupName2firstVer } = getSharedCache(platform);
  const callerSpecifiedVer = appGroupName2firstVer[appGroupName] || '';

  if (loc.includes('https://') || loc.includes('http://')) {
    const [, restStr] = loc.split('//');
    // strList 形如：
    // ['unpkg.com', 'hel-lodash@1.1.0', ...]
    // ['unpkg.com', '@someScope', 'xxx@1.1.0', ...]
    // ['cdn.jsdelivr.net', 'npm', 'hel-lodash@2.3.4', 'hel_dist', ...]
    // ['tnfe.gtimg.com', 'hel', 'remote-react-comps-tpl_20241228190308', ...]
    const strList = restStr.split('/');

    // 优先判断可能包含的版本特征
    if (callerSpecifiedVer) {
      // tnfe.gtimg.com/hel/@tencent/mono-comps@20250816051000/static/xxx 匹配 /@tencent/mono-comps@20250816051000/
      // tnfe.gtimg.com/hel/mono-comps@20250816051000/static/xxx 匹配 /mono-comps@20250816051000/
      const hasSpecifiedVer = restStr.includes(`/${callerSpecifiedVer}/`);
      if (hasSpecifiedVer) {
        // 避免 tnfe.gtimg.com/hel/@tencent/mono-comps@20250816051000/static/xxx 匹配 /mono-comps@20250816051000/ 成功
        // 需排除错误场景
        const isSpecifiedVerHasScope = callerSpecifiedVer.startsWith('@');
        if (!isSpecifiedVerHasScope) {
          // 此时 callerSpecifiedVer 为不带 scope 前缀的 versionIndex 值
          const idx = strList.indexOf(callerSpecifiedVer);
          const prevSeg = strList[idx - 1];
          const isPrevSegScope = prevSeg.startsWith('@');
          if (!isPrevSegScope) {
            return getVerFromAtInMiddle(callerSpecifiedVer);
          }

          // 运行到这里，prevSeg 表示 scope，但 callerSpecifiedVer 是无 scope 前缀的，此时不执行任何逻辑则成功排除了上述错误场景
        } else {
          const verSeg = callerSpecifiedVer.split('/')[1] || '';
          return getVerFromAtInMiddle(verSeg);
        }
      }

      // strList: ['xxxx.com:8888', 'static', 'js']，本地联调时的特征
      const str1 = strList[1];
      const str2 = strList[2];
      if ((str1 === 'static' && isJs(str2)) || isJs(str1)) {
        return getVerFromAtInMiddle(callerSpecifiedVer);
      }
    }

    const atSymbolIdx = restStr.indexOf('@');
    // 使用了符合 npm cdn 方式的链接生成规范
    if (atSymbolIdx >= 0) {
      const atSymbolSegs = strList.filter((v) => v.includes('@'));
      const scopeSegIdx = atSymbolSegs.findIndex((v) => v.startsWith('@'));
      if (scopeSegIdx >= 0) {
        const verSeg = atSymbolSegs[scopeSegIdx + 1] || '';
        return getVerFromAtInMiddle(verSeg, callerSpecifiedVer);
      }
      const verSeg = atSymbolSegs[0] || '';
      return getVerFromAtInMiddle(verSeg, callerSpecifiedVer);
    }

    // 使用的是旧版本 helpack 链接规范（注：新版 helpack 链接已支持 npm cdn 规范）
    // 旧规范格式链接形如：
    // {cdn_host_name}/{platform}/{appname_prefixed_version}
    // {user_cdn}/{user_dir1}/{user_dir2 ...}/{platform}/{appname_prefixed_version}/
    const [, verStartStr = ''] = restStr.split(`/${platform}/`);
    const [verInUrl] = verStartStr.split('/');
    return verInUrl || callerSpecifiedVer;
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
