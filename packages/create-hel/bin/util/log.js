const chalk = require('chalk');
const { getIsDebug } = require('./debug');

function logTip(str) {
  console.log(chalk.cyan(str));
}

function logError(str, useRawErrorLogHandler) {
  if (useRawErrorLogHandler) {
    return console.error(str);
  }
  // log with dark red color
  console.log(chalk.hex('#c03b28')(str));
}

function logPurple(str, strOrObj) {
  // log with purple color
  console.log(chalk.hex('#800080')(str));
  if (strOrObj) {
    console.log(strOrObj);
  }
}

function logDebug(str, strOrObj) {
  if (!getIsDebug()) {
    return;
  }
  logPurple(str, strOrObj);
}

function getInfoLine(str, fixedLen, options) {
  const optVar = options || {};
  const strLen = optVar.strLen || str.length;
  const lastChar = optVar.lastChar || '';

  let toFillStr = '';
  if (strLen < fixedLen) {
    const charArr = new Array(fixedLen - strLen).fill(' ');
    toFillStr = charArr.join('');
  }

  return `${str}${toFillStr}${lastChar}`;
}

/** log tip line */
function logTipLine(str, fixedLen, options) {
  logTip(getInfoLine(str, fixedLen, options));
}

module.exports = {
  logTip,
  logTipLine,
  logError,
  logPurple,
  logDebug,
};
