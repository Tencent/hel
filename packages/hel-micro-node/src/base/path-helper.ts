import * as fs from 'fs';
import * as path from 'path';
import { getGlobalConfig } from '../context/global-config';
import { PLATFORM, SDK_PKG_ROOT } from './consts';
import { DOT_HEL_LOG_DIR, DOT_HEL_MODULES, DOT_PROXY_DIR, HEL_DIST, INDEX_JS, MOD_FILES_PATH, NODE_MODULES } from './mod-consts';
import type { IFileDownloadInfo, IGetModRootDirDataOptions, IWebFileInfo } from './types';
import { lastNItem } from './util';

const lockedDirPath = {
  helModules: '',
  proxyFiles: '',
  helLogFiles: '',
};

/**
 * 获取 sdk 所属的 node_modules 下的 .hel_modules 目录名
 */
function getDotHelModulesPath() {
  const list = SDK_PKG_ROOT.split(path.sep);
  const lastIdx = list.length - 1;
  let nodeModulesIdx = -1;
  // 往上查找的过程中发现的第一个在旁边存在的 node_modules 目录
  // 例如 /path/to/test/hel-micro-node 可能有一个 /path/to/node_modules 存在
  let firstSideNodeModulesPath = '';

  for (let idx = lastIdx; idx >= 0; idx--) {
    const name = list[idx];
    if (NODE_MODULES === name) {
      nodeModulesIdx = idx;
      break;
    }
    if (!firstSideNodeModulesPath) {
      const curList = list.slice(0, idx);
      curList.push(NODE_MODULES);
      const curPath = curList.join(path.sep);
      // 在往上查找的过程中发现旁边
      if (fs.existsSync(curPath)) {
        firstSideNodeModulesPath = curPath;
      }
    }
  }

  // node_modules 目录路径
  let nodeModulesPath = '';
  // 优先采用向上查找过程中自己所属的 node_modules 目录
  if (nodeModulesIdx >= 0) {
    // 注意此处需要刻意 +1，才能让 slice 的末尾包含 node_names
    nodeModulesPath = list.slice(0, nodeModulesIdx + 1).join(path.sep);
  } else {
    nodeModulesPath = firstSideNodeModulesPath;
  }
  const dotHelModulesPath = nodeModulesPath ? path.join(nodeModulesPath, DOT_HEL_MODULES) : '';

  return dotHelModulesPath;
}

function writeHelModulesReadmeContent(helModulesDirPath: string) {
  const readmeFile = path.join(helModulesDirPath, './README.txt');
  const starMe = 'star it(https://github.com/Tencent/hel) if you like our open source works.';
  let hint = `Thank you for using hel-micro-node sdk ^_^, ${starMe}\n`;
  hint += 'Hel-micro-node will use below directory to store downloaded files!\n';
  hint += `${helModulesDirPath}\n`;
  fs.writeFileSync(readmeFile, hint, { encoding: 'utf8' });
}

function ensureDirExist(dirPath: string, afterDirMake?: () => void) {
  if (fs.existsSync(dirPath)) {
    return;
  }
  fs.mkdirSync(dirPath, { recursive: true });
  afterDirMake?.();
}

export function resolveNodeModPath(nodeModNameOrPath: string, allowNull?: boolean): string {
  try {
    return require.resolve(nodeModNameOrPath);
  } catch (err) {
    if (allowNull) {
      return '';
    }
    throw err;
  }
}

/**
 * 获取 sdk 当前运行时去读取 hel 模块的目录路径
 */
export function getHelModulesPath() {
  let dirPath = lockedDirPath.helModules;
  if (dirPath) {
    return dirPath;
  }

  // 一旦有文件在hel模块目录下载，就会忽略用户的 helModulesDir 设定值
  // 故该参数需要尽可能的早（ 通常可在应用程序的入口处设置 ）的通过 setGlobalConfig 设置
  dirPath = getGlobalConfig().helModulesDir || getDotHelModulesPath() || MOD_FILES_PATH;
  lockedDirPath.helModules = dirPath;
  ensureDirExist(dirPath, () => writeHelModulesReadmeContent(dirPath));

  return dirPath;
}

/**
 * 递归获得某个目录下的所有文件绝对路径
 */
export function getDirFileList(dirPath, filePathList: string[] = []) {
  const names = fs.readdirSync(dirPath);
  names.forEach((name) => {
    const maySubDirPath = `${dirPath}/${name}`;
    const stats = fs.statSync(maySubDirPath);
    if (stats.isDirectory()) {
      getDirFileList(maySubDirPath, filePathList);
    } else {
      filePathList.push(maySubDirPath);
    }
  });

  return filePathList;
}

