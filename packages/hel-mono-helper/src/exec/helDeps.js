/** @typedef {import('hel-mono-types').IMonoDevInfo} IMonoDevInfo*/
const { INNER_ACTION } = require('../consts');
const { prepareHelEntryForMainAndDeps } = require('../entry');
const { getCmdKeywordName, getNameData, getCWDPkgDir } = require('../util');

/**
 * 执行启动hel子依赖服务的命令
 */
exports.startHelDeps = function (/** @type {IMonoDevInfo} */ devInfo) {
  let mayPkgOrDir = '';
  const wordAt2 = getCmdKeywordName(2);
  const wordAt3 = getCmdKeywordName(3);

  if (INNER_ACTION.startHelDeps === wordAt2) {
    // 在根目录执行 npm start .deps hub 触发
    mayPkgOrDir = wordAt3;
  } else if (wordAt2.includes(':')) {
    // 在根目录执行 npm start hub:deps 触发
    mayPkgOrDir = wordAt2.split(':')[0];
  } else {
    // 在子目录执行 npm run start:deps 触发
    mayPkgOrDir = getCWDPkgDir();
  }

  const nameData = getNameData(mayPkgOrDir, devInfo);
  prepareHelEntryForMainAndDeps({ isForRootHelDir: false, devInfo, nameData, startDeps: true });
};
