import * as fs from 'fs';
import { PLATFORM, SERVER_INFO } from '../base/consts';
import { print } from '../base/logger';
import { getDirFileList } from '../base/path-helper';
import type { IMeta, IMockAutoDownloadOptions } from '../base/types';
import { clone } from '../base/util';
import { cpSync } from '../server-mod/file-helper';
import { mapNodeModsManager } from '../server-mod/map-node-mods';
import { modManager } from '../server-mod/mod-manager';
import { fetchModMeta } from '../server-mod/mod-meta';
import {
  clearData,
  getCacheMeta,
  getFirstVerModDirPath,
  getIsHandled,
  getVerSeed,
  setCacheMeta,
  setFirstVerModDirPath,
  setIsHandled,
} from './mock-util';

const mockInterval = 100000;

function replaceMetaVer(verSeed: number, meta: IMeta): IMeta {
  const newMeta = clone(meta);
  const { version } = newMeta;
  const { src_map: srcMap, sub_app_version: curVer } = version;
  const { srvModSrcList = [] } = srcMap;
  const ver = `${curVer}_${verSeed}`;
  version.sub_app_version = ver;

  // 将线上可用版本复制为一个本地新版本
  srvModSrcList.forEach((v, idx) => (srvModSrcList[idx] = v.replace(curVer, ver)));
  srcMap.webDirPath = srcMap.webDirPath.replace(curVer, ver);
  srcMap.srvModSrcIndex = (srcMap.srvModSrcIndex || '').replace(curVer, ver);
  return newMeta;
}

function recordFirstVerModDirPath(helModName: string, modDirPath: string) {
  const firstVerModDirPath = getFirstVerModDirPath(helModName);
  if (!firstVerModDirPath) {
    const bakDirPathOfMock = `${modDirPath}_bak`;
    cpSync(modDirPath, bakDirPathOfMock);
    setFirstVerModDirPath(helModName, bakDirPathOfMock);
  }
}

/**
 * 替换版本号，然后把本地文件复制到新版本号目录来模拟下载过程
 */
async function copyFilesToNewVerModDir(nodeModName: string, options?: IMockAutoDownloadOptions): Promise<null | Error> {
  const { helModName } = mapNodeModsManager.getNodeModData(nodeModName, false);
  const { platform = PLATFORM } = options || {};
  const modDesc = modManager.getModDesc(helModName);
  // 还没有激活的模块，退出逻辑
  if (!modDesc.modPath) {
    return null;
  }
  const verSeed = getVerSeed(helModName);
  if (verSeed === 1) {
    recordFirstVerModDirPath(helModName, modDesc.modDirPath);
  }

  const prepareFiles =
    options?.prepareFiles
    || ((params) => {
      if (!fs.existsSync(params.modDirPath)) {
        fs.mkdirSync(params.modDirPath);
      }
      const files = getDirFileList(params.modDirPath);
      // 可能另一个 worker 已复制，这里判断一下，小于 2 是因为可能存在一个 hel-download-lock.json 文件
      if (files.length < 2) {
        const modDirPath = getFirstVerModDirPath(helModName);
        cpSync(modDirPath, params.modDirPath);
      }
    });

  try {
    let meta = getCacheMeta(helModName);
    if (!meta) {
      meta = await fetchModMeta(helModName, { platform });
      setCacheMeta(helModName, meta);
    }
    meta = replaceMetaVer(verSeed, meta);

    // 复制当前激活版本的文件到新版本目录下，触发导出新版本模块流程
    await modManager.importModByMeta(meta, {
      prepareFiles,
      onFilesReady: (params) => {
        const curVer = getVerSeed(helModName);
        const isHandled = getIsHandled(helModName, curVer);
        if (isHandled) {
          return;
        }
        setIsHandled(helModName, curVer, true);
        options?.onFilesReady?.(params);
      },
      reuseLocalFiles: false,
      standalone: false,
    });
    return null;
  } catch (err: any) {
    // 这是测试函数，仅需返回错误即可
    print(`wid:${SERVER_INFO.workerId}`, err);
    return err;
  }
}

/**
 * 创建自动下载任务，并同时返回一个清除自动任务的句柄
 */
export function mockAutoDownload(helModName: string, options?: IMockAutoDownloadOptions) {
  const intervalMs = options?.intervalMs || mockInterval;
  clearData(helModName, mockInterval, options?.platform);
  const timerId = setInterval(() => {
    copyFilesToNewVerModDir(helModName, options);
  }, intervalMs);
  const clearAutoTask = () => clearInterval(timerId);
  return clearAutoTask;
}
