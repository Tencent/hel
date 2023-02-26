/** @typedef {import('../../typings').FileDesc} FileDesc*/
import * as fs from 'fs';
import cst from '../configs/consts';

/**
 * 递归获得某个目录下的所有文件绝对路径
 * @param {string} dirPath 形如:/user/zzk/log/build
 * @return {string[]} filePathList
 * 形如 ['/user/zzk/log/build/js/xx.js', '/user/zzk/log/build/img/xx.png']
 */
export function getAllFilePath(dirPath) {
  const _getAllFilePath = (dirPath, filePathList) => {
    const names = fs.readdirSync(dirPath);
    names.forEach(function (name) {
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
 * 生成符合上传cos的文件描述对象列表
 * @return {FileDesc[]} fileDescList
 */
export function makeFileDescList(fileFullPathList, appHomePage, splitStrForFilePathUnderBuild = 'build/') {
  const fileDescList = [];
  const appVersion = getAppVersionFromHomePage(appHomePage);
  const zoneName = getZoneNameFromHomePage(appHomePage);

  fileFullPathList.forEach((fileAbsolutePath) => {
    // 获取文件处于build目录下的相对路径，形如：
    //  /static/js/runtime-main.66c45929.js
    //  /asset-manifest.json
    const filePathUnderBuild = fileAbsolutePath.split(splitStrForFilePathUnderBuild)[1];

    fileDescList.push({
      fileAbsolutePath,
      fileWebPathWithoutHost: `${zoneName}/${appVersion}/${filePathUnderBuild}`,
      fileWebPath: `${appHomePage}/${filePathUnderBuild}`,
    });
  });

  return fileDescList;
}

export function verbose(...args) {
  console.log(`[Hel-verbose:] `, ...args);
}

/**
 * verbose with handler
 * @param {} argHandler
 * @param  {...any} args
 */
export function verboseH(argHandler, ...args) {
  const handledArgs = args.map((arg, idx) => argHandler(arg, idx));
  verbose(...handledArgs);
}

/**
 * stringify obj in args
 * @param  {...any} args
 */
export function verboseObj(...args) {
  verboseH((arg) => {
    if (typeof arg === 'object') return JSON.stringify(arg);
    return arg;
  }, ...args);
}

/**
 * input : https://xxxxx.yy.com/<zoneName>/<relativeDirName>
 * output: https://xxxxx.yy.com
 * @param {string} homePage
 */
export function getCdnHostFromHomePage(homePage) {
  const [protocolStr, restStr] = homePage.split('//');
  const [hostName] = restStr.split('/');
  return `${protocolStr}//${hostName}`;
}

/**
 * input : https://xxxxx.yy.com/<zoneName>/<relativeDirName>
 * output: <relativeDirName>
 * @param {string} homePage
 * @return {string} appVersion
 */
export function getAppVersionFromHomePage(homePage) {
  const arr = homePage.split('/');
  return arr[arr.length - 1];
}

/**
 * input : https://xxxxx.yy.com/<zoneName>/<relativeDirName>
 * output: <zoneName>
 * @param {string} homePage
 * @return {string} appVersion
 */
export function getZoneNameFromHomePage(homePage) {
  const arr = homePage.split('/');
  return arr[arr.length - 2];
}

const cdnType2host = {
  unpkg: 'https://unpkg.com',
  jsdelivr: 'https://cdn.jsdelivr.net/npm',
};

export function getNpmCdnHomePage(packageJson, options) {
  const { npmCdnType = cst.DEFAULT_NPM_CDN_TYPE, distDir = cst.HEL_DIST_DIR, homePage } = options;
  const { name, version } = packageJson;
  // 优先考虑用户透传的 homePage，表示用户部署了 unpkg 私服
  const unpkgHost = homePage || cdnType2host[npmCdnType] || '';
  // TODO，未来考虑更多类型的 cdn，如：jsdelivr
  return `${unpkgHost}/${name}@${version}/${distDir}`;
}
