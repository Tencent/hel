/** @typedef {import('../../typings').IInnerSubAppOptions} IInnerSubAppOptions */
/** @typedef {import('../../typings').ICreateSubAppOptions} ICreateSubAppOptions */
import * as base from '../base-utils/index';
import cst from '../configs/consts';

const presetExternals = {
  react: base.getReactExternals(),
  vue2: base.getVue2Externals(),
  vue3: base.getVue3Externals(),
  lib: {},
};

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
    },
    userOptions || {},
  );
  const envParams = base.getHelEnvParams(pkg, optionsVar);
  const externals = optionsVar.externals || presetExternals[frameworkType];
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
     * @param {boolean} [ensureEndSlash]
     * @returns
     */
    getPublicPathOrUrl: (fallbackPathOrUrl = '/', ensureEndSlash = true) => {
      const pathOrUrl = envParams.appHomePage || fallbackPathOrUrl;
      const finalPathOrUrl = base.getPublicPathOrUrl(pathOrUrl, ensureEndSlash);
      return finalPathOrUrl;
    },
    distDir: cst.HEL_DIST_DIR,
  };
}
