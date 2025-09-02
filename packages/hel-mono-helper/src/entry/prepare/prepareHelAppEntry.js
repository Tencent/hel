/** @typedef {import('../../types').IPrepareHelEntryFilesOptions} Options */
/** @typedef {import('../../types').ICWDAppData} ICWDAppData */
const { prepareAppFiles, ensureExAppProject } = require('./share');

module.exports = function prepareHelAppEntry(/** @type {Options} */ options) {
  const { appData, devInfo, forEX } = options;

  if (forEX) {
    return ensureExAppProject(devInfo, options);
  }

  return prepareAppFiles(devInfo, appData);
};