/**
 * 获取 hel 代理文件存放目录，如需修改，需尽早应用程序的入口处设置才能生效
 */
export function getHelProxyFilesDir() {
  let dirPath = lockedDirPath.proxyFiles;
  if (dirPath) {
    return dirPath;
  }
  dirPath = getGlobalConfig().helProxyFilesDir || path.join(getHelModulesPath(), `./${DOT_PROXY_DIR}`);
  lockedDirPath.proxyFiles = dirPath;
  ensureDirExist(dirPath);

  return dirPath;
}

/**
 * 获取 hel 运行日志存放目录，如需修改，需尽早应用程序的入口处设置才能生效
 */
export function getHelLogFilesDir() {
  let dirPath = lockedDirPath.helLogFiles;
  if (dirPath) {
    return dirPath;
  }
  dirPath = getGlobalConfig().helLogFilesDir || path.join(getHelModulesPath(), `./${DOT_HEL_LOG_DIR}`);
  lockedDirPath.helLogFiles = dirPath;
  ensureDirExist(dirPath);

  return dirPath;
}

/**
 * 获取hel模块根目录名称
 */
export function getModRootDirName(helModName: string, platform = PLATFORM) {
  const prefix = platform !== PLATFORM ? `${platform}+` : '';
  if (helModName.startsWith('@')) {
    const [scope, name] = helModName.split('/');
    return `${prefix}${scope}+${name}`;
  }

  return `${prefix}${helModName}`;
}

/**
 * 默认逻辑是：
 * 来自类 helpack 平台则生成 hel+xx-mod 、hel+xx-scope@xx-mod，your-hel+xx-mod，your-hel+xx-scope@xx-mod，子目录版本则是时间戳，
 * 非类 helpack 平台则生成 xxx-mod、xx-scope@xx-mod，子目录则是 npm 版本号
 */
export function getModRootDirData(params: IGetModRootDirDataOptions) {
  const {
    meta: { app, version },
    webDirPath,
  } = params;
  const platform = params.platform || app.platform || PLATFORM;
  const { name } = app;
  const modRootDirName = getModRootDirName(name, platform);

  /** 由 skipMeta=true 导致透传的假meta */
  if (!webDirPath) {
    return { modRootDirName, modVer: version.sub_app_version };
  }

  // 关于 webDirPath
  // 对于普通的 unpkg 或 jsdelivr 等 npm 公共 cdn 同步后的 meta 产物
  // https://unpkg.com/hel-tpl-remote-vue3-comps-ts@1.4.0/hel_dist/hel-meta.json
  // https://cdn.jsdelivr.net/npm/hel-tpl-remote-vue3-comps-ts@1.4.0/hel_dist/hel-meta.json
  // webDirPath 为 https://unpkg.com/hel-tpl-remote-vue3-comps-ts@1.4.0/hel_dist
  //
  // 带组织名称的 unpkg 的 meta 产物
  // 假设 https://unpkg.com/@helux/f-noop 有 https://unpkg.com/@helux/f-noop@0.0.1/hel_dist/hel-meta.json
  // webDirPath 为 https://unpkg.com/@helux/f-noop@0.0.1/hel_dist
  //
  // helpack 的 meta 产物
  // https://helmicro.com/openapi/v1/app/info/getSubAppAndItsVersion?name=remote-react-comps-tpl
  // webDirPath 可能为
  // https://tnfe.gtimg.com/hel/remote-react-comps-tpl_20241228190308
  // https://tnfe.gtimg.com/hel/@my/remote-react-comps-tpl_20241228190308
  // https://tnfe.gtimg.com/hel/@my/remote-react-comps-tpl@1.1.1
  const strList = webDirPath.split('/');

  // 形如：remote-react-comps-tpl_20241228190308 hel-tpl-remote-vue3-comps-ts@1.4.0 mod-v1
  let modNameAndVer = lastNItem(strList);
  if (HEL_DIST === modNameAndVer) {
    // 兼容类似 https://tnfe.gtimg.com/hel/remote-react-comps-tpl_20241228190308/hel_dist 存储规则
    modNameAndVer = lastNItem(strList, 2);
  }
  let modVer = '';
  if (!modNameAndVer.includes(name)) {
    // 来自测试数据的不规则版本字符串 mod-v1
    modVer = modNameAndVer;
  } else {
    // _20241228190308 @1.1.1
    const [, ver] = modNameAndVer.split(name);
    const hasDelimiter = ver.startsWith('_') || ver.startsWith('@');
    modVer = hasDelimiter ? ver.substring(1) : ver;
  }

  // modVer 最终指向 xxx@ver 里的 ver
  if (modVer.includes('@')) {
    const [, ver] = modVer.split('@');
    modVer = ver;
  }

  return { modRootDirName, modVer };
}

