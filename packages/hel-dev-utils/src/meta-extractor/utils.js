/** @typedef {import('hel-types').ISrcMap} SrcMap*/
import * as fs from 'fs';
import cst from '../configs/consts';
import { slash } from '../inner-utils/slash';

export function getIndexHtmlFileName(dirPath) {
  const names = fs.readdirSync(dirPath);
  let indexHtmlName = '';
  let matchCount = 0;
  names.forEach((name) => {
    if (name.endsWith('.html')) {
      matchCount += 1;
      indexHtmlName = name;
    }
  });
  if (!matchCount) {
    throw new Error('no index.html found');
  }
  if (matchCount > 1) {
    throw new Error(`there are more than one indexHtml file under [${dirPath}]!`);
  }
  return indexHtmlName;
}

/**
 * 递归获得某个目录下的所有文件绝对路径
 * @param {string} dirPath 形如:/user/zzk/log/build
 * @return {string[]} filePathList
 * 形如 ['/user/zzk/log/build/js/xx.js', '/user/zzk/log/build/img/xx.png']
 */
export function getAllFilePath(dirPath) {
  const _getAllFilePath = (dirPath, filePathList) => {
    const names = fs.readdirSync(dirPath);
    names.forEach((name) => {
      const stats = fs.statSync(`${dirPath}/${name}`);
      if (stats.isDirectory()) {
        _getAllFilePath(`${dirPath}/${name}`, filePathList);
      } else {
        filePathList.push(`${dirPath}/${name}`);
      }
    });
  };

  const filePathList = [];
  _getAllFilePath(dirPath, filePathList);
  return filePathList;
}

/**
 * @param {import('../types').IUserExtractOptions} extractOptions
 */
export function makeAppVersionSrcMap(extractOptions) {
  const { appInfo, indexHtmlName = cst.DEFAULT_HTML_INDEX_NAME, extractMode = 'all' } = extractOptions;
  const { homePage } = appInfo;

  // 用于更新到数据库的app信息，通常来说在构建机器上触发
  // 从上往下的key顺序也是在html创建的顺序
  return {
    webDirPath: slash.noEnd(homePage),
    htmlIndexSrc: `${slash.end(homePage)}${indexHtmlName}`,
    extractMode,
    iframeSrc: '',
    chunkCssSrcList: [], //  all build css files
    chunkJsSrcList: [], // all build js files
    staticCssSrcList: [], // all static css files
    staticJsSrcList: [], // all static js files
    relativeCssSrcList: [], // all relative js files
    relativeJsSrcList: [], // all relative js files
    headAssetList: [],
    bodyAssetList: [],
    otherSrcList: [],
    srvModSrcList: [],
    srvModSrcIndex: '',
  };
}

/**
 * 从 index.html 提取资源的描述数据，包含 htmlContent、srcMap
 * @param {import('../types').IUserExtractOptions} userExtractOptions
 */
export function makeHelMetaJson(userExtractOptions, parsedRet) {
  const defaultDesc = `this version meta is created by hel-dev-utils@${cst.PLUGIN_VER}`;
  const { packageJson, extractMode = 'build', subApp, desc = defaultDesc } = userExtractOptions;
  const { homePage, groupName, name: appName, semverApi, platform } = subApp;

  /**
   *  构建版本号，当指定了 homePage 且不想采用默认的版本号生成规则时，才需要透传 buildVer 值
   *  默认生成规则：
   *  内网包：裁出 homePage ${cdnHost}/${appZone}/${appName}_${dateStr} 里的 ${appName}_${dateStr} 作为版本号
   *  外网包：pkg.version
   */
  let versionTag = userExtractOptions.buildVer;
  let versionIndex = '';

  const packVer = packageJson.version;
  if (!versionTag) {
    if (semverApi) {
      versionTag = packVer;
      versionIndex = `${packageJson.name}@${packVer}`;
    } else {
      try {
        const pureHomePage = slash.noEnd(homePage);
        // ${cdnHost}/${appZone}/${appName}_${dateStr}
        const [, restStr] = pureHomePage.split('//');

        const strList = restStr.split('/');
        const lastStr = strList[strList.length - 1];
        // restStr 是新格式，形如：tnfe.gtimg.com/hel/hel-hello-helpack@20250814103253
        if (lastStr.includes('@')) {
          versionTag = lastStr.split('@')[1];
          const prevStr = strList[strList.length - 2] || '';
          versionIndex = prevStr.startsWith('@') ? `${prevStr}/${lastStr}` : lastStr;
        } else {
          const arr = lastStr.split('_');
          const mayVersionTag = arr[arr.length - 1] || '';
          const len = mayVersionTag.length;
          // 特征符合 helpack 的版本号，14位时间年月日字符串：20250620173919，13位时间戳字符串：1750468673912
          const isHelpackTimeSeg = len === 14 || len === 13;
          if (isHelpackTimeSeg && new RegExp('^[1-9]+[0-9]*$').test(mayVersionTag)) {
            versionTag = mayVersionTag;
            versionIndex = lastStr;
          }
        }
      } catch (err) { }
    }
  }
  const repo = packageJson.repository || {};
  const currentDate = new Date();
  const currentISOUTCString = currentDate.toISOString();

  // 自定义 homePage 后，版本未必能推导出来，降级为使用 package.json 版本号
  versionTag = versionTag || packVer;
  versionIndex = versionIndex || `${appName}@${versionTag}`;

  return {
    app: {
      name: appName,
      app_group_name: groupName,
      git_repo_url: repo.url || packageJson.homepage || '',
      online_version: versionTag,
      build_version: versionTag,
      platform: platform || cst.DEFAULT_PLAT,
      create_at: currentISOUTCString,
    },
    version: {
      plugin_ver: cst.PLUGIN_VER,
      extract_mode: extractMode,
      sub_app_name: appName,
      sub_app_version: versionIndex,
      version_tag: versionTag,
      src_map: parsedRet.srcMap,
      html_content: parsedRet.htmlContent,
      create_at: currentISOUTCString,
      desc,
    },
  };
}
