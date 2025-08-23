const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * 去多余的空格：'a   b c d' --> 'a b c d'
 */
function formatBlank(str) {
  const formatted = str
    .split(' ')
    .filter((v) => v !== '')
    .join(' ');
  return formatted;
}

/** 处理单行的导出语句，得到模块名称数组 */
function getModuleNames(oneLineExport) {
  const leftBracketIdx = oneLineExport.indexOf('{');
  const rightBracketIdx = oneLineExport.indexOf('}');
  const modStr = oneLineExport.substring(leftBracketIdx + 1, rightBracketIdx);
  const modList = modStr.split(',');
  const modNames = [];
  modList.forEach((v) => {
    const trimedV = v.trim();
    if (!trimedV.includes(' as ')) {
      modNames.push(trimedV);
    } else {
      const formated = formatBlank(trimedV);
      modNames.push(formated.split(' as ')[1]);
    }
  });
  return modNames.filter((v) => !!v);
}

/** 获取格式为一行导出所有模块的语句 */
function getOneLineExportStatement(strList, options) {
  const { ignoreIdx, statementStart, idx, lastIdx } = options;
  let endIdx = idx;
  if (!statementStart.includes('}')) {
    let cursorIdx = idx + 1;
    while (cursorIdx <= lastIdx) {
      ignoreIdx[cursorIdx] = true;
      if ((strList[cursorIdx] || '').includes('}')) {
        endIdx = cursorIdx;
        break;
      }
      cursorIdx += 1;
    }
  }

  let oneLineExport = statementStart;
  if (endIdx > idx) {
    // 导出语句不在一行内结束时，凑为一行
    for (let i = idx + 1; i <= endIdx; i++) {
      oneLineExport += strList[i];
    }
  }

  return oneLineExport;
}

function genExportModuleNames(filePath) {
  const res = fs.readFileSync(filePath);
  const content = res.toString();
  const strList = content.split(os.EOL);
  const lastIdx = strList.length - 1;
  const ignoreIdx = {};
  let modNames = [];

  strList.forEach((statement, idx) => {
    if (ignoreIdx[idx]) {
      return;
    }
    const trimed = statement.trim();
    if (trimed.startsWith('//') || trimed.startsWith('/**') || trimed.startsWith('*') || trimed.startsWith('*/')) {
      return;
    }
    const pured = formatBlank(trimed);
    if (!pured.startsWith('export ') || pured.startsWith('export type')) {
      return;
    }

    if (pured.startsWith('export * as')) {
      const restStr = pured.split('export * as ')[1];
      modNames.push(restStr.split(' ')[0]);
      return;
    }

    if (pured.startsWith('export const')) {
      const restStr = pured.split('export const')[1];
      const [left] = restStr.split('=');
      modNames.push(left.trim());
    }

    if (pured.startsWith('export function')) {
      const restStr = pured.split('export function')[1];
      // 可能带泛型符号，这里判断一下
      const seg = restStr.includes('<') ? '<' : '(';
      const [left] = restStr.split(seg);
      modNames.push(left.trim());
    }

    if (pured.startsWith('export enum')) {
      const restStr = pured.split('export enum')[1];
      const [left] = restStr.split('{');
      modNames.push(left.trim());
    }

    if (pured.startsWith('export {')) {
      const oneLineExportStatement = getOneLineExportStatement(strList, { ignoreIdx, statementStart: pured, idx, lastIdx });
      const oneLineModNames = getModuleNames(oneLineExportStatement);
      modNames = modNames.concat(oneLineModNames);
    }
  });

  return modNames;
}

/**
 * json 对象转为行数据
 */
function jsonObj2Lines(jsonObj, includeFL) {
  const targetLines = [];
  // 这一步 stringify 会导致 jsonObj 函数属性丢失，下面有逻辑还原第一层属性对应函数
  const str = JSON.stringify(jsonObj, null, 2);
  const lines = str.split('\n');
  const firstLineIdx = 0;
  const lastLineIdx = lines.length - 1;
  lines.forEach((str, idx) => {
    // includeFL=true，表示包含首行、尾行
    if (!includeFL && [firstLineIdx, lastLineIdx].includes(idx)) {
      return;
    }
    let line = str;

    const trimed = line.trim();
    // 处理注释
    if (trimed.startsWith('//') || trimed.startsWith('/*')) {
      targetLines.push(line);
      return;
    }

    if (line.includes(':')) {
      const segs = line.split(':');
      let [left, right] = segs;
      // 谨防右侧值里本身就含有冒号，例如："devHostname": "http://localhost"
      if (segs.length > 2) {
        right = segs.slice(1).join(':');
      }

      const leftChars = left.split('');
      if (leftChars.some((v) => ['/', '@', '-', '_'].includes(v))) {
        left = left.replaceAll('"', "'");
      } else {
        left = left.replaceAll('"', '');
      }
      right = right.replaceAll('"', "'");
      line = `${left}:${right}`;

      // 确保键值对都有尾逗号
      if (!line.endsWith(',') && !line.endsWith('{')) {
        line = `${line},`;
      }
    }

    // 确保 } 右侧有尾逗号
    if (line.endsWith('}')) {
      line = `${line},`;
    }

    targetLines.push(line);
  });

  // 还原 jsonObj 里第一层存在的函数定义属性
  // TODO 接入 acorn 走 ast 分析，目前此方法会将外包的方法实现 { test: sommeTest } 转移到内部
  const fnKeys = Object.keys(jsonObj).filter((key) => typeof jsonObj[key] === 'function');
  fnKeys.forEach((key) => {
    const fnStr = jsonObj[key].toString();
    const fnStrList = fnStr.split('\n');
    fnStrList.forEach((line, idx) => {
      if (idx === 0) {
        const compactLine = line.replaceAll(' ', '');
        console.log('compactLine', compactLine);
        if (compactLine.startsWith('()=>')) {
          // 形如 b: ()=>{...} 的箭头函数
          console.log('push', `  ${key}: ${line}`);
          targetLines.push(`  ${key}: ${line}`);
          return;
        }
        if (compactLine.startsWith('function(')) {
          // 形如 b: function(){...} 的函数
          targetLines.push(`  ${key}: ${line}`);
          return;
        }
        if (compactLine.startsWith(`${key}(`)) {
          // 形如 b(){...} 的函数
          targetLines.push(`  ${line}`);
          return;
        }
      }
      targetLines.push(line);
    });
  });

  return targetLines;
}

function getModEntryFilePath(appSrcDirPath) {
  let filePath = path.join(appSrcDirPath, './index.ts');
  if (!fs.existsSync(filePath)) {
    filePath = path.join(appSrcDirPath, './index.js');
  }
  if (!fs.existsSync(filePath)) {
    filePath = path.join(appSrcDirPath, './index.tsx');
  }
  if (!fs.existsSync(filePath)) {
    filePath = path.join(appSrcDirPath, './index.jsx');
  }

  return filePath;
}

module.exports = {
  genExportModuleNames,
  getModEntryFilePath,
  jsonObj2Lines,
};