/**
 * 根据网路根目录和对应文件网络url，提取出带相对路径的目录名称，文件名称
 * @example
 * input:
 *   'https://mat1.gtimg.com/x/y/z/qqnews-pc-dc-test_20250418080738'
 *   'https://mat1.gtimg.com/x/y/z/qqnews-pc-dc-test_20250418080738/srv/static/js/static.js'
 * output:
 *   {relativeDir: 'srv/static/js', fileName: 'static.js', ...}
 *
 * input:
 *   'https://mat1.gtimg.com/x/y/z/qqnews-pc-dc-test_20250418080738'
 *   'https://mat1.gtimg.com/x/y/z/qqnews-pc-dc-test_20250418080738/xx/yy-js/static.js'
 * output:
 *   {relativeDir: 'xx/yy-js', fileName: 'static.js', ...}
 */
export function getFilePathData(webDirPath: string, url: string) {
  let [, relativePathName = ''] = url.split(webDirPath);
  relativePathName = relativePathName.substring(1);
  const list = relativePathName.split('/');
  const len = list.length;
  const fileName = list[len - 1];
  if (len === 1) {
    return { relativeDir: '', fileName, fileRelPath: INDEX_JS };
  }

  const dirNames = list.slice(0, len - 1);
  const relativeDir = dirNames.join('/');
  return { relativeDir, fileName, fileRelPath: `${relativeDir}/${fileName}` };
}

/**
 * hel模块在 helModules 下的根目录路径
 */
export function getModRootDirPath(modRootDirName: string) {
  const helModulesPath = getHelModulesPath();
  const modRootDirPath = path.join(helModulesPath, `./${modRootDirName}`);
  return modRootDirPath;
}

/**
 * 通过网路路径描述对象获取模块路径数据
 */
export function getModPathData(webFile: IWebFileInfo) {
  const { urls, webDirPath, indexUrl, relPath, name, modRootDirName, modVer } = webFile;
  const modRootDirPath = getModRootDirPath(modRootDirName);
  // 当前这一版本的文件需要放置到此目录
  const modDirPath = path.join(modRootDirPath, `./${modVer}`);
  if (!fs.existsSync(modDirPath)) {
    fs.mkdirSync(modDirPath, { recursive: true });
  }

  if (!urls.length) {
    throw new Error(`No files for ${name}`);
  }

  const fileDownloadInfos: IFileDownloadInfo[] = [];
  const oneUrl = urls[0];
  // 标识导出的是默认导出模块
  const isMainMod = relPath === INDEX_JS;

  // 需要激活的模块路径
  let modPath = '';
  let modRelPath = '';
  // 推导出的主模块路径
  let mainModPath = '';

  if (indexUrl && !urls.includes(indexUrl)) {
    throw new Error(`${indexUrl} is not in (${urls})`);
  }

  if (urls.length === 1) {
    // 开始推测默认导出模块
    const { relativeDir, fileName, fileRelPath } = getFilePathData(webDirPath, oneUrl);
    fileDownloadInfos.push({ url: oneUrl, fileDir: path.join(modDirPath, relativeDir), fileName });
    if (!isMainMod && relPath !== fileRelPath) {
      // 用户指定了具体的路径，例如 some-mod/some-path
      // 转为 relPath 是 some-mod/some-path/index.js
      // 运行到这里 relPath 和 fileRelPath 匹配不上
      throw new Error(`No server mod entry file for ${relPath}`);
    }
    // 未指定路径，或指定的路径能匹配上，在这里都当做是默认导出
    modPath = path.join(modDirPath, fileRelPath);
    modRelPath = INDEX_JS;
    mainModPath = modPath;
  } else {
    for (const url of urls) {
      const { relativeDir, fileName, fileRelPath } = getFilePathData(webDirPath, url);
      const tmpModPath = path.join(modDirPath, fileRelPath);
      const isMainModUrl = indexUrl === url;

      if ((isMainMod && isMainModUrl) || (!isMainMod && fileRelPath === relPath)) {
        modPath = tmpModPath;
        modRelPath = fileRelPath;
      }
      if (isMainModUrl) {
        mainModPath = tmpModPath;
      }

      fileDownloadInfos.push({ url, fileDir: path.join(modDirPath, relativeDir), fileName });
    }
    if (!modRelPath) {
      throw new Error(`No server mod entry file for ${name}/${relPath}`);
    }
  }

  return { modPath, modRelPath, isMainMod, mainModPath, modDirPath, modRootDirPath, modVer, fileDownloadInfos };
}
