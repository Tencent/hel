import * as fs from 'fs';
import * as path from 'path';
import { IMeta, importNodeModByMetaSync, mockUtil } from '../../src';
import { cloneJson, loadJson } from '../util';
import { BACKUP_DATA_FILE, DATA_DIR, HEL_HELLO_HELPACK } from '../util/consts';

const backupData = loadJson<Record<string, IMeta>>('backup-data.json');

export function getPathDir(path: string) {
  let dirPath = path;
  if (path.endsWith('.js')) {
    const list = path.split('/');
    const newList = list.slice(0, list.length - 1);
    dirPath = newList.join('/');
  }
  return dirPath;
}

/**
 * 递归获得某个目录下的所有文件绝对路径
 */
export function getAllFilePath(dirPath: string, filePathList: string[] = []) {
  const names = fs.readdirSync(dirPath);
  names.forEach((name) => {
    const stats = fs.statSync(`${dirPath}/${name}`);
    if (stats.isDirectory()) {
      getAllFilePath(`${dirPath}/${name}`, filePathList);
    } else {
      filePathList.push(`${dirPath}/${name}`);
    }
  });
  return filePathList;
}

/**
 * 获取 test/data 目录下的模块根目录路径
 */
export function getDataModRootDir(relPath: string) {
  return path.join(DATA_DIR, relPath);
}

export function getDataModMeta(helModName: string) {
  const helMeta = backupData[helModName];
  if (!helMeta) {
    throw new Error(`No hel meta of ${helModName} in ${BACKUP_DATA_FILE}`);
  }
  return helMeta;
}

/**
 * 依据 test/data 目录下的一级子目录名称作为输入参数，创建对应的 hel 模块元数据
 */
export function buildModMeta(newVer: string, indexFileRelPath = '/index.js') {
  const metaExample = getDataModMeta(HEL_HELLO_HELPACK);
  const newMeta: IMeta = cloneJson(metaExample);
  newMeta.version.create_at = new Date().toISOString();
  const modDir = getDataModRootDir(newVer);
  if (!fs.existsSync(modDir)) {
    throw new Error(`${modDir} not exist`);
  }

  // 取一个 hel 模块元数据样本，结合本地文件读取的数据造一个新的元数据
  const { src_map: srcMap, sub_app_version: curVer } = newMeta.version;
  newMeta.version.sub_app_version = newVer;

  // 对应 hel 模块带版本号的web根路径
  const webDir = srcMap.webDirPath.replace(curVer, newVer);
  srcMap.webDirPath = webDir;

  // 读取本地文件列表，映射为 hel 模块的网络文件路径
  const fileList = getAllFilePath(modDir);
  const webFileList: string[] = [];
  let webIndexFile = '';
  fileList.forEach((v) => {
    const webFile = v.replace(modDir, webDir);
    webFileList.push(webFile);
    if (webFile.endsWith(indexFileRelPath)) {
      webIndexFile = webFile;
    }
  });

  if (!webIndexFile) {
    throw new Error(`hel mod index file not found for ${indexFileRelPath}`);
  }

  srcMap.srvModSrcList = webFileList;
  srcMap.srvModSrcIndex = webIndexFile;

  return newMeta;
}

/**
 * 更新模块为指定新版本，使用本地预设好的文件做替换
 * 此处的 newVer 参数即
 */
export function updateModTo(nodeModName: string, newVer: string) {
  // 替换为新版本模块 /test/data 下的一级子目录名称
  const modMeta = buildModMeta(newVer);
  const modV2DirPath = getDataModRootDir(newVer);
  importNodeModByMetaSync(nodeModName, modMeta, {
    prepareFiles: (params) => {
      mockUtil.cpSync(modV2DirPath, params.modDirPath);
    },
  });
}
