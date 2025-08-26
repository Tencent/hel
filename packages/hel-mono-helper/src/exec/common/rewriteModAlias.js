/** @typedef {import('../../types').IArgvOptions} IArgvOptions*/
const path = require('path');
const fs = require('fs');
const jsonc = require('jsonc-parser');
const { helMonoLog } = require('../../util');
const { getFileContentLines } = require('../../util/file');
const { rewriteByLines, rewriteByDirPath } = require('../../util/rewrite');
const { MOD_TEMPLATE } = require('../../consts');

function getFileJson(dirPath, relPath) {
  const filePath = path.join(dirPath, relPath);
  const content = fs.readFileSync(filePath, { encoding: 'utf8' });
  const json = jsonc.parse(content);
  return {
    json,
    write: (input) => fs.writeFileSync(filePath, JSON.stringify(input || json, null, 2)),
  };
}

function getLinesAndHandler(dirPath, relPath) {
  const filePath = path.join(dirPath, relPath);
  const lines = getFileContentLines(filePath);
  return {
    lines,
    write: (input) => rewriteByLines(filePath, input || lines),
  };
}

function rewriteNewAlias(dirPath, oldAlias, newAlias) {
  rewriteByDirPath(dirPath, (lines, fileItem) => {
    let shouldRewrite = false;
    let newLines = [];
    lines.forEach((line) => {
      let newLine = line;
      if (line.includes(`'${oldAlias}/`)) {
        newLine = line.replace(`'${oldAlias}/`, `'${newAlias}/`);
        shouldRewrite = true;
      } else if (line.includes(`"${oldAlias}/`)) {
        newLine = line.replace(`"${oldAlias}/`, `"${newAlias}/`);
        shouldRewrite = true;
      }
      newLines.push(newLine);
    });
    if (shouldRewrite) {
      helMonoLog(`found oldAlias ${oldAlias} in ${fileItem.path}, rewrite it as ${newAlias}`);
    }

    return { shouldRewrite, newLines };
  });
}

function rewriteModAliasForLib(argvOptions, oldAlias) {
  const { copyToPath, alias } = argvOptions;
  if (oldAlias) {
    const srcPath = path.join(copyToPath, './src');
    rewriteNewAlias(srcPath, oldAlias, alias);
    return;
  }

  const ret2 = getLinesAndHandler(copyToPath, './src/utils/index.ts');
  ret2.lines.forEach((line, idx) => {
    const toReplace = `${alias}/utils/path/to/async-hello`;
    if (line.includes('./path/to/async-hello')) {
      ret2.lines[idx] = line.replace('./path/to/async-hello', toReplace);
    } else if (line.includes('@ml/utils/path/to/async-hello')) {
      ret2.lines[idx] = line.replace('@ml/utils/path/to/async-hello', toReplace);
    }
  });
  ret2.write();

  const ret3 = getLinesAndHandler(copyToPath, './src/utils/__tests__/index.ts');
  ret3.lines.forEach((line, idx) => {
    const toReplace = `${alias}/utils`;
    if (line.includes('../index')) {
      ret3.lines[idx] = line.replace('../index', toReplace);
    } else if (line.includes('@ml/utils')) {
      ret3.lines[idx] = line.replace('@ml/utils', toReplace);
    }
  });
  ret3.write();
}

function rewriteModAliasForReactApp(argvOptions, oldAlias) {
  const { copyToPath, alias } = argvOptions;
  if (oldAlias) {
    const srcPath = path.join(copyToPath, './src');
    rewriteNewAlias(srcPath, oldAlias, alias);
    return;
  }

  const ret = getLinesAndHandler(copyToPath, './src/App.tsx');
  ret.lines.forEach((line, idx) => {
    if (line.includes('./utils/path/to/str')) {
      ret.lines[idx] = line.replace('./utils/path/to/str', `${alias}/utils/path/to/str`);
    } else if (line.includes('@/utils/path/to/str')) {
      ret.lines[idx] = line.replace('@/utils/path/to/str', `${alias}/utils/path/to/str`);
    }
  });
  ret.write();
}

exports.rewriteModAlias = function (/** @type {IArgvOptions} */argvOptions, oldAlias) {
  const { copyToPath, alias, modTemplate } = argvOptions;
  if (!alias) {
    return;
  }

  const ret = getFileJson(copyToPath, './tsconfig.json');
  if (!ret.json.compilerOptions) {
    ret.json.compilerOptions = {};
  }
  ret.json.compilerOptions.paths = { [`${alias}/*`]: ['./*'] };
  ret.write();

  if (MOD_TEMPLATE.libTs === modTemplate) {
    rewriteModAliasForLib(argvOptions, oldAlias);
    return;
  }

  if (MOD_TEMPLATE.reactApp === modTemplate) {
    rewriteModAliasForReactApp(argvOptions, oldAlias);
    return;
  }
};
