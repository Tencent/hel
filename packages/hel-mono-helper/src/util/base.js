/** @typedef {import('hel-mono-types').IMonoDevInfo} IMonoDevInfo*/
const fs = require('fs');
const path = require('path');
const jsonc = require('jsonc-parser');
const { HEL_DIR_NAME, INNER_SUB_MOD_ORG, INNER_APP_ORG } = require('../consts');

/**
 * 获取 node 命令执行时所处目录，
 * 形如：/your/path/hel-mono/apps/hub
 */
exports.getCWD = function () {
  return process.cwd();
};

exports.getCWDPkgDir = function () {
  const cwd = exports.getCWD();
  const strList = cwd.split(path.sep);
  return strList[strList.length - 1];
};

exports.getCWDIsForRootHelDir = function () {
  const cwd = exports.getCWD();
  const strList = cwd.split(path.sep);
  const rootHelAppSeg = `${path.sep}${HEL_DIR_NAME}${path.sep}${INNER_APP_ORG}`;
  const rootHelSubModSeg = `${path.sep}${HEL_DIR_NAME}${path.sep}${INNER_SUB_MOD_ORG}`;
  return strList.includes(rootHelAppSeg) || strList.includes(rootHelSubModSeg);
};

/**
 * 读取文件 json 对象
 */
exports.getFileJson = function (standardJsonFilePath) {
  const str = fs.readFileSync(standardJsonFilePath, { encoding: 'utf-8' });
  const json = JSON.parse(str);
  return json;
};

exports.getDirName = function (appSrc) {
  const strList = appSrc.split(path.sep);
  return strList[strList.length - 2];
};

exports.getBelongTo = function (appSrc) {
  const strList = appSrc.split(path.sep);
  return strList[strList.length - 3];
};

exports.getTsConfigJson = function (appSrc) {
  const strList = appSrc.split(path.sep);
  const tsConfigJsonPath = path.join(strList.slice(0, strList.length - 1).join(path.sep), './tsconfig.json');
  let tsConfigJson = null;
  if (fs.existsSync(tsConfigJsonPath)) {
    const str = fs.readFileSync(tsConfigJsonPath, { encoding: 'utf-8' });
    tsConfigJson = jsonc.parse(str);
  }
  return tsConfigJson;
};

/**
 * 获取 tsconfig.json 里的 alias 别名，注：目前 hel-mono 架构暂支持对模块配置一个别名，故只会读取其中一个
 */
exports.getTsConfigAlias = function (appSrc) {
  let targetAlias = '';
  const tsConfigJson = exports.getTsConfigJson(appSrc);
  if (tsConfigJson) {
    const compilerOptions = tsConfigJson.compilerOptions || {};
    const paths = compilerOptions.paths || {};
    const key1 = Object.keys(paths)[0];
    if (key1) {
      const [mayAlias] = key1.split('/');
      if (mayAlias) {
        targetAlias = mayAlias;
      }
    }
  }
  return targetAlias;
};

/** 求两个数组的交集 */
exports.intersection = function (arr1, arr2) {
  return arr1.reduce((result, current) => {
    if (arr2.includes(current) && !result.includes(current)) {
      result.push(current);
    }
    return result;
  }, []);
};

exports.getPrefixedDirName = function (appSrc) {
  const strList = appSrc.split('/');
  const len = strList.length;
  return `${strList[len - 3]}/${strList[len - 2]}`;
};

exports.inferConfAlias = function (appSrc, appConf, pkgName) {
  // const alias = appConf?.alias;
  // 考虑兼容性，不用可选链
  const alias = (appConf || {}).alias || '';
  const tipLabel = `package ${pkgName}`;
  const tsConfigAlias = exports.getTsConfigAlias(appSrc);

  if (alias && !tsConfigAlias) {
    throw new Error(`${tipLabel} has alias ${alias} in dev-info, but has no alias in its tsconfig.json`);
  }

  if (alias && alias !== tsConfigAlias) {
    throw new Error(`${tipLabel}'s alias ${alias} in dev-info is not equal alias ${tsConfigAlias} in tsconfig.json`);
  }

  return alias || tsConfigAlias;
};

/**
 * 获得 alias 描述对象
 */
exports.getAppAlias = function (appSrc, /** @type IMonoDevInfo */ devInfo, prefixedDir2Pkg) {
  // 支持宿主和其他子模块 @/**/*, @xx/**/* 等能够正常工作
  const appAlias = {};
  const prefixedDirName = exports.getPrefixedDirName(appSrc);
  const packName = prefixedDir2Pkg[prefixedDirName];
  const targetAlias = exports.inferConfAlias(appSrc, devInfo.appConfs[packName], packName);
  if (targetAlias) {
    appAlias[targetAlias] = appSrc;
  }

  return appAlias;
};

exports.ensureSlash = function (inputPath, needsSlash) {
  const hasSlash = inputPath.endsWith('/');
  if (hasSlash && !needsSlash) {
    return inputPath.substr(0, inputPath.length - 1);
  }
  if (!hasSlash && needsSlash) {
    return `${inputPath}/`;
  }
  return inputPath;
};
