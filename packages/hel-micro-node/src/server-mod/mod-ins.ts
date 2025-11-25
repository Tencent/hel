import * as fs from 'fs';
import { INDEX_JS, MOD_INIT_VER } from '../base/mod-consts';
import { getDirFileList, getModPathData, resolveNodeModPath } from '../base/path-helper';
import type { IModIns, IWebFileInfo, OnFilesReady, OnFilesReadySync, PrepareFiles, PrepareFilesSync } from '../base/types';
import { downloadModFiles, getIsFilesReusable, getPrepareFilesParams } from './file-helper';
import { createLockFile, getLockFilePath, isLockFileValid, waitLockFileDeleted } from './lock-file';
import { safeUnlinkFile } from './util';

/**
 * 通过路径获取模块，
 * 如调用时 modPath 确信为完整路径，则无需设置 shouldResolve=true，
 * 如需要遵循 require 规则，则无需设置 allowNull=true，
 */
export function getModByPath(modPath: string, options?: { allowNull?: boolean; shouldResolve?: boolean }) {
  const { allowNull = false, shouldResolve = false } = options || {};
  try {
    if (!modPath && allowNull) {
      return null;
    }
    const path = shouldResolve ? resolveNodeModPath(modPath) : modPath;
    // TODO 将来的 node 版本里可使用 import.sync 替代
    // eslint-disable-next-line
    const mod = require(path);
    return mod;
  } catch (err: any) {
    if (!allowNull) {
      throw err;
    }
    return null;
  }
}

/**
 * 通过指定路径从本地获取模块实例
 */
export function getDiskModInsByInitPath(initPath: string, modVer = MOD_INIT_VER): IModIns {
  const mod = getModByPath(initPath);
  let modDirPath = initPath;
  let modRootDirPath = '';
  if (initPath.endsWith('.js')) {
    const list = initPath.split('/');
    const len = list.length;
    modDirPath = list.slice(0, len - 1).join('/');
    // 特殊情况时，根目录和带版本根目录是同一个目录
    modRootDirPath = modDirPath;
    if (len > 2) {
      modRootDirPath = list.slice(0, len - 1).join('/');
    }
  }

  return {
    mod,
    modPath: initPath,
    isMainMod: true,
    mainModPath: initPath,
    modRelPath: INDEX_JS,
    modDirPath,
    modRootDirPath,
    modVer,
    isInit: true,
  };
}

/**
 * 通过 webFile 信息从本地获取模块实例
 */
export function getDiskModIns(webFile: IWebFileInfo): IModIns {
  const { modPath, modDirPath, modRootDirPath, modVer, modRelPath, isMainMod, mainModPath } = getModPathData(webFile);
  // 传入正确的hel模块名但子路径错误，则这里会抛出 module not found 错误
  // 例如 xxx-hel-mod/unreached-path
  const mod = getModByPath(modPath);
  return { mod, modPath, modRelPath, isMainMod, mainModPath, modDirPath, modRootDirPath, modVer, isInit: false };
}

/**
 * 为来自 web 的模块准备相关文件
 */
export async function prepareWebModFiles(
  webFile: IWebFileInfo,
  options: { meta: any; prepareFiles?: PrepareFiles; onFilesReady?: OnFilesReady; reuseLocalFiles?: boolean },
) {
  const reuseLocalFiles = options.reuseLocalFiles ?? true;
  const modPathData = getModPathData(webFile);
  const { modDirPath, fileDownloadInfos } = modPathData;
  const { name } = webFile;

  // 不能复用本地文件 || 本地文件不可复用 || 是一个假meta，需要强制触发 prepareFiles
  if (!reuseLocalFiles || !getIsFilesReusable(fileDownloadInfos) || !webFile.webDirPath) {
    const lockFilePath = getLockFilePath(modDirPath);
    let isCurrentWorkerCreateLockFile = false;

    // 存在锁文件且锁文件有效时，等待创建此锁的 worker 实例下载模块文件完毕
    if (fs.existsSync(lockFilePath) && isLockFileValid(lockFilePath)) {
      await waitLockFileDeleted(lockFilePath);
    } else {
      // 创建新的锁文件
      createLockFile(lockFilePath);
      isCurrentWorkerCreateLockFile = true;
    }

    if (
      // 非当前 worker 创建锁文件时，执行到这里表示锁文件已释放，检查一下文件是否可复用即可
      (!isCurrentWorkerCreateLockFile && !getIsFilesReusable(fileDownloadInfos))
      // 是当前 worker 创建锁文件时，执行到这里即可开始直接下载模块文件列表
      || isCurrentWorkerCreateLockFile
    ) {
      const delLockFile = () => {
        if (isCurrentWorkerCreateLockFile) {
          safeUnlinkFile(lockFilePath);
        }
      };
      await downloadModFiles(
        fileDownloadInfos,
        // prettier-ignore
        { ...options, onSuccess: delLockFile, onFailed: delLockFile, modDirPath, name, webFile },
      );
    }
  }

  return modPathData;
}

/**
 * 从网络或用户自定义同步准备文件函数获取模块实例对象
 */
export async function getWebModIns(
  webFile: IWebFileInfo,
  options: { meta: any; prepareFiles?: PrepareFiles; onFilesReady?: OnFilesReady; reuseLocalFiles?: boolean },
): Promise<IModIns> {
  const modPathData = await prepareWebModFiles(webFile, options);
  const { modPath, modRelPath, isMainMod, mainModPath, modDirPath, modRootDirPath, modVer } = modPathData;
  const mod = getModByPath(modPath);
  return { mod, modPath, modRelPath, isMainMod, mainModPath, modDirPath, modRootDirPath, modVer, isInit: false };
}

/**
 * 通过用户自定义的同步准备文件的函数逻辑获取到模式实例对象，通常服务于本地测试之用
 */
export function getCustomModIns(webFile: IWebFileInfo, prepareFilesSync: PrepareFilesSync, onFilesReady?: OnFilesReadySync): IModIns {
  const { modPath, modRelPath, isMainMod, mainModPath, modDirPath, modRootDirPath, modVer, fileDownloadInfos } = getModPathData(webFile);
  const cbParams = getPrepareFilesParams(webFile.name, modDirPath, fileDownloadInfos);
  prepareFilesSync(cbParams);
  if (onFilesReady) {
    const files = getDirFileList(modDirPath);
    onFilesReady({ modDirPath, files, name: webFile.name });
  }

  const mod = getModByPath(modPath);
  return { mod, modPath, modRelPath, isMainMod, mainModPath, modDirPath, modRootDirPath, modVer, isInit: false };
}
