/**
 * hel-dev-utils@5.3.2
 */
import { IMeta } from 'hel-types';
import { ICheckOptions, ICreateSubAppOptions, ISubAppBuildDesc, IUserExtractOptions, PkgJson, FileDesc } from './src/types';

export type { ICheckOptions, ICreateSubAppOptions, ISubAppBuildDesc, IUserExtractOptions };


export declare const cst: {
  HEL_DIST_DIR: 'hel_dist';
  HEL_PROXY_DIR: 'hel_proxy';
  HEL_BUNDLE_DIR: 'hel_bundle';
  DEFAULT_GUESS_SUB_APP_CONF_PATH: string;
  DEFAULT_PLAT: 'unpkg';
  DEFAULT_NPM_CDN_TYPE: 'unpkg';
  DEFAULT_SEMVER_API: true;
  DEFAULT_HTML_INDEX_NAME: 'index.html';
  PLUGIN_VER: string;
};

export declare const baseUtils: {
  // 兼容历史调用
  ensureSlash: (path: string, options: { need: boolean; loc: 'end' | 'start' }) => string;
  // 兼容历史调用
  slash: {
    start: (path: string) => string;
    noStart: (path: string) => string;
    end: (path: string) => string;
    noEnd: (path: string) => string;
  };
  getHelProcessEnvParams: () => {
    appHomePage: string;
    appGroupName: string;
    appName: string;
  };
  getHelEnvParams: () => {
    appHomePage: string;
    appGroupName: string;
    appName: string;
  };
  /**
   * @param appName
   * @param useTimestampSuffix - default: true
   */
  getJsonpFnName: (appName: string, useTimestampSuffix: boolean) => string;
  /**
   * @param homePage
   * @param needSlash - default: true
   */
  getPublicPathOrUrl: (homePage: string, needSlash: boolean) => string;
  makeFileDescList: (
    fileFullPathList: string,
    appHomePage: string,
    splitStrForFilePathUnderBuild?: string,
  ) => FileDesc[];
  verbose: (...args: any[]) => void;
  verboseH: (argHandler: (arg: any, idx: number) => any, ...args: any[]) => void;
  verboseObj: (...args: any[]) => void;
  getCdnHostFromHomePage: (homePage: string) => string;
  getAppVersionFromHomePage: (homePage: string) => string;
  getZoneNameFromHomePage: (homePage: string) => string;
  getNpmCdnHomePage: (packageJson: object, options: { npmCdnType?: string, distDir?: string, homePage: string }) => string;
};

export declare function check(pkgJson: PkgJson, subAppFilePathOrOptions: ICheckOptions['fileFullPath'] | ICheckOptions): void;

export declare function createReactSubApp(pkgJson: PkgJson, options: ICreateSubAppOptions): ISubAppBuildDesc;

/**
 * @deprecated
 * 创建vue2应用描述信息，已不推荐此方法，可使用 createVueSubApp 替换
 */
export declare function createVue2SubApp(pkgJson: PkgJson, options: ICreateSubAppOptions): ISubAppBuildDesc;

/**
 * @deprecated
 * 创建vue3应用描述信息，已不推荐此方法，可使用 createVueSubApp 替换
 */
export declare function createVue3SubApp(pkgJson: PkgJson, options: ICreateSubAppOptions): ISubAppBuildDesc;

/**
 * 创建vue应用描述信息
 */
export declare function createVueSubApp(pkgJson: PkgJson, options: ICreateSubAppOptions): ISubAppBuildDesc;

/**
 * 创建react应用描述信息
 */
export declare function createLibSubApp(pkgJson: PkgJson, options: ICreateSubAppOptions): ISubAppBuildDesc;
