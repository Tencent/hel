let isDebug = false;

function getIsDebug() {
  return isDebug;
}

function setIsDebug(isDebugVar) {
  isDebug = isDebugVar;
}

module.exports = {
  getIsDebug,
  setIsDebug,
};
