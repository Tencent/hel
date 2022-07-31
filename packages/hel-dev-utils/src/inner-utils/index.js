/** @typedef {import('types/biz').FileDesc} FileDesc*/
import * as fs from 'fs';

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

  fileFullPathList.forEach(fileAbsolutePath => {
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
  console.log(`[Hel verbose:] `, ...args);
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
    else return arg;
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
  'unpkg': 'https://unpkg.com',
};

export function getNpmCdnHomePage(packageJson, npmCdnType = 'unpkg', distDir = 'hel_dist') {
  const { name, version } = packageJson;
  return `${cdnType2host[npmCdnType]}/${name}@${version}/${distDir}`;
}
