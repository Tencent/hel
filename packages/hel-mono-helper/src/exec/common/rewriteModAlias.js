const path = require('path');
const fs = require('fs');
const os = require('os');
const { rewriteByLines } = require('../../util/rewrite');
const { MOD_TEMPLATE } = require('../../consts');

function getFileJson(dirPath, relPath) {
  const filePath = path.join(dirPath, relPath);
  const content = fs.readFileSync(filePath, { encoding: 'utf8' });
  const json = JSON.parse(content);
  return {
    json,
    write: (input) => fs.writeFileSync(filePath, JSON.stringify(input || json, null, 2)),
  };
}

function getFileContentLines(dirPath, relPath) {
  const filePath = path.join(dirPath, relPath);
  const content = fs.readFileSync(filePath, { encoding: 'utf8' });
  const lines = content.split(os.EOL);
  return {
    lines,
    write: (input) => rewriteByLines(filePath, input || lines),
  };
}

function rewriteModAliasForLib(createOptions) {
  const { copyToPath, alias } = createOptions;

  const ret2 = getFileContentLines(copyToPath, './src/utils/index.ts');
  ret2.lines.forEach((line, idx) => {
    if (line.includes('./path/to/async-hello')) {
      ret2.lines[idx] = line.replace('./path/to/async-hello', `${alias}/utils/path/to/async-hello`);
    }
  });
  ret2.write();


  const ret3 = getFileContentLines(copyToPath, './src/utils/__tests__/index.ts');
  ret3.lines.forEach((line, idx) => {
    if (line.includes('../index')) {
      ret3.lines[idx] = line.replace('../index', `${alias}/utils`);
    }
  });
  ret3.write();
}

function rewriteModAliasForReactApp(createOptions) {
  const { copyToPath, alias } = createOptions;

  const ret = getFileContentLines(copyToPath, './src/App.tsx');
  ret.lines.forEach((line, idx) => {
    if (line.includes('./utils/path/to/str')) {
      ret.lines[idx] = line.replace('./utils/path/to/str', `${alias}/utils/path/to/str`);
    } else if (line.includes('@/utils/path/to/str')) {
      ret.lines[idx] = line.replace('@/utils/path/to/str', `${alias}/utils/path/to/str`);
    }
  });
  ret.write();
}

exports.rewriteModAlias = function rewriteModAlias(createOptions) {
  const { copyToPath, alias, modTemplate } = createOptions;
  if (!alias) {
    return;
  }

  const ret = getFileJson(copyToPath, './tsconfig.json');
  ret.json.paths = { [`${alias}/*`]: ["./*"] };
  ret.json.compilerOptions.paths = { [`${alias}/*`]: ["./*"] };
  ret.write();

  if (MOD_TEMPLATE.lib === modTemplate) {
    rewriteModAliasForLib(createOptions);
    return;
  }

  if (MOD_TEMPLATE.reactApp === modTemplate) {
    rewriteModAliasForReactApp(createOptions);
    return;
  }
};
