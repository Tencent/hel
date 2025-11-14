/** @typedef {import('../types').ICreateSubAppOptions} ICreateSubAppOptions */
import { getNpmCdnHomePage } from '../inner-utils/index';
import * as slashMod from '../inner-utils/slash';

export const slash = slashMod.slash;

export const ensureSlash = slashMod.ensureSlash;

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
  return slashMod.ensureSlash(homePage, { loc: 'end', need: needSlash });
}
