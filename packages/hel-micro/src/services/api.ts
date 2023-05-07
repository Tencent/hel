import { commonUtil, helConsts } from 'hel-micro-core';
import type { ApiMode, ISubApp, ISubAppVersion, Platform } from 'hel-types';
import type { PreFetchKey } from '../alternative';
import * as alt from '../alternative';
import { getJSON } from '../browser/jsonp';
import { apiSrvConst, API_NORMAL_GET, JSONP_MARK } from '../consts/logic';
import { getPlatform } from '../shared/platform';
import type { IInnerPreFetchOptions } from '../types';
import { getSemverLatestVer, perfEnd, perfStart, requestGet } from '../util';

const { safeParse } = commonUtil;

interface IHelMeta {
  app: ISubApp;
  version: ISubAppVersion;
}

export interface IHelGetOptionsBase {
  platform?: Platform;
  apiMode?: ApiMode;
  /** 默认 false，是否获取 html_content */
  isFullVersion?: boolean;
  /** 默认 false，只需要版本数据 */
  onlyVersion?: boolean;
  semverApi?: boolean;
}

export interface IHelGetOptions extends IHelGetOptionsBase {
  versionId?: string;
  projectId?: string;
  loadOptions?: IInnerPreFetchOptions;
  /** 仅服务于自定义的 batch 模式 */
  versionIdList?: string[];
  projectIdList?: string[];
}

export type BatchGetFn = (passCtx: {
  platform: string;
  url: string;
  innerRequest: (url?: string, apiMode?: ApiMode) => Promise<IHelMeta[]>;
}) => Promise<IHelMeta[]> | IHelMeta[];

export interface IHelBatchGetOptions extends IHelGetOptions {
  batchGetFn?: BatchGetFn;
}

/** 内部用的工具函数 */
const inner = {
  /** 处理语义化版本平台返回的结果 */
  handleSemverRet(ret: any, options: IHelGetOptionsBase) {
    const { version } = ret || {};
    let retVar = ret;
    if (options.onlyVersion) {
      retVar = version;
    }
    if (!options.isFullVersion && version) {
      Reflect.deleteProperty(version, 'html_content');
    }
    if (!version) {
      return { data: null, code: '404', msg: 'no version found' };
    }
    return { data: retVar, code: '0', msg: '' };
  },
  appendSearchKV(oriStr: string, key: string, value?: string) {
    let newStr = oriStr;
    if (value) {
      newStr += `&${key}=${value}`;
    }
    return newStr;
  },
  appendSuffix(oriStr: string, suffix: string) {
    let newStr = oriStr;
    if (suffix) {
      newStr += suffix;
    }
    return newStr;
  },
};

async function executeGet<T extends any = any>(
  url: string,
  options: IHelGetOptionsBase,
): Promise<{ data: T | null; code: string; msg: string }> {
  let ret: any = null;
  const { semverApi = true } = options;
  // 确保一定向语义化版本平台发起 get 请求
  const apiMode = semverApi ? API_NORMAL_GET : options.apiMode;

  // 方便追踪请求耗时
  const perfLabel = `request ${url}`;
  perfStart(perfLabel);
  try {
    if (apiMode === API_NORMAL_GET) {
      const result = await requestGet(url);
      ret = result.reply;
    } else {
      // jsonp get
      ret = await getJSON(url);
    }
    perfEnd(perfLabel);

    // 请求语义化cdn平台时拿到的是原始数据，和自定义平台有差异
    // 这里做一下抹平处理，以便上层可以用一致的方式读取数据
    if (semverApi) {
      return inner.handleSemverRet(ret, options);
    }

    return ret;
  } catch (err: any) {
    return { data: null, code: '404', msg: err.message };
  }
}

function ensureApp(app: ISubApp) {
  const clonedApp = { ...app };
  clonedApp.additional_scripts = safeParse(clonedApp.additional_scripts, []);
  clonedApp.additional_body_scripts = safeParse(clonedApp.additional_body_scripts, []);
  return clonedApp;
}

function ensureVersion(version: ISubAppVersion) {
  const clonedVersion = { ...version };
  clonedVersion.src_map = safeParse(clonedVersion.src_map, {
    htmlIndexSrc: '',
    webDirPath: '',
    headAssetList: [],
    bodyAssetList: [],
    chunkJsSrcList: [],
    chunkCssSrcList: [],
    staticJsSrcList: [],
    staticCssSrcList: [],
    relativeJsSrcList: [],
    relativeCssSrcList: [],
    otherSrcList: [],
  });
  return clonedVersion;
}

/**
 * 生成版本语义化的元数据请求链接
 */
