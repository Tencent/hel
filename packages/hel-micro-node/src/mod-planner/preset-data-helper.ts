import { recordMemLog, type ILogOptions } from '../base/mem-logger';
import type { IModInfo } from '../base/types';
import { getModDerivedConf } from '../context/facade';

export function log(options: Omit<ILogOptions, 'type'>) {
  recordMemLog({ ...options, type: 'PresetData' });
}

export function hasServerModFile(modInfo: IModInfo) {
  const { srvModSrcList = [] } = modInfo.meta.version.src_map;
  return srvModSrcList.length > 0;
}

/**
 * 检查元数据里 server 模块对应文件
 */
export function checkServerModFile(modInfo: IModInfo, options: { mustBeServerMod?: boolean; label: string }) {
  const { mustBeServerMod, label } = options;
  if (!hasServerModFile(modInfo)) {
    log({ subType: label, desc: 'no srvModSrcList' });
    if (mustBeServerMod) {
      throw new Error(`no server mod files for ${modInfo.name}`);
    }
    return false;
  }

  return true;
}

/**
 * 更新访问页面的资源描述对象，此更新规则仅适用于前端多页打包且产物入口文件名称和业务模块名称一致的情况，
 * 中间件里可获取到此数据供参考
 */
export function updatePageAssetCache(modInfo: IModInfo) {
  const { src_map: srcMap, sub_app_name: curAppName } = modInfo.meta.version;
  const { chunkCssSrcList, chunkJsSrcList } = srcMap;
  const { viewAssetCache, entryAssetCache } = this;
  const { assetNameInfos, assetName2view } = getModDerivedConf();

  assetNameInfos.forEach((nameInfo) => {
    const { appName, entryName, name } = nameInfo;
    if (curAppName === appName) {
      const css = chunkCssSrcList.find((src) => src.includes(`/${entryName}.css`)) || '';
      const js = chunkJsSrcList.find((src) => src.includes(`/${entryName}.js`)) || '';
      viewAssetCache[assetName2view[name]] = { js, css };
      entryAssetCache[name] = { js, css };
    }
  });
}
