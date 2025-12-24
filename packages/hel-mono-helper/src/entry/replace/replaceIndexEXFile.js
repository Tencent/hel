/** @typedef {import('../../types').IMonoDevInfo} IDevInfo */
/** @typedef {import('../../types').ICWDAppData} ICWDAppData */
const path = require('path');
const { helMonoLog, getCWDAppData } = require('../../util');
const { isDictNull } = require('../../util/dict');
const { getExternalBoundName } = require('../../util/monoPkg');
const { rewriteFileLine } = require('../../util/rewrite');
const { getExProjDeps } = require('../../util/ex');

/**
 * 替换 indexEX.ts 文件内容，为 externals 构建做准备
 */
module.exports = function replaceIndexEXFile(/** @type {ICWDAppData} */ appData, /** @type {IDevInfo} */ devInfo, options) {
  const { helDirPath, appPkgName } = appData;
  let { exProjDeps } = options || {};
  const filePath = path.join(helDirPath, './indexEX.ts');

  if (!exProjDeps) {
    // 在项目 src/.hel 下生成 ex 项目，故 appData 即是 exAppData 也是 masterAppData
    const appData = getCWDAppData(devInfo, appData.appDirPath);
    exProjDeps = getExProjDeps({ exAppData: appData, devInfo, masterAppData: appData, writeExJson: true });
  }
  const hasExternals = !isDictNull(exProjDeps);

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
        Object.keys(exProjDeps).forEach((pkgName) => {
          const boundName = getExternalBoundName(pkgName);
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
