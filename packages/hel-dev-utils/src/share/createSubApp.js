/** @typedef {import('../../typings').IInnerSubAppOptions} IInnerSubAppOptions */
/** @typedef {import('../../typings').ICreateSubAppOptions} ICreateSubAppOptions */
import * as base from '../base-utils/index';
import cst from '../configs/consts';
import presetExternals from '../configs/presetExternals';

/**
 *
 * @param {Record<string, any>} pkg
 * @param {IInnerSubAppOptions} innerOptions
 * @param {ICreateSubAppOptions} [userOptions]
 * @returns
 */
export default function createSubApp(pkg, innerOptions, userOptions) {
  const { frameworkType } = innerOptions;
  const optionsVar = Object.assign(
    {
      platform: cst.DEFAULT_PLAT,
      npmCdnType: cst.DEFAULT_NPM_CDN_TYPE,
      handleHomePage: true,
      semverApi: cst.DEFAULT_SEMVER_API,
    },
    userOptions || {},
  );
  const envParams = base.getHelEnvParams(pkg, optionsVar);
  const externals = Object.assign({}, optionsVar.externals || {}, presetExternals[frameworkType] || {});
  const jsonpFnName = base.getJsonpFnName(envParams.appName || pkg.name);

  return {
    platform: optionsVar.platform,
    /**
     * 资源的网络根目录
     * 形如：
     * 1 /web-app/sub-apps/ticket
     * 2 http://www.cdn.com/xxx/yyy
     */
    homePage: envParams.appHomePage,
    npmCdnType: optionsVar.npmCdnType,
    groupName: envParams.appGroupName,
    /** 构建时可注入到应用的APP_NAME下 */
    name: envParams.appName,
    externals,
    /**
     * @param {Record<string, any>} userExternals
     * @returns
     */
    getExternals: (userExternals) => {
      if (userExternals && !Array.isArray(userExternals)) {
        return { ...userExternals, externals };
      }
      return externals;
    },
    jsonpFnName,
    /**
     * @param {string} [fallbackPathOrUrl] 兜底用的 publicPathOrUrl
     * @param {boolean} [needEndSlash]
     * @returns
     */
    getPublicPathOrUrl: (fallbackPathOrUrl = '/', needEndSlash = true) => {
      let pathOrUrl = envParams.appHomePage;
      // 用户传递了非 / 的值时，优先采用用户传递的值
      if (pathOrUrl === '/' && fallbackPathOrUrl !== '/') {
        pathOrUrl = fallbackPathOrUrl;
      }

      const finalPathOrUrl = base.getPublicPathOrUrl(pathOrUrl, needEndSlash);
      return finalPathOrUrl;
    },
    distDir: cst.HEL_DIST_DIR,
  };
}
