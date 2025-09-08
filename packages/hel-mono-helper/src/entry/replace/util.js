const fs = require('fs');
const path = require('path');
const os = require('os');

function noop() {}

/**
 * 去多余的空格：'a   b c d' --> 'a b c d'
 */
function compactBlank(str) {
  const formatted = str
    .split(' ')
    .filter((v) => v !== '')
    .join(' ');
  return formatted;
}

function delBlank(str) {
  const formatted = str
    .split(' ')
    .filter((v) => v !== '')
    .join('');
  return formatted;
}

function ensureTailComma(str) {
  if (!str.endsWith(',')) {
    return `${str},`;
  }
  return str;
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
      const formated = compactBlank(trimedV);
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
    const pured = compactBlank(trimed);
    if (!pured.startsWith('export ') || pured.startsWith('export type')) {
      return;
    }

    if (pured.startsWith('export * as')) {
      const restStr = pured.split('export * as ')[1];
      modNames.push(restStr.split(' ')[0]);
      return;
    }

    if (pured.startsWith('export * from')) {
      const restStr = pured.split('export * from')[1];
      // TODO 奖励支持分析 export * from './xxx' 语句
      throw new Error(`'export * from' in ${filePath} is not supported currently, please use named export statement`);
    }

    if (pured.startsWith('export const')) {
      const restStr = pured.split('export const')[1];
      const [left] = restStr.split('=');
      modNames.push(left.trim());
      return;
    }

    if (pured.startsWith('export var')) {
      const restStr = pured.split('export var')[1];
      const [left] = restStr.split('=');
      modNames.push(left.trim());
      return;
    }

    if (pured.startsWith('export function')) {
      const restStr = pured.split('export function')[1];
      // 可能带泛型符号，这里判断一下
      const seg = restStr.includes('<') ? '<' : '(';
      const [left] = restStr.split(seg);
      modNames.push(left.trim());
      return;
    }

    if (pured.startsWith('export enum')) {
      const restStr = pured.split('export enum')[1];
      const [left] = restStr.split('{');
      modNames.push(left.trim());
      return;
    }

    if (pured.startsWith('export default')) {
      const restStr = pured.split('export enum')[1];
      modNames.push('default as default');
      return;
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
function jsonObj2Lines(jsonObj, options = {}) {
  const { includeFL, handleLine = noop } = options;
  const targetLines = [];
  // 这一步 stringify 会导致 jsonObj 函数属性丢失，下面有逻辑还原第一层属性对应函数
  const str = JSON.stringify(jsonObj, null, 2);
  const lines = str.split('\n');
  const firstLineIdx = 0;
  const lastLineIdx = lines.length - 1;

  let isArrLineHandling = false;
  let isArrPartial = false;
  let arrStartLine = '';
  let arrStartLineIdx = 0;
  let arrEndLineIdx = 0;

  const pushToLines = (line, idx) => {
    const isArrStartLine = arrStartLineIdx === idx;
    const isArrEndLine = arrEndLineIdx === idx;
    const params = { line, isArrPartial, arrStartLine, isArrStartLine, isArrEndLine };
    const handledLine = handleLine(params) || line;
    targetLines.push(handledLine);
  };

  lines.forEach((str, idx) => {
    // includeFL=true，表示包含首行、尾行
    if (!includeFL && [firstLineIdx, lastLineIdx].includes(idx)) {
      return;
    }
    let line = str;

    const trimed = line.trim();
    // 处理注释
    if (trimed.startsWith('//') || trimed.startsWith('/*')) {
      pushToLines(line, idx);
      return;
    }

    // 是数组键值对
    const noBlankLine = delBlank(line);
    if (noBlankLine.includes(':[')) {
      isArrLineHandling = true;
      isArrPartial = true;
      arrStartLine = line;
      arrStartLineIdx = idx;
      if (noBlankLine.includes(']')) {
        arrEndLineIdx = idx;
        isArrLineHandling = false;
      }
      pushToLines(line, idx);
      return;
    }

    // 是数组键值对的独立结束行
    if (noBlankLine.includes(']') && isArrLineHandling) {
      arrEndLineIdx = idx;
      isArrLineHandling = false;
      pushToLines(line, idx);
      return;
    }

    if (!isArrLineHandling) {
      isArrPartial = false;
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
    }

    pushToLines(line, idx);
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
        if (compactLine.startsWith('()=>')) {
          // 形如 b: ()=>{...} 的箭头函数
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

function getModEntryFilePath(appSrcDirPath, fileName = 'index') {
  let filePath = path.join(appSrcDirPath, `./${fileName}.ts`);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(appSrcDirPath, `./${fileName}.js`);
  }
  if (!fs.existsSync(filePath)) {
    filePath = path.join(appSrcDirPath, `./${fileName}.tsx`);
  }
  if (!fs.existsSync(filePath)) {
    filePath = path.join(appSrcDirPath, `./${fileName}.jsx`);
  }

  return filePath;
}


module.exports = {
  genExportModuleNames,
  getModEntryFilePath,
  jsonObj2Lines,
  ensureTailComma,
};
