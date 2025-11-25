import doDownload from '@tmicro/fetch-file';
import * as fs from 'fs';
import * as fsExtra from 'fs-extra';
import * as path from 'path';
import { print } from '../base/logger';
import { DOWNLOAD_RETRY_LIMIT, HEL_META_JSON } from '../base/mod-consts';
import { getDirFileList } from '../base/path-helper';
import type { IFileDownloadInfo, IMeta, IPrepareFilesParams, IWebFileInfo, OnFilesReady, PrepareFiles } from '../base/types';

interface IDownloadModFilesOptions {
  onSuccess: () => void;
  onFailed: () => void;
  modDirPath: string;
  name: string;
  prepareFiles?: PrepareFiles;
  onFilesReady?: OnFilesReady;
  meta: IMeta;
  webFile: IWebFileInfo;
}

export async function downloadFile(fileWebPath: string, fileLocalPath: string) {
  const list = fileLocalPath.split('/');
  const [filename] = list.splice(list.length - 1, 1);
  const fileDir = list.join('/');
  await doDownload(fileWebPath, fileDir, { filename });
}

/**
 * 获取需要透传给 getPrepareFiles 函数参数列表的 params
 */
export function getPrepareFilesParams(name: string, modDirPath: string, fileInfos: IFileDownloadInfo[]) {
  const filePaths = fileInfos.map((v) => ({ fileLocalPath: path.join(v.fileDir, v.fileName), fileWebPath: v.url }));
  const writeIndexContent = (content: string) => {
    const indexFile = path.join(modDirPath, './index.js');
    fs.writeFileSync(indexFile, content, { encoding: 'utf8' });
  };

  const params: IPrepareFilesParams = { modDirPath, filePaths, name, downloadFile, writeIndexContent };
  return params;
}

/**
 * 下载模块对应的文件
 */
export async function downloadModFiles(fileInfos: IFileDownloadInfo[], options: IDownloadModFilesOptions, retryCount = 1) {
  // 首次执行，创建好相应目录
  if (retryCount === 1) {
    print(`start download ${options.webFile.webDirPath}`);
    const dirMarked: Record<string, boolean> = {};
    fileInfos.forEach(({ fileDir }) => {
      if (dirMarked[fileDir]) {
        return;
      }
      if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir, { recursive: true });
      }
      // 标识次目录以创建，降低 mkdirSync 调用频次
      dirMarked[fileDir] = true;
    });
  }

  try {
    const { prepareFiles, modDirPath, name, onSuccess, meta } = options;
    let hasMetaFile = false;
    // 用户自定义了准备文件的函数则走用户的，透传 modDir, fileDownloadInfos, name 相关参数给用户参考
    if (prepareFiles) {
      const params = getPrepareFilesParams(name, modDirPath, fileInfos);
      await Promise.resolve(prepareFiles(params));
    } else {
      // 来自 npm cdn 产物里可能已包含了这一版的 hel-meta
      await Promise.all(
        fileInfos.map(({ url, fileDir, fileName }) => {
          if (HEL_META_JSON === fileName && !hasMetaFile) {
            hasMetaFile = true;
          }
          return doDownload(url, fileDir, { filename: fileName });
        }),
      );
    }

    if (options.onFilesReady) {
      const files = getDirFileList(modDirPath);
      await Promise.resolve(options.onFilesReady({ modDirPath, files, name, meta }));
    }

    if (!hasMetaFile && meta) {
      const metaFilePath = path.join(modDirPath, HEL_META_JSON);
      fs.writeFileSync(metaFilePath, JSON.stringify(meta, null, 2));
    }

    onSuccess();
  } catch (err: any) {
    if (retryCount < DOWNLOAD_RETRY_LIMIT) {
      await downloadModFiles(fileInfos, options, retryCount + 1);
    } else {
      // 可能因为cdn服务问题导致下载失败，达到限制重试次数后，
      // 这里向上抛出的错误并不会影响宿主使用之前版本的模块，只会导致版本切换失败
      options.onFailed();
      throw err;
    }
  }
}

/**
 * 检查本地已下载文件数量是否对应，此逻辑可保证重启服务后不用重复下载文件
 */
export function getIsFilesReusable(fileDownloadInfos: IFileDownloadInfo[]) {
  let fileExistCount = 0;
  fileDownloadInfos.forEach(({ fileDir, fileName }) => {
    if (fs.existsSync(path.join(fileDir, fileName))) {
      fileExistCount += 1;
    }
  });
  const isFilesReusable = fileExistCount === fileDownloadInfos.length;
  return isFilesReusable;
}

export function delFileOrDir(fileOrDirPath: string, options?: { onSuccess?: () => void; onFail?: (err: Error) => void }) {
  try {
    // cluster模式下，可能另一个worker已经删了这个版本，这里提前判断一下
    if (fs.existsSync(fileOrDirPath)) {
      fs.rmSync(fileOrDirPath, { recursive: true, force: true });
      options?.onSuccess?.();
    }
  } catch (err: any) {
    // 上面有 existsSync 判断加上 force=true 标记，正常情况不会跑到这里
    options?.onFail?.(err);
  }
}

export function cpSync(fromDirPath: string, toDirPath: string) {
  fsExtra.copySync(fromDirPath, toDirPath);
  // fs.cpSync 在 node 16 以后才提供，故此处使用 fsExtra
  // cpSync(fromDirPath, toDirPath, { recursive: true, force: true });
}
