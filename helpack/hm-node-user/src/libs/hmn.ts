import * as hmn from 'hel-micro-node';
import * as hmnWrap from './hmnWrap';

const hmnLib = process.env.FOR_HELPACK === '1' ? hmnWrap : hmn;

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