async function getSemverUrl(apiHost: string, appName: string, versionId: string, skip404Sniff = false) {
  let ver = versionId;
  if (!ver) {
    if (skip404Sniff) {
      ver = 'latest'; // latest 未必是最新的，unpkg 可能有延时，需用户自己抉择需不需要跳过404嗅探
    } else {
      ver = await getSemverLatestVer(appName, apiHost);
    }
  }
  // https://unpkg.com/hel-lodash@2.1.7/hel_dist/hel-meta.json
  // https://cdn.jsdelivr.net/npm/hel-lodash@2.1.7/hel_dist/hel-meta.json
  return `${apiHost}/${appName}@${ver}/hel_dist/hel-meta.json?_t=${Date.now()}`;
}

/**
 * 生成请求的自定义平台的请求信息
 */
export function prepareCustomPlatRequestInfo(appNameOrNames: string | string[], getOptions: IHelGetOptions) {
  const { versionId, projectId, apiMode, isFullVersion = false, versionIdList = [], projectIdList = [], loadOptions = {} } = getOptions;
  const platform = getPlatform(getOptions.platform);

  // trust me, appName will be reassign later
  let appName: string = appNameOrNames as string;
  let urlAppName = appName;
  let urlVersion = versionId;
  let urlProjId = projectId;
  let isBatch = false;
  if (Array.isArray(appNameOrNames)) {
    [appName] = appNameOrNames;
    urlAppName = appNameOrNames.join(',');
    urlVersion = versionIdList.join(',');
    urlProjId = projectIdList.join(',');
    isBatch = true;
  }

  // 按 preFetchOptions.{key} --> platInitOptions.{key} --> originInitOptions.{key} --> innerDefault 取值的函数
  const getVal = (key: PreFetchKey, defaultVal?: any) => {
    return alt.getVal(platform, key, [loadOptions[key], defaultVal]);
  };
  const getFnVal = (fnName: PreFetchKey, fnParams?: any) => {
    return alt.callFn(platform, fnName, fnParams, loadOptions[fnName]);
  };

  const userLsKey = getVal('userLsKey', helConsts.DEFAULT_USER_LS_KEY);
  const userName = getFnVal('getUserName', { platform, appName, userLsKey });
  const grayResult = getFnVal('shouldUseGray', { appName });
  const apiSuffix = getVal('apiSuffix');
  const apiPathOfApp = getVal('apiPathOfApp', helConsts.DEFAULT_API_URL);
  const apiHost = alt.genApiPrefix(platform, loadOptions);

  let grayVar = '';
  if (typeof grayResult === 'boolean') {
    grayVar = grayResult ? '1' : '0';
  }

  // 为自定义模块管理台拼接请求链接
  const jsonpMark = apiMode === API_NORMAL_GET ? '' : JSONP_MARK;
  let interfaceName = '';
  if (!isBatch) {
    interfaceName = !isFullVersion ? apiSrvConst.GET_APP_AND_VER : apiSrvConst.GET_APP_AND_FULL_VER;
  } else {
    interfaceName = !isFullVersion ? apiSrvConst.BATCH_GET_APP_AND_VER : apiSrvConst.BATCH_GET_APP_AND_FULL_VER;
  }
  const finalInterfaceName = `${interfaceName}${jsonpMark}`;

  let url = '';
  url = `${apiHost}${apiPathOfApp}/${finalInterfaceName}?name=${urlAppName}`;
  url = inner.appendSearchKV(url, 'userName', userName);
  url = inner.appendSearchKV(url, 'version', urlVersion);
  url = inner.appendSearchKV(url, 'projId', urlProjId);
  url = inner.appendSearchKV(url, 'gray', grayVar);
  url = inner.appendSuffix(url, apiSuffix);

  return { url, userName };
}

/**
 * 生成请求的 unpkg 平台的请求信息
 */
export async function prepareSemverRequestInfo(appName: string, getOptions: IHelGetOptions) {
  const { versionId, platform, loadOptions } = getOptions;
  const apiHost = alt.genApiPrefix(platform, loadOptions);
  const url = await getSemverUrl(apiHost, appName, versionId || '', loadOptions?.skip404Sniff);
  return url;
}

/**
 * 生成请求请求信息
 */
export async function prepareRequestInfo(appName: string, getOptions: IHelGetOptions) {
  const { loadOptions } = getOptions;
  let userName = '';
  let url = '';

  const semverApi = loadOptions?.semverApi ?? true;
  if (semverApi) {
    url = await prepareSemverRequestInfo(appName, getOptions);
  } else {
    const ret = prepareCustomPlatRequestInfo(appName, getOptions);
    url = ret.url;
    userName = ret.userName;
  }

  return { url, userName };
}

/**
 * 准备请求版本数据的 url 链接
 */
