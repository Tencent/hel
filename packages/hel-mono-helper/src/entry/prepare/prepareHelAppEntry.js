/** @typedef {import('../../types').IPrepareHelEntryFilesOptions} Options */
/** @typedef {import('../../types').ICWDAppData} ICWDAppData */
const { prepareAppFiles, ensureExAppProject } = require('./share');

module.exports = function prepareHelAppEntry(/** @type {Options} */ options) {
  const { appData, devInfo, forEX } = options;

  if (forEX) {
    console.log('****************************** *************** ************** 222');
    return ensureExAppProject(devInfo, options);
  }

  console.log('****************************** *************** ************** 333');
  return prepareAppFiles(devInfo, appData);
};
