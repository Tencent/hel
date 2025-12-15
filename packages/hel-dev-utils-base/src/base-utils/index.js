/** @typedef {import('../types').ICreateSubAppOptions} ICreateSubAppOptions */
import { slash } from 'hel-utils-base';

// 兼容历史逻辑
export const ensureSlash = slash.ensureSlash;

export { slash };

export function getHelProcessEnvParams() {
  const { env } = process;
  // 用户可在本地或流水线脚本执行时注入这些变量，取 CMS_xx 仅为了兼容一些历史脚本能正常运行
  const { HOST, PORT } = env;
  // appHomePage, 形如 http://xxx.com/hel/app1@1.1.1
  // 或 http://xxx.com/hel/app1_20191219024010 等用户自定义的部署位置
  const envHomePage = env.HEL_APP_HOME_PAGE || env.CMS_APP_HOME_PAGE;
  // cdn 域名，未指定 HEL_APP_HOME_PAGE 但指定了 HEL_APP_CDN_PATH 时，
  // 会生成形如 {HEL_APP_CDN_PATH}/{lib_name}@{version}/hel_dist 的 homePage 值
  const envCdnPath = env.HEL_APP_CDN_PATH || env.CMS_APP_CDN_PATH;
  // 某些构建场景，通过命令行注入了应用名
  const envGroupName = env.HEL_APP_GROUP_NAME || env.CMS_APP_GROUP_NAME;
  const envName = env.HEL_APP_NAME || env.CMS_APP_NAME;

  let appHomePage = envHomePage || '';
  let appHomePageDev = '';
  if (HOST || PORT) {
    const host = HOST || 'localhost';
    const port = PORT || '80';
    const hotsStr = host.startsWith('http') ? host : `http://${host}`;
    appHomePageDev = `${hotsStr}:${port}`;
  }

  return {
    appHomePage,
    appHomePageDev,
    appCdnPath: envCdnPath,
    appGroupName: envGroupName,
    appName: envName,
  };
}

/**
 * @param {Record<string, any>} pkg
 * @param {ICreateSubAppOptions} options
 * @returns
 */
export function getHelEnvParams(pkg, options = {}) {
  const { distDir, homePage: userCustomHomePage, handleHomePage = true, npmCdnType, homePageDev } = options;
  // 来自 process.env 的值优先级最高
  const p0EnvParams = getHelProcessEnvParams();

  let cdnHomePage = '';
  // 通常 unpkg 为私服时会透传 homePage 值
  if (handleHomePage) {
    const targetHomePage = p0EnvParams.appCdnPath || userCustomHomePage;
    cdnHomePage = getNpmCdnHomePage(pkg, { distDir, npmCdnType, homePage: targetHomePage });
  }

  let appHomePage = p0EnvParams.appHomePage || cdnHomePage || userCustomHomePage || pkg.homepage || '/';
  if (process.env.NODE_ENV === 'development') {
    appHomePage = p0EnvParams.appHomePageDev || homePageDev || '/';
  }

  const appName = p0EnvParams.appName || pkg.appGroupName || pkg.name || '';
  return {
    appHomePage,
    appGroupName: p0EnvParams.appGroupName || pkg.appGroupName || appName,
    appName,
  };
}

/**
 * @param {string} appName - hel 管理台注册的应用名 或 package.name
 * @param {boolean} [useTimestampSuffix=true] - default: true, 是否设置时间戳后缀
 * 设置为 true 时，支持同一个模块正确执行多版本js文件
 * 如不需要同屏加载同一个模块的多个版本功能，且需要自己定制一些其他逻辑，可以设置为false
 */
export function getJsonpFnName(appName, useTimestampSuffix = true) {
  if (useTimestampSuffix) {
    return `helJsonp_${appName}_${Date.now()}`;
  }

  return `helJsonp_${appName}`;
}

/**
 *
 * @param {string} homePage - 应用homePage
 * @param {boolean} [needSlash]
 * @returns
 */
export function getPublicPathOrUrl(homePage, needSlash = true) {
  return slash.ensureSlash(homePage, { loc: 'end', need: needSlash });
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
  console.log('[Hel-verbose:] ', ...args);
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
  const deployPath = homePage || cdnType2host[npmCdnType] || '';

  // TODO，未来考虑更多类型的 cdn，如：jsdelivr
  return `${slash.end(deployPath)}${name}@${version}/${distDir}`;
}
