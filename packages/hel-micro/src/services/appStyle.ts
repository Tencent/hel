/**
 * 样式相关的服务
 */
import type { HelLoadStatusEnum } from '../deps/helMicroCore';
import * as core from '../deps/helMicroCore';
import type { IEmitStyleInfo } from '../deps/helTypes';
import { isEmitVerMatchInputVer } from '../shared/util';
import type { IGetOptionsLoose, IInnerPreFetchOptions, IPlatAndVer } from '../types';
import { merge2List, requestGet } from '../util';
import { getPlatAndVer } from './appParam';

const { LOADED, LOADING } = core.helLoadStatus;
const eventBus = core.getHelEventBus();
const { STYLE_STR_FETCHED } = core.helEvents;
/** 缓存拉去过的字符串, TODO: 下沉到 core */
const cssUrlMap: Record<string, string> = {};
interface IFetchStyleOptions extends IGetOptionsLoose {
  /** 支持透传额外的样式地址列表 */
  extraCssUrlList?: string[];
  /** 透传 应用自己的样式列表 + extraCssUrlList 额外样式列表给用户，用户可依此再次排除掉一部分样式，返回的是欲排除的样式列表 */
  getExcludeCssList?: IInnerPreFetchOptions['getExcludeCssList'];
}

const inner = {
  isStyleStatusMatch(appName: string, judeStatus: HelLoadStatusEnum, options: IGetOptionsLoose) {
    const { platform, versionId } = getPlatAndVer(appName, options);
    const { appName2verStyleFetched } = core.getSharedCache(platform);
    const ver = versionId || core.DEFAULT_ONLINE_VER;
    return appName2verStyleFetched[appName]?.[ver] === judeStatus;
  },

  getStyleUrlList(appName: string, options: IGetOptionsLoose): string[] {
    const platAndVer = getPlatAndVer(appName, options);
    const appVersion = core.getVersion(appName, platAndVer);
    const extraCssList = core.getVerExtraCssList(appName, platAndVer);

    let buildCssList: string[] = [];
    if (appVersion) {
      buildCssList = appVersion.src_map?.chunkCssSrcList || [];
    }

    const allCssList = merge2List(extraCssList, buildCssList);
    return allCssList;
  },

  async fetchStyleStr(cssList: string[]) {
    let str = '';
    // 暂不考虑异常情况，一个 url 拉取失败则中断渲染
    for (let i = 0, len = cssList.length; i < len; i++) {
      const cssUrl = cssList[i];
      let cachedCssStr = cssUrlMap[cssUrl];
      if (!cachedCssStr) {
        // 此处在 for 循环里 try catch，是为了保证 css 获取失败时，不影响组件加载
        // 例如 net::ERR_NAME_NOT_RESOLVED
        try {
          const result = await requestGet(cssUrl, false);
          cachedCssStr = result.reply;
        } catch (err: any) {
          console.error(err);
        }
      }
      str += cachedCssStr;
    }
    return str;
  },

  async waitStyleReady(appName: string, options: IPlatAndVer) {
    let handleStyleFetched: any = null;
    await new Promise((resolve) => {
      handleStyleFetched = (styleInfo: IEmitStyleInfo) => {
        const { appName: emitAppName, platform: emitPlatform, versionId: emitVer } = styleInfo;
        const { versionId: inputVer, platform } = options;
        if (emitAppName !== appName || emitPlatform !== platform || !isEmitVerMatchInputVer(appName, { platform, emitVer, inputVer })) {
          return;
        }
        resolve(true);
      };

      // 先监听，再触发资源加载，确保监听不会有遗漏
      eventBus.on(STYLE_STR_FETCHED, handleStyleFetched);
    });

    if (handleStyleFetched) {
      eventBus.off(STYLE_STR_FETCHED, handleStyleFetched);
    }
  },

  async fetchAndCacheAppStyleStr(appName: string, options: IFetchStyleOptions) {
    const platAndVer = getPlatAndVer(appName, options);
    const cachedStr = core.getAppStyleStr(appName, platAndVer);
    if (cachedStr) {
      return cachedStr;
    }

    if (inner.isStyleStatusMatch(appName, LOADED, options)) {
      return ''; // 确实是抓取过了，但没有拉到样式字符串
    }

    // 有其他上层调用已经触发样式获取逻辑，这里调用 waitStyleReady 等待样式获取动作完成即可
    if (inner.isStyleStatusMatch(appName, LOADING, options)) {
      await inner.waitStyleReady(appName, platAndVer);
      const cachedStr = core.getAppStyleStr(appName, platAndVer);
      return cachedStr;
    }

    core.setVerStyleStrStatus(appName, LOADING, platAndVer);
    const { extraCssUrlList = [] } = options;
    let styleList = inner.getStyleUrlList(appName, options);
    // 拼上用户设定的额外样式
    styleList = styleList.concat(extraCssUrlList);
    // 获得用户需要排除的所有样式列表
    const excludeCssList = options.getExcludeCssList?.(styleList, { version: core.getVersion(appName, platAndVer) }) || [];
    // 过滤 styleList，去掉未排除的样式得到最终需要转化为字符串的样式列表
    const finalStyleList = styleList.filter((item) => !excludeCssList.includes(item));

    const styleStr = await inner.fetchStyleStr(finalStyleList);
    core.setAppStyleStr(appName, styleStr, platAndVer);
    core.setVerStyleStrStatus(appName, LOADED, platAndVer);
    eventBus.emit(STYLE_STR_FETCHED, { appName, ...platAndVer });
    return styleStr;
  },
};

/**
 * 异步拉取应用的所有样式字符串（构建动态产生，页面静态引用的）
 * 调用者需自己确保版本数据已获取，即 preFetchApp 或 preFetchLib 已调用
 */
export async function fetchStyleStr(appName: string, options?: IFetchStyleOptions): Promise<string> {
  const styleStr = await inner.fetchAndCacheAppStyleStr(appName, options || {});
  return styleStr;
}

export async function fetchStyleByUrlList(cssUrlList: string[]) {
  const styleStr = await inner.fetchStyleStr(cssUrlList);
  return styleStr;
}

/**
 * 获取应用缓存的所有样式字符串（构建动态产生，页面静态引用的）
 * 调用者需自己确保样式字符串已拉取，即 fetchStyleStr 已调用
 */
export function getStyleStr(appName: string, options?: IGetOptionsLoose) {
  const platAndVer = getPlatAndVer(appName, options);
  const styleStr = core.getAppStyleStr(appName, platAndVer);
  return styleStr;
}

/**
 * 获取应用的所有样式列表（构建动态产生，页面静态引用的）
 * 调用者需自己确保版本数据已获取，即 preFetchApp 或 preFetchLib 已调用
 * @returns {string[]}
 */
export function getStyleUrlList(appName: string, options?: IGetOptionsLoose): string[] {
  const getStyleUrlList = inner.getStyleUrlList(appName, options || {});
  return getStyleUrlList;
}

/**
 * 判断样式是否已经异步拉取过了
 */
export function isStyleFetched(appName: string, options?: IGetOptionsLoose) {
  return inner.isStyleStatusMatch(appName, LOADED, options || {});
}
