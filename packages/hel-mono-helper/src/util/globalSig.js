const { orValue } = require('./dict');

const sigValues = {};
const sigIsWrite = {};

const sigKeys = {
  isDisplayConsoleLog: 'isDisplayConsoleLog',
};

function maySetSig(sigKey, sigValue) {
  if (sigIsWrite[sigKey]) {
    return;
  }

  sigIsWrite[sigKey] = true;
  sigValues[sigKey] = sigValue;
}

function getIsDisplayConsoleLog() {
  const key = sigKeys.isDisplayConsoleLog;
  return orValue(sigValues[key], true);
}

function setIsDisplayConsoleLog(bool) {
  const key = sigKeys.isDisplayConsoleLog;
  maySetSig(key, bool);
}


module.exports = {
  getIsDisplayConsoleLog,
  setIsDisplayConsoleLog
};
