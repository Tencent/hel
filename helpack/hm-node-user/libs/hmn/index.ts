import * as modImpl from './impl';
import modType from './types/index';

const typedMod = modImpl as typeof modType;

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
} = typedMod;

export default typedMod;
