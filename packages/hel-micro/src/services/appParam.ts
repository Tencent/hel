/**
 * 参数相关服务
 */
import * as core from 'hel-micro-core';
import { getPlatform } from '../shared/platform';
import type { IGetOptionsLoose, IGroupedStyleList, IPlatAndVer } from '../types';
import * as share from './share';

/**
 * 推导当前应用的平台与版本
 * 调用者需自己确保版本数据已获取，即 preFetchApp 或 preFetchLib 已调用结束
 */
export function getPlatAndVer(appName: string, options?: IGetOptionsLoose): IPlatAndVer {
  const optionsVar = options || {};
  const platform = getPlatform(optionsVar.platform);
  let versionId = optionsVar.versionId || '';
  if (!versionId) {
    const versionData = core.getVersion(appName, { platform });
    if (versionData) {
      // 已存在了正在运行的版本数据
      versionId = versionData.sub_app_version;
    } else {
      const appMeta = core.getAppMeta(appName, platform);
      versionId = appMeta?.online_version || appMeta?.build_version || '';
    }
  }

  return {
    platform,
    versionId,
  };
}

export function getGroupedStyleList(appName: string, options?: IGetOptionsLoose): IGroupedStyleList {
  const map: IGroupedStyleList = {
    static: [],
    build: [],
  };
  const version = core.getVersion(appName, options);
  if (version) {
    const { webDirPath, chunkCssSrcList } = version.src_map;
    chunkCssSrcList.forEach((src) => {
      src.startsWith(webDirPath) ? map.build.push(src) : map.static.push(src);
    });
  }
  return map;
}

export const getWebDirPath = share.getWebDirPath;
