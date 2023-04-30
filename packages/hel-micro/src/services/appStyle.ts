/**
 * 样式相关的服务
 */
import type { HelLoadStatusEnum } from 'hel-micro-core';
import * as core from 'hel-micro-core';
import type { IAssetItem, IEmitStyleInfo } from 'hel-types';
import { isEmitVerMatchInputVer } from '../shared/util';
import type { ICustom, IGetOptionsLoose, IInnerPreFetchOptions, IStyleDataResult, IWaitStyleReadyOptions } from '../types';
import { requestGet } from '../util';
import { getPlatAndVer } from './appParam';
import { getWebDirPath } from './share';

const { KEY_CSS_STR } = core.helConsts;
const { LOADED, LOADING, NOT_LOAD } = core.helLoadStatus;
const { merge2List } = core.commonUtil;
const eventBus = core.getHelEventBus();
const { STYLE_STR_FETCHED } = core.helEvents;

export interface IFetchStyleOptions extends IGetOptionsLoose {
  /** default: true, 是否需要把css列表转成样式字符串 */
  cssListToStr?: boolean;
  /** 支持透传额外的样式地址列表 */
  extraCssList?: string[];
  /** 支持透传额外的样式字符串 */
  extraStyleStr?: string;
  /** 透传 应用自己的样式列表 + extraCssUrlList 额外样式列表给用户，用户可依此再次排除掉一部分样式，返回的是欲排除的样式列表 */
  getExcludeCssList?: IInnerPreFetchOptions['getExcludeCssList'];
  strictMatchVer?: boolean;
}

