const fs = require('fs');
const os = require('os');
const path = require('path');
const { lastItem } = require('./arr');
const { HEL_DEL_MARK } = require('../consts');
const { getFileInfoList, getFileContentLines } = require('./file');

/**
 * 重新文件里的每一行数据，支持以下3种模式
 * 1 删除某一行
 * 2 重写某一行为新的一行
 * 3 重写某一行为新的多行
 */
function rewriteFileLine(filepath, replaceLineCb) {
  const content = fs.readFileSync(filepath, { encoding: 'utf-8' });
  const rawLines = content.split(os.EOL);
  const targetLines = [];
  const defaultCb = (line) => ({ line });
  const lineCb = replaceLineCb || defaultCb;

  rawLines.forEach((rawLine) => {
    // 自动忽略此行
    if (rawLine.includes(HEL_DEL_MARK)) {
      return;
    }
    const { line, ignore } = lineCb(rawLine);
    // 人为要忽略此行
    if (ignore) {
      return;
    }

    if (Array.isArray(line)) {
      line.forEach((v) => targetLines.push(v));
    } else {
      targetLines.push(line);
    }
  });

  rewriteByLines(filepath, targetLines);
}

function rewriteByLines(filepath, lines) {
  fs.writeFileSync(filepath, lines.join(os.EOL));
}

function rewriteByDirPath(dirPath, cb, options = {}) {
  const { excludeNames = ['node_modules'] } = options;

  const handleFile = (filePath) => {
    const lines = getFileContentLines(filePath);
    const name = lastItem(filePath.split(path.seq));
    const { shouldRewrite, newLines } = cb(lines, { name, path: filePath, isDirectory: false });
    if (shouldRewrite) {
      rewriteByLines(filePath, newLines);
    }
  };

  if (!fs.statSync(dirPath).isDirectory()) {
    handleFile(dirPath);
    return;
  }

  const list = getFileInfoList(dirPath);
  for (const item of list) {
    const { path, isDirectory, name } = item;
    if (excludeNames.includes(name)) {
      continue;
    }
    if (!isDirectory) {
      handleFile(path);
      continue;
    }
    rewriteByDirPath(path, cb, options);
  }
}

module.exports = {
  rewriteByLines,
  rewriteFileLine,
  rewriteByDirPath,
};
