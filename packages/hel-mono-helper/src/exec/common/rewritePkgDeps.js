/** @typedef {import('hel-mono-types').IMonoDevInfo} IMonoDevInfo*/
const fs = require('fs');
const path = require('path');
const { helMonoLog } = require('../../util');
const { getFileJson } = require('../../util/base');
const { getDevInfoDirs } = require('../../util/devInfo');
const { getFileInfoList } = require('../../util/file');
const { rewriteByDirPath } = require('../../util/rewrite');
const { getMonoRootInfo } = require('../../util/rootInfo');

function rewriteImportMod(modSrcPath, oldPkgName, newPkgName) {
  const modFileList = getFileInfoList(modSrcPath);
  for (const item of modFileList) {
    rewriteByDirPath(item.path, (lines, fileItem) => {
      let shouldRewrite = false;
      let newLines = [];
      lines.forEach((line) => {
        let newLine = line;
        // 加上下面前置判断，避免误判
        if (newLine.includes('from ') || newLine.includes('import ') || newLine.includes('require(')) {
          if (line.includes(`'${oldPkgName}'`)) {
            newLine = line.replace(`'${oldPkgName}'`, `'${newPkgName}'`);
            shouldRewrite = true;
          } else if (line.includes(`"${oldPkgName}"`)) {
            newLine = line.replace(`"${oldPkgName}"`, `"${newPkgName}"`);
            shouldRewrite = true;
          } else if (line.includes(`'${oldPkgName}/`)) {
            newLine = line.replace(`'${oldPkgName}/`, `'${newPkgName}/`);
            shouldRewrite = true;
          } else if (line.includes(`"${oldPkgName}"`)) {
            newLine = line.replace(`"${oldPkgName}/`, `"${newPkgName}/`);
            shouldRewrite = true;
          }
        }
        newLines.push(newLine);
      });

      if (shouldRewrite) {
        helMonoLog(`found ${fileItem.path} import ${oldPkgName}, rewrite as ${newPkgName}`)
      }
      return { shouldRewrite, newLines };
    });
  }
};

exports.rewritePkgDeps = function (/** @type {IMonoDevInfo} */ devInfo, oldPkgName, newPkgName) {
  const { monoRoot } = getMonoRootInfo();
  const { belongToDirs } = getDevInfoDirs(devInfo);

  for (const dir of belongToDirs) {
    const dirPath = path.join(monoRoot, dir);
    const list = getFileInfoList(dirPath);
    for (const item of list) {
      if (!item.isDirectory) {
        continue;
      }

      const pkgJsonPath = path.join(item.path, 'package.json');
      if (fs.existsSync(pkgJsonPath)) {
        const pkgJson = getFileJson(pkgJsonPath);
        const deps = pkgJson.dependencies || {};
        let shouldRewrite = false;

        if (deps[oldPkgName]) {
          const val = deps[oldPkgName];
          delete deps[oldPkgName];
          deps[newPkgName] = val;
          shouldRewrite = true;
        }

        const devDeps = pkgJson.devDependencies || {};
        if (devDeps[oldPkgName]) {
          const val = devDeps[oldPkgName];
          delete devDeps[oldPkgName];
          devDeps[newPkgName] = val;
          shouldRewrite = true;
        }

        if (shouldRewrite) {
          helMonoLog(`found ${pkgJsonPath} dep ${oldPkgName}, rewrite as ${newPkgName}`)
          fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2));
          const modSrcPath = path.join(item.path, 'src');
          helMonoLog(`check modSrcPath ${modSrcPath}`)
          rewriteImportMod(modSrcPath, oldPkgName, newPkgName);
        }
      }
    }
  }
};
