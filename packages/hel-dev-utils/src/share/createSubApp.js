/** @typedef {import('typings').IInnerSubAppOptions} IInnerSubAppOptions */
/** @typedef {import('typings').ICreateSubAppOptions} ICreateSubAppOptions */
import * as base from '../base-utils/index';
import { getNpmCdnHomePage } from '../inner-utils/index';
import cst from './cst';

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
  const optionsVar = userOptions || {};
  // 设置 defaultHomePage 为 ''，是为了让下面的 getPublicPathOrUrl 第一位参数生效 
  const envParams = base.getHelEnvParams(pkg, { defaultHomePage: '' });
  const externals = optionsVar.externals || presetExternals[frameworkType];
  const jsonpFnName = base.getJsonpFnName(envParams.appName || pkg.name);

  if (optionsVar.npmCdnType) {
    envParams.appHomePage = getNpmCdnHomePage(pkg, optionsVar.npmCdnType);
  }

  return {
    /**
     * 资源的网络根目录
     * 形如：
     * 1 /web-app/sub-apps/ticket
     * 2 http://www.cdn.com/xxx/yyy
     */
    homePage: envParams.appHomePage,
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
     * @param {string} [defaultPathOrUrl] 
     * @param {boolean} [ensureEndSlash] 
     * @returns 
     */
    getPublicPathOrUrl: (defaultPathOrUrl = '/', ensureEndSlash = true) => {
      if (envParams.appHomePage) {
        return base.getPublicPathOrUrl(envParams.appHomePage, ensureEndSlash);
      }
      return defaultPathOrUrl;
    },
    distDir: cst.HEL_DIST_DIR,
  };
}