async function prepareRequestVersionUrl(versionId: string, getOptions: IGetVerOptions) {
  const { apiMode, appName, isFullVersion = false, semverApi = true } = getOptions;
  const platform = getPlatform(getOptions.platform);
  const apiHost = alt.getVal(platform, 'apiPrefix');
  const apiSuffix = alt.getVal(platform, 'apiSuffix');
  const apiPathOfApp = alt.getVal(platform, 'apiPathOfApp');
  const apiPathOfAppVersion = alt.getVal(platform, 'apiPathOfAppVersion');

  let url = '';

  if (semverApi) {
    url = await getSemverUrl(apiHost, appName, versionId);
  } else {
    // 为 hel pack 模块管理台拼接请求链接
    const jsonpMark = apiMode === API_NORMAL_GET ? '' : JSONP_MARK;
    const interfaceName = !isFullVersion ? apiSrvConst.GET_APP_VER : apiSrvConst.GET_APP_FULL_VER;
    const finalInterfaceName = `${interfaceName}${jsonpMark}`;

    const finalApiPath = apiPathOfAppVersion || apiPathOfApp || helConsts.DEFAULT_API_URL;
    url = `${apiHost}${finalApiPath}/${finalInterfaceName}?ver=${versionId}`;
    url = inner.appendSearchKV(url, 'name', appName);
    url = inner.appendSuffix(url, apiSuffix);
  }

  return url;
}

/**
 * 获取子应用和它的最新在线版本
 */
export async function getSubAppAndItsVersion(appName: string, getOptions: IHelGetOptions) {
  const { versionId, platform, apiMode, loadOptions } = getOptions;
  const getFn = alt.getFn(platform, 'getSubAppAndItsVersionFn', loadOptions?.getSubAppAndItsVersionFn);
  const { url, userName } = await prepareRequestInfo(appName, getOptions);

  // 内部的请求句柄
  const innerRequest = async (custUrl?: string, custApiMode?: ApiMode) => {
    const metaUrl = custUrl || url;
    const reply = await executeGet(metaUrl, { apiMode: custApiMode || apiMode, semverApi: loadOptions?.semverApi });
    if (0 !== parseInt(reply.code, 10) || !reply) {
      throw new Error(reply?.msg || 'getSubAppAndItsVersion err');
    }
    return { app: ensureApp(reply.data.app), version: ensureVersion(reply.data.version), metaUrl };
  };

  if (getFn) {
    const fnParams = { platform, appName, userName, versionId, url, innerRequest };
    const data = (await Promise.resolve(getFn(fnParams))) as {
      app: ISubApp;
      version: ISubAppVersion;
    };
    return { app: ensureApp(data.app), version: ensureVersion(data.version) };
  }

  const data = await innerRequest();
  return data;
}

export interface IGetVerOptions {
  apiMode: ApiMode;
  appName: string;
  semverApi?: boolean;
  platform?: Platform;
  /** 默认 false，是否获取 html_content */
  isFullVersion?: boolean;
}

/**
 * 获取子应用版本详情
 */
export async function getSubAppVersion(versionId: string, options: IGetVerOptions) {
  const { apiMode, isFullVersion = false, semverApi } = options;
  const url = await prepareRequestVersionUrl(versionId, options);

  const { data, code, msg } = await executeGet(url, { apiMode, isFullVersion, semverApi, onlyVersion: true });
  if (0 !== parseInt(code, 10) || !data) {
    throw new Error(msg || 'ver not found');
  }

  const versionData = ensureVersion(data);
  return versionData;
}

/**
 * 批量获取子应用版本详情
 */
export async function batchGetSubAppAndItsVersion(appNames: string[], batchGetOptions: IHelBatchGetOptions) {
  if (!appNames.length) {
    return [];
  }

  const { apiMode, batchGetFn, semverApi } = batchGetOptions;
  const platform = getPlatform(batchGetOptions.platform);
  const { url } = await prepareCustomPlatRequestInfo(appNames, batchGetOptions);
  const innerRequest = async () => {
    const { data, code, msg } = await executeGet<Array<IHelMeta>>(url, { apiMode, semverApi });
    if (0 !== parseInt(code, 10) || !data) {
      throw new Error(msg || 'batch get failed');
    }
    const list = data.map((item) => ({ app: ensureApp(item.app), version: ensureVersion(item.version) }));
    return list;
  };

  let list: IHelMeta[] = [];
  if (batchGetFn) {
    const fnParams: Parameters<BatchGetFn>[0] = { url, platform, innerRequest };
    list = (await Promise.resolve(batchGetFn(fnParams))) as IHelMeta[];
  } else {
    list = await innerRequest();
  }
  return list;
}
