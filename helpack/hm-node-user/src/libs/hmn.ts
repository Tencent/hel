/**
 * 这里为了演示功能，引入了一个原始库，和一个二次封装的库，然后根据运行环境导出其中一个
 * 真实环境全局使用一个即可（如部署了私有 helpack，推荐二次封装发布一个内部专用的 hel-micro-node 包）
 */
import * as hmn from 'hel-micro-node';
import * as hmnWrap from './hmnWrap';

const hmnLib = process.env.CONNECT_LOCAL_HELPACK === '1' ? hmnWrap : hmn;

// 导出的 api，只要可携带 platform 参数的调用，未指定的话默认都是 registerPlatform 预设的那个值
export const {
  mapNodeMods,
  mapAndPreload,
  preloadMappedData,
  initMiddleware,
  preloadMiddleware,
  setGlobalConfig,
  setPlatformConfig,
  recordMemLog,
  getMemLogs,
  downloadFile,
  getHelModMeta,
  getHelModulesPath,
  getNodeModDesc,
  getNodeModVer,
  importNodeMod,
  importNodeModByMeta,
  importNodeModByMetaSync,
  importNodeModByPath,
  downloadNodeModFiles,
  requireNodeMod,
  resolveNodeMod,
  getFallbackMod,
  importHelMod,
  importHelModByMeta,
  importHelModByMetaSync,
  importHelModByPath,
  downloadHelModFiles,
  mockAutoDownload,
  mockUtil,
  registerPlatform,
} = hmnLib;
