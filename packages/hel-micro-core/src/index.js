/** @typedef {import('../index').IPlatformConfig} IPlatformConfig */
/** @typedef {import('../index').IPlatformConfigFull} IPlatformConfigFull */
/** @typedef {import('../index').SharedCache} SharedCache */
import * as commonUtilMod from './base/commonUtil';
import * as globalRef from './base/globalRef';
import * as inject from './base/inject';
import * as debugMod from './base/microDebug';
import { ensureHelMicroShared } from './base/microShared';
import * as consts from './consts';
import * as app from './data/app';
import * as common from './data/common';
import * as conf from './data/conf';
import * as custom from './data/custom';
import * as event from './data/event';
import * as lib from './data/lib';
import * as meta from './data/meta';
import * as status from './data/status';
import * as style from './data/style';
import * as version from './data/version';
import * as guess from './handle/guess';
import * as iso from './handle/iso';
import * as patch from './handle/patch';
import * as ready from './handle/ready';
import * as styleNode from './handle/styleNode';
import * as cacheWrap from './wrap/cache';

resetGlobalThis();
debugMod.log(`hel-micro-core ver ${consts.helConsts.CORE_VER}`);

export const { helEvents, helLoadStatus, helConsts } = consts;

export const { inectPlatToMod } = inject;

export const commonUtil = commonUtilMod;

export const { isSubApp } = iso;

export function resetGlobalThis(globalThis) {
  if (globalThis) {
    setGlobalThis(globalThis);
  }
  // 载入此包就尝试设置 masterApp 锁，以推断自己是不是父应用
  iso.tryMarkFlag(!!globalThis);
  // 确保 __HEL_MICRO_SHARED__ 存在
  ensureHelMicroShared();
  debugMod.ensureHelMicroDebug();
  patch.patchAppendChild();
  styleNode.obStyleTagInsert();
}

/**
 * 获取默认的平台值
 * @returns
 */
export const { getPlatform, getSharedCache } = cacheWrap;

export const { getHelMicroDebug: getHelDebug, allowLog, log } = debugMod;

export const { getGlobalThis, setGlobalThis } = globalRef;

// 应用Comp get set
export const { getVerApp, setEmitApp } = app;

// 应用lib get set
export const { getVerLib, setEmitLib } = lib;

// 应用元数据 get set
export const { getAppMeta, setAppMeta } = meta;

// 版本数据 get set
export const { getVersion, setVersion } = version;

// 应用相关的自定义数据 get set
export const { getCustomData, setCustomData } = custom;

// 通用的自定义数据 get set
export const { getCommonData, setCommonData, commonDataUtil } = common;

// 版本获取状态 get set，样式字符串获取状态 get set
export const { getVerLoadStatus, setVerLoadStatus, getVerStyleStrStatus, setVerStyleStrStatus } = status;

// 构建生成样式字符串 get set，sdk注入的额外样式列表 get set
export const { getAppStyleStr, setAppStyleStr, getVerExtraCssList, setVerExtraCssList } = style;

export const { tryGetVersion, tryGetAppName } = guess;

export const { getPlatformConfig, getAppPlatform, setAppPlatform, initPlatformConfig, originInit } = conf;

export const { getHelEventBus, getUserEventBus, evName } = event;

export const { libReady, appReady } = ready;
