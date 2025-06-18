const fs = require('fs');
const os = require('os');
const { HEL_DEL_MARK } = require('../consts');

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
  const defaultCb = line => ({ line });
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
      line.forEach(v => targetLines.push(v));
    } else {
      targetLines.push(line);
    }
  });

  rewriteByLines(filepath, targetLines);
}

function rewriteByLines(filepath, lines) {
  fs.writeFileSync(filepath, lines.join(os.EOL));
}

module.exports = {
  rewriteByLines,
  rewriteFileLine,
};
