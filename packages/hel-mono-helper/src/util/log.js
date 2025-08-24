const path = require('path');
const os = require('os');
const fs = require('fs');
const chalk = require('chalk');
const { LOG_PREFIX, LOG_PREFIX_TMP } = require('../consts');
const { lastItem, lastNItem } = require('./arr');
const { inferDevInfo } = require('./devInfo');
const { inferDirFromDevInfo } = require('./monoDir');
const { getMonoRootInfo } = require('./rootInfo');
const { getLogTimeLine } = require('./time');

/** @type {import('../types').ICWDAppData} 正在运行中应用数据 */
let curAppData = null;
const cachedPaths = {};

let curLogName = '';

/**
 * 记录 keyword，辅助日志路径定位
 */
function trySetLogName(keyword, shouldPure = true) {
  if (keyword.startsWith('.')) {
    return false;
  }

  // 是 /xxx/yy/.bin/node, /xx/yy/dev/execStart 等完整路径关键字
  const strList = keyword.split(path.sep);
  if (strList.length > 2) {
    return false;
  }

  if (shouldPure) {
    const [dirOrPkgName] = keyword.split(':');
    curLogName = dirOrPkgName;
    return true;
  }

  curLogName = keyword;
  return true;
}

/**
 *
 * @returns 获取已缓存的运行中的应用目录数据
 */
function getCurAppData() {
  return curAppData;
}

function setCurAppData(data) {
  curAppData = data;
}

function getLogPathByName(logName, isTmp) {
  const { monoRootHelDir } = getMonoRootInfo();
  if (!curLogName) {
    curLogName = logName;
  }
  const cachedPath = cachedPaths[logName];
  if (cachedPath) {
    return cachedPath;
  }

  // 可能是目录或scope的关键字，例如 @tencent/xxx packages/xxx
  if (logName.includes('/')) {
    // 暂只考虑两层目录的关键字
    const [logDir] = logName.split('/');
    const logFullDir = path.join(monoRootHelDir, logDir);
    if (!fs.existsSync(logFullDir)) {
      fs.mkdirSync(logFullDir);
    }
  }

  const joinSeg = isTmp ? `./${logName}.tmp.log` : `./${logName}.log`;
  return path.join(monoRootHelDir, joinSeg);
}

function getLogFilePath(isTmp) {
  const { monoRootHelLog, monoRoot } = getMonoRootInfo();
  if (curLogName) {
    return getLogPathByName(curLogName, isTmp);
  }
  if (curAppData) {
    return getLogPathByName(curAppData.appDir, isTmp);
  }

  // 触发 [.../bin/node, .../root-scripts/executeStart, xx:hel]
  const argv = process.argv;
  const last1Str = lastNItem(argv);
  const last2Str = lastNItem(argv, 2);
  if (last2Str.includes('/executeStart')) {
    const [dirOrPkgName] = last1Str.split(':');
    return getLogPathByName(dirOrPkgName, isTmp);
  }

  const cwd = process.cwd();
  // 避免根目录执行 pnpm start 时创建错误的 log 文件
  if (cwd !== monoRoot) {
    const dirName = lastItem(cwd.split(path.sep));
    if (dirName) {
      return getLogPathByName(dirName, isTmp);
    }
  }

  const devInfo = inferDevInfo(true);
  if (devInfo) {
    const dirName = inferDirFromDevInfo(devInfo, true);
    if (dirName) {
      return getLogPathByName(dirName, isTmp);
    }
  }

  return monoRootHelLog;
}

function logRunningDetails(options, ...args) {
  const { isTmp, isRed } = options;
  const rawPrefix = isTmp ? LOG_PREFIX_TMP : LOG_PREFIX;
  const prefix = isRed ? chalk.red(rawPrefix) : chalk.cyan(rawPrefix);
  console.log(prefix, ...args);
  const logFilePath = getLogFilePath(isTmp);

  if (args.some((v) => typeof v === 'object')) {
    args.forEach((v) => {
      let line;
      if (typeof v === 'object') {
        line = `${JSON.stringify(v, null, 2)}${os.EOL}`;
      } else {
        line = `${v}${os.EOL}`;
      }
      fs.appendFileSync(logFilePath, line);
    });
  } else {
    const line = `${args.join('')}${os.EOL}`;
    fs.appendFileSync(logFilePath, line);
  }
}

function clearMonoLog(markStartTime = true, isTmp = false) {
  const logFilePath = getLogFilePath(isTmp);
  const line = markStartTime ? getLogTimeLine() : '';
  // 存在才清，避免产生很多空的 .tmp.log
  if (fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, line);
  }
}

/**
 * 打印hel-mono运行普通日志
 */
function helMonoLog(...args) {
  logRunningDetails({ isTmp: false, isRed: false }, ...args);
}

/**
 * 打印hel-mono运行警告日志
 */
function helMonoErrorLog(...args) {
  logRunningDetails({ isTmp: false, isRed: true }, ...args);
}

/**
 * 打印临时调试日志
 */
function helMonoLogTmp(...args) {
  logRunningDetails({ isTmp: true, isRed: false }, ...args);
}

module.exports = {
  trySetLogName,
  getCurAppData,
  setCurAppData,
  clearMonoLog,
  helMonoLog,
  helMonoErrorLog,
  helMonoLogTmp,
};
