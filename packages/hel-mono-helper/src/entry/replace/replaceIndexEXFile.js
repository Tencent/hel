/** @typedef {import('../../types').IMonoDevInfo} IDevInfo */
/** @typedef {import('../../types').ICWDAppData} ICWDAppData */
const path = require('path');
const { getMonoDevData } = require('../../dev-data');
const { helMonoLog } = require('../../util');
const { isDictNull } = require('../../util/dict');
const { rewriteFileLine } = require('../../util/rewrite');

/**
 * 替换 indexEX.ts 文件内容为 externals 构建做准备
 */
module.exports = function replaceIndexEXFile(/** @type {ICWDAppData} */ appData, /** @type {IDevInfo} */ devInfo, options) {
  const { appSrcDirPath, helDirPath, appPkgName } = appData;
  let { liftableExternals } = options;
  const filePath = path.join(helDirPath, './indexEX.ts');

  if (!liftableExternals) {
    const data = getMonoDevData(devInfo, appSrcDirPath, options);
    liftableExternals = data.liftableExternals;
  }
  const hasExternals = !isDictNull(liftableExternals);

  helMonoLog(`replace content of ${filePath}`);
  rewriteFileLine(filePath, (line) => {
    let targetLine = line;
    if (line.includes('{{BOUND_MODULES}}')) {
      if (hasExternals) {
        const importLines = [];
        const boundLines = [
          `// Content generated at ${new Date().toLocaleString()} by hel-mono-helper`,
          '// Found these modules to be bound to global',
        ];
        Object.keys(liftableExternals).forEach((pkgName) => {
          const boundName = liftableExternals[pkgName];
          importLines.push(`import * as ${boundName} from '${pkgName}';`);
          boundLines.push(`window.${boundName} = ${boundName};`);
        });

        targetLine = importLines.concat(['']).concat(boundLines).concat(['']);
      } else {
        targetLine = `// Found no auto externals for ${appPkgName}`;
      }
    }

    return { line: targetLine };
  });

  // 此处返回值不影响流程正确性
  return { mods: {} };
};
