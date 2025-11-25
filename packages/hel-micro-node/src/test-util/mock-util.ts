import * as path from 'path';
import { PLATFORM, SERVER_INFO } from '../base/consts';
import { getModRootDirName, getModRootDirPath } from '../base/path-helper';
import type { IMeta } from '../base/types';
import { cpSync, delFileOrDir } from '../server-mod/file-helper';
import { clearSubDict, ensureDict, readFileContent, saveDict } from './mock-util-inner';

// 以下文件服务于 cluster 模式下为 mock 流程记录相关数据
const verSeedFile = path.join(__dirname, './verSeedDict.json');
const verSeedExpireDictFile = path.join(__dirname, './verSeedExpireDict.json');
const verSeedHandledDictFile = path.join(__dirname, './verSeedHandledDict.json');
const metaDictFile = path.join(__dirname, './metaDict.json');
const modDirPathDictFile = path.join(__dirname, './modDirPathDict.json');
const mockUtilMetaFile = path.join(__dirname, './mockUtilMeta.json');
const clearCDMs = 5000;
const verSeedExpireMs = 30000;

export { readFileContent, cpSync };

export function getVerSeedExpire(helModName: string) {
  const dict = ensureDict(verSeedExpireDictFile);
  return dict[helModName] || verSeedExpireMs;
}

export function setVerSeedExpire(helModName: string, expireMs: number) {
  const dict = ensureDict(verSeedExpireDictFile);
  dict[helModName] = expireMs;
  saveDict(verSeedFile, dict);
}

export function clearVerSeed(helModName: string) {
  const dict = ensureDict(verSeedFile);
  dict[helModName] = { seed: 0, time: Date.now() };
  saveDict(verSeedFile, dict);
}

/**
 * 获取版本种子，mockInterval毫秒内重复调用则返回相同种子数，反之则加1后返回
 */
export function getVerSeed(helModName: string) {
  const dict = ensureDict(verSeedFile);
  const result = dict[helModName];
  if (!result?.seed) {
    dict[helModName] = { seed: 1, time: Date.now() };
    saveDict(verSeedFile, dict);
    return 1;
  }

  const now = Date.now();
  const expireMs = getVerSeedExpire(helModName);
  if (now - result.time < expireMs) {
    return result.seed;
  }

  const nextSeed = result.seed + 1;
  dict[helModName] = { seed: nextSeed, time: Date.now() };
  saveDict(verSeedFile, dict);

  return nextSeed;
}

export function getMetaDict(): Record<string, IMeta | null> {
  return ensureDict(metaDictFile);
}

export function saveMetaDict(metaDict: Record<string, IMeta | null>) {
  saveDict(metaDictFile, metaDict);
}

export function getCacheMeta(helModName: string) {
  const metaDict = getMetaDict();
  return metaDict[helModName] || null;
}

export function setCacheMeta(helModName: string, meta: IMeta | null) {
  const metaDict = getMetaDict();
  metaDict[helModName] = meta;
  saveMetaDict(metaDict);
}

export function getFirstVerModDirPath(helModName: string): '' {
  const dict = ensureDict(modDirPathDictFile);
  return dict[helModName] || '';
}

export function setFirstVerModDirPath(helModName: string, path: string) {
  const dict = ensureDict(modDirPathDictFile);
  dict[helModName] = path;
  saveDict(modDirPathDictFile, dict);
}

export function getServerInfo() {
  return SERVER_INFO;
}

export function getIsHandled(helModName: string, verSeed: number) {
  const dict = ensureDict(verSeedHandledDictFile);
  if (!dict[helModName]) {
    dict[helModName] = {};
  }
  const subDict = dict[helModName];
  return subDict[verSeed] || false;
}

export function setIsHandled(helModName: string, verSeed: number, isHandle: boolean) {
  const dict = ensureDict(verSeedHandledDictFile);
  if (!dict[helModName]) {
    dict[helModName] = {};
  }
  const subDict = dict[helModName];
  subDict[verSeed] = isHandle;
  saveDict(verSeedHandledDictFile, dict);
}

export function getCanClear() {
  const rawData = ensureDict(mockUtilMetaFile);
  const defaultMeta = { time: 0 };
  const data = Object.assign(defaultMeta, rawData);
  const now = Date.now();
  if (now - data.time < clearCDMs) {
    return false;
  }

  data.time = now;
  saveDict(mockUtilMetaFile, data);
  return true;
}

export function clearData(helModName: string, mockInterval: number, platform = PLATFORM) {
  const canClear = getCanClear();
  if (!canClear) {
    return;
  }

  const modRootDirName = getModRootDirName(helModName, platform);
  const modRootDirPath = getModRootDirPath(modRootDirName);
  delFileOrDir(modRootDirPath);

  setVerSeedExpire(helModName, mockInterval);
  clearVerSeed(helModName);
  setFirstVerModDirPath(helModName, '');
  setCacheMeta(helModName, null);
  clearSubDict(verSeedHandledDictFile, helModName);
}
