const path = require('path');
const os = require('os');
const fs = require('fs');
const chalk = require('chalk');
const { LOG_PREFIX, LOG_PREFIX_TMP } = require('../consts');
const { getCurKeyword } = require('./keyword');
const { getMonoRootInfo } = require('./root-info');
const { getLogTimeLine } = require('./time');

/** @type {import('../types').ICWDAppData} 正在运行中应用数据 */
let curAppData = null;
const cachedPaths = {};

/**
 *
 * @returns 获取已缓存的运行中的应用目录数据
 */
exports.getCurAppData = function () {
  return curAppData;
};

exports.setCurAppData = function (data) {
  curAppData = data;
};

function getLogFilePath(isTmp) {
  const { monoRootHelLog, monoRootHelDir } = getMonoRootInfo();
  const curKeyword = getCurKeyword();
  const getLogPath = (logName) => {
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
  };

  if (curKeyword) {
    return getLogPath(curKeyword);
  }
  if (curAppData) {
    return getLogPath(curAppData.appDir);
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

exports.clearMonoLog = function (markStartTime = true, isTmp = false) {
  const logFilePath = getLogFilePath(isTmp);
  const line = markStartTime ? getLogTimeLine() : '';
  // 存在才清，避免产生很多空的 .tmp.log
  if (fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, line);
  }
};

/**
 * 打印hel-mono运行普通日志
 */
exports.helMonoLog = function (...args) {
  logRunningDetails({ isTmp: false, isRed: false }, ...args);
};

/**
 * 打印hel-mono运行警告日志
 */
exports.helMonoErrorLog = function (...args) {
  logRunningDetails({ isTmp: false, isRed: true }, ...args);
};

/**
 * 打印临时调试日志
 */
exports.helMonoLogTmp = function (...args) {
  logRunningDetails({ isTmp: true, isRed: false }, ...args);
};