const inner = {
  isStyleStatusMatch(appName: string, judeStatus: HelLoadStatusEnum, options: IGetOptionsLoose) {
    const { platform, versionId } = getPlatAndVer(appName, options);
    const status = core.getVerStyleStrStatus(appName, { platform, versionId });
    return status === judeStatus;
  },

  /**
   * 获取应用自身的样式列表，返回如下
   * buildCssList ：应用构建生成的
   * initExtraCssList ：preFetch 是设定的，该列表只接收一次设置，后续不再变动
   * appCssList ：应用构建生成的与能追加的 staticLink、relativeLink 全部样式列表
   */
  getSelfCssList(appName: string, options: IGetOptionsLoose) {
    const platAndVer = getPlatAndVer(appName, options);
    const appVersion = core.getVersion(appName, platAndVer);
    // 获取用户 preFetch 时设定的额外样式列表
    const initExtraCssList = core.getVerExtraCssList(appName, platAndVer);
    // 获取构建阶段生成的样式列表
    let buildCssList: string[] = [];
    // 应用自身的所有样式列表，包含构建的 staticLink、relativeLink 里可以追加的，preFetch 是设定的 extraCssList
    let appCssList: string[] = [];
    if (appVersion) {
      const { chunkCssSrcList = [], headAssetList = [], bodyAssetList = [] } = appVersion.src_map || {};
      buildCssList = chunkCssSrcList;
      const filterCssList = (assetList: IAssetItem[]) => {
        const resultList: string[] = [];
        assetList.forEach((assetItem) => {
          const { append = true } = assetItem; // 默认 true，兼容旧数据
          const href = assetItem.attrs.href || '';
          if (href.endsWith('.css') && append) {
            resultList.push(href);
          }
        });
        return resultList;
      };
      const htmlCssList = merge2List(filterCssList(headAssetList), filterCssList(bodyAssetList));
      appCssList = merge2List(htmlCssList, buildCssList);
    }
    appCssList = merge2List(appCssList, initExtraCssList);
    return { buildCssList, initExtraCssList, appCssList };
  },

  async fetchStyleStr(cssList: string[]) {
    let str = '';
    // 暂不考虑异常情况，一个 url 拉取失败则中断渲染
    for (let i = 0, len = cssList.length; i < len; i++) {
      const cssUrl = cssList[i];
      if (!cssUrl.endsWith('.css')) {
        continue;
      }
      let cachedCssStr = core.getCommonData(KEY_CSS_STR, cssUrl);
      if (!cachedCssStr) {
        // 此处在 for 循环里 try catch，是为了保证 css 获取失败时，不影响组件加载
        // 例如 net::ERR_NAME_NOT_RESOLVED
        try {
          const result = await requestGet(cssUrl, false);
          cachedCssStr = result.reply;
          core.setCommonData(KEY_CSS_STR, cssUrl, cachedCssStr);
        } catch (err: any) {
          console.error(err);
        }
      }
      str += cachedCssStr;
    }
    return str;
  },

  async waitStyleReady(appName: string, options: IWaitStyleReadyOptions) {
    let handleStyleFetched: any = null;

    await new Promise((resolve) => {
      handleStyleFetched = (styleInfo: IEmitStyleInfo) => {
        const { appName: emitAppName, platform: emitPlatform, versionId: emitVer } = styleInfo;
        const { versionId: inputVer, platform, strictMatchVer } = options;
        if (
          emitAppName !== appName
          || emitPlatform !== platform
          || !isEmitVerMatchInputVer(appName, { platform, emitVer, inputVer, strictMatchVer })
        ) {
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

  computeStyleData(appName: string, options: IFetchStyleOptions) {
    const platAndVer = getPlatAndVer(appName, options);
    const { appCssList, buildCssList, initExtraCssList } = inner.getSelfCssList(appName, options);
    const { extraCssList = [], getExcludeCssList } = options; // extraCssList 此时表示二次透传的
    const allCssList = merge2List(appCssList, extraCssList);
    const excludeCssList = getExcludeCssList?.(allCssList, { version: core.getVersion(appName, platAndVer) }) || [];

    // 仅使用应用自身的样式列表
    const onlyUseAppCssList = !excludeCssList.length && !extraCssList.length;

    let validCssList = allCssList;
    if (excludeCssList.length) {
      // 按照 excludeCssList 配置过滤 allCssList ，才是最终得到的合法样式列表
      validCssList = allCssList.filter((item) => !excludeCssList.includes(item));
    }
    return { validCssList, onlyUseAppCssList, buildCssList, initExtraCssList, appCssList };
  },

  async fetchStyleData(appName: string, options: IFetchStyleOptions) {
    const platAndVer = getPlatAndVer(appName, options);
    const { extraStyleStr = '', cssListToStr, extraCssList = [] } = options;
    const { validCssList, onlyUseAppCssList, buildCssList, initExtraCssList, appCssList } = inner.computeStyleData(appName, options);

    // renderStyleStr 为渲染用到的样式字符串
    const result: IStyleDataResult = {
      validCssList,
      buildCssList,
      initExtraCssList,
      appCssList,
      extraCssList,
      extraStyleStr,
      renderStyleStr: '',
    };
    if (!cssListToStr) {
      return result;
    }

    if (onlyUseAppCssList) {
      const status = core.getVerStyleStrStatus(appName, platAndVer);
      let appStyleStr = '';

      // 有其他上层调用已经触发样式获取逻辑，这里调用 waitStyleReady 等待样式获取动作完成即可
      if (status === LOADING) {
        await inner.waitStyleReady(appName, { ...platAndVer, strictMatchVer: options.strictMatchVer });
        appStyleStr = core.getAppStyleStr(appName, platAndVer) || '';
      } else if (status === NOT_LOAD) {
        core.setVerStyleStrStatus(appName, LOADING, platAndVer);
        appStyleStr = await inner.fetchStyleStr(appCssList);
        core.setAppStyleStr(appName, appStyleStr, platAndVer);
        core.setVerStyleStrStatus(appName, LOADED, platAndVer);
        eventBus.emit(STYLE_STR_FETCHED, { appName, ...platAndVer }); // 预设的样式列表转换为字符串完毕
      } else {
        appStyleStr = core.getAppStyleStr(appName, platAndVer) || '';
      }

      result.renderStyleStr = `${appStyleStr}${extraStyleStr}`;
    } else {
      const styleStr = await inner.fetchStyleStr(validCssList);
      result.renderStyleStr = `${styleStr}${extraStyleStr}`;
    }

    return result;
  },
};

/**
 * 返回渲染用的样式字符串传、及相关样式列表计算结果，具体描述见 IStyleDataResult
 * 调用者需自己确保版本数据已获取，即 preFetchApp 或 preFetchLib 已调用
 */
export async function fetchAppStyleData(appName: string, options?: IFetchStyleOptions): Promise<IStyleDataResult> {
  const result = await inner.fetchStyleData(appName, options || {});
  return result;
}

/**
 * 应用构建生成的 + 能追加的 staticLink、relativeLink + preFetch 时设置的 extraCssList 的全部样式列表之合集对应的字符串
 * 调用者需自己确保 appCssList 样式字符串已拉取，即  preFetchApp 或 preFetchLib 调用之后， fetchAppStyleData 已调用
 */
export function getAppStyleStr(appName: string, options?: IGetOptionsLoose) {
  const platAndVer = getPlatAndVer(appName, options);
  const styleStr = core.getAppStyleStr(appName, platAndVer);
  return styleStr;
}

/**
 * 获取应用自身的样式列表，返回如下
 * buildCssList ：应用构建生成的样式列表
 * initExtraCssList ：preFetch 是设定的样式列表，该列表只接收一次设置，后续不再变动
 * appCssList ：应用构建生成的 + 能追加的 staticLink、relativeLink + preFetch 时设置的 extraCssList 的全部样式列表之合集
 */
export function getAppCssList(appName: string, options?: IGetOptionsLoose) {
  const result = inner.getSelfCssList(appName, options || {});
  return result;
}

/**
 * 通过样式列表获取样式字符串
 * @param cssUrlList
 * @returns
 */
export async function fetchStyleByUrlList(cssUrlList: string[]) {
  const styleStr = await inner.fetchStyleStr(cssUrlList);
  return styleStr;
}

/**
 * 判断样式是否已经异步拉取过了
 */
export function isStyleFetched(appName: string, options?: IGetOptionsLoose) {
  return inner.isStyleStatusMatch(appName, LOADED, options || {});
}

/**
 * 禁用所有 style tag 样式
 */
export function disableStyleTags(groupName: string) {
  const g = core.getGlobalThis();
  if (g.document) {
    const styleTags = g.document.querySelectorAll(`style[data-gname="${groupName}"]`);
    styleTags.forEach(core.commonUtil.disableNode);
  }
}

export function getStyleTagText(groupName: string) {
  const styleTagText = core.commonDataUtil.getStyleTagText(groupName);
  return styleTagText;
}

/**
 * 获取因主动设置了 ignoreCssPrefix 规则而忽略掉的样式列表
 */
export function getIgnoredCssUrlList(name: string, options?: IGetOptionsLoose & { custom?: ICustom }) {
  const cssPrefix = getSuitableCssPrefix(name, options);
  const cssList = core.commonDataUtil.getIgnoreCssPrefixCssUrlList(cssPrefix) || [];
  return cssList;
}

/**
 * 获取合适的 css 前缀
 */
export function getSuitableCssPrefix(name: string, options?: IGetOptionsLoose & { custom?: ICustom }) {
  const custom = ((options || {}).custom || {}) as ICustom;
  let cssPrefix = '';
  const { host, enable = true } = custom;
  if (host && enable) {
    if (host.endsWith('.json') || host.endsWith('.html')) {
      const arr = host.split('/');
      const len = arr.length;
      arr.splice(len - 1, len); // 去掉最后一位元素
      cssPrefix = arr.join('/');
    } else {
      cssPrefix = host;
    }
  } else {
    cssPrefix = getWebDirPath(name, options);
  }
  return cssPrefix;
}
