/** @typedef {import('../types').ICreateSubAppOptions} ICreateSubAppOptions */
import cst from '../configs/consts';
import { getNpmCdnHomePage } from '../inner-utils/index';

/**
 * @param {string} inputPath
 * @param {Object} options
 * @param {'end' | 'start'} [options.loc='end']
 * @param {boolean} [options.need=false]
 */
export function ensureSlash(inputPath, options) {
  const { need, loc = 'end' } = options;
  const isEnd = loc === 'end';
  const hasSlash = isEnd ? inputPath.endsWith('/') : inputPath.startsWith('/');

  const shouldDelSlash = hasSlash && !need;
  const shouldAddSlash = !hasSlash && need;
  if (isEnd) {
    if (shouldDelSlash) {
      return inputPath.substring(0, inputPath.length - 1);
    }
    if (shouldAddSlash) {
      return `${inputPath}/`;
    }
  }
  if (!isEnd) {
    if (shouldDelSlash) {
      // del start slash
      return inputPath.substring(1);
    }
    if (shouldAddSlash) {
      return `/${inputPath}`;
    }
  }

  return inputPath;
}

/** 语义化 slash 相关操作，方便上层理解和使用 */
export const slash = {
  start: (path) => ensureSlash(path, { loc: 'start', need: true }),
  noStart: (path) => ensureSlash(path, { loc: 'start', need: false }),
  end: (path) => ensureSlash(path, { loc: 'end', need: true }),
  noEnd: (path) => ensureSlash(path, { loc: 'end', need: false }),
};

export function getHelProcessEnvParams() {
  // 以下常量由蓝盾流水线注入（由流水线变量或bash脚本注入）
  const {
    HOST,
    PORT,
    // appHomePage, 形如 http://xxx.cdn.com/hel/app1_2020121201011666
    HEL_APP_HOME_PAGE,
    /** 在构建机环境时，会注入真正对应的应用名 */
    HEL_APP_GROUP_NAME,
    // cdn 域名，未指定 HEL_APP_HOME_PAGE 但指定了 HEL_APP_CDN_PATH 时，
    // 会生成形如 {HEL_APP_CDN_PATH}/{lib_name}@{version}/hel_dist 的 homePage 值
    HEL_APP_CDN_PATH,
    HEL_APP_NAME,
  } = process.env;

  let appHomePage = HEL_APP_HOME_PAGE || '';
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
    appCdnPath: HEL_APP_CDN_PATH,
    appGroupName: HEL_APP_GROUP_NAME,
    appName: HEL_APP_NAME,
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
  return ensureSlash(homePage, { loc: 'end', need: needSlash });
}
