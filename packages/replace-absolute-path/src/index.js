/*
|--------------------------------------------------------------------------
|
| convert absolute path based baseUrl to relative path
|
| 可配合 npm scripts 命令执行脚本将所有的绝对引用路径转为相对应用路径
| 例如：import { isSubApp } from 'services/appEnv';
| 将转为：import { isSubApp } from '../../services/appEnv';
| 让项目被别的项目引用时，能正确的导出整个项目的推导类型
|--------------------------------------------------------------------------
*/
const fs = require('fs');
const os = require('os');
const rl = require('readline');
const childProcess = require('child_process');
const util = require('util');

const exec = util.promisify(childProcess.exec);

const innerUtil = {
  strCount(str, subStr) {
    const count = str.split(subStr).length - 1;
    return count;
  },
  isImportExportLine(line) {
    const trimed = line.trim();
    const isExportStartsWith = (key) => trimed.startsWith(`export ${key}`) || trimed.startsWith(`export  ${key}`);

    // 以下导出语句不做处理
    if (
      isExportStartsWith('interface')
      || isExportStartsWith('const')
      || isExportStartsWith('enum')
      || isExportStartsWith('function')
      || isExportStartsWith('async')
      || isExportStartsWith('default')
    ) {
      return false;
    }

    // 非 export type {} from 'xxxx'; 语句
    if (isExportStartsWith('type') && !trimed.includes(' from ')) {
      return false;
    }

    const strList = line.split(' ').filter((item) => !!item);
    return strList[0] === 'import' || strList[0] === 'export';
  },
  judgeLineEnd(line) {
    /** @type string */
    let pureTmpLine = line.replace(/ /g, '');
    const doubleBackSlashIdx = pureTmpLine.indexOf('//');
    const semicolonIdx = pureTmpLine.indexOf(';');
    const hasDoubleBackSlash = doubleBackSlashIdx >= 0;
    const hasSemicolon = semicolonIdx >= 0;

    if (pureTmpLine === '}' || pureTmpLine === '};') {
      return true;
    }

    if (innerUtil.isImportExportLine(line)) {
      // --->   import { xx } from
      if (!hasSemicolon) {
        if (innerUtil.strCount(line, "'") === 2) {
          // import { xx } from './a/b'
          return true;
        }
        if (innerUtil.strCount(line, '"') === 2) {
          // import { xx } from "./a/b"
          return true;
        }
        return false; // import { xx } from
      }

      // --->   import xxx from './yyy';
      if (hasSemicolon && !hasDoubleBackSlash) {
        return true;
      }

      // --->   import xxx from './yyy'; // some comment;
      if (hasSemicolon && hasDoubleBackSlash && semicolonIdx < doubleBackSlashIdx) {
        return true;
      }

      return false;
    }

    if (hasSemicolon && !hasDoubleBackSlash) {
      return true;
    }

    if (hasSemicolon && hasDoubleBackSlash && semicolonIdx < doubleBackSlashIdx) {
      return true;
    }

    return false;
  },
  DEFAULT_EXTS: ['.js', '.ts', '.jsx', '.tsx', '.vue'],
  noop: () => {},
  isWin: () => {
    return os.type() == 'Windows_NT';
  },
  /** 移除文件名的格式后缀 */
  delFilenameFmt(filename) {
    const arr = filename.split('.');
    arr.splice(arr.length - 1);
    return arr.join('.');
  },
};

function safePush(map, key, value) {
  let list = map[key];
  if (!list) {
    list = [];
    map[key] = list;
  }
  list.push(value);
}

function getRelativePrefix(level) {
  if (level === 1) {
    return './';
  } else {
    let prefix = '';
    new Array(level - 1).fill('').forEach(() => (prefix += '../'));
    return prefix;
  }
}

function getFileExt(/** @type string */ fullPathFilename) {
  const filenameList = fullPathFilename.split('/');
  const filename = filenameList[filenameList.length - 1];
  if (filename.startsWith('.')) {
    return '';
  }

  const strList = filename.split('.');
  const len = strList.length;
  if (len <= 1) {
    return '';
  }

  const [basename, ...extList] = strList;
  return {
    fullExt: `.${extList.join('.')}`, // .d.ts , .controller.ts , .js, , .ts , .jsx , .tsx etc
    simpleExt: `.${extList[extList.length - 1]}`, // .js, , .ts , .jsx , .tsx etc
  };
}

function pureAlias(alias) {
  const pured = {};
  Object.keys(alias).forEach((key) => {
    const val = alias[key];
    let targetKey = key;
    if (targetKey.endsWith('/*')) {
      targetKey = targetKey.substring(0, targetKey.length - 2);
    }
    if (targetKey.endsWith('/')) {
      targetKey = targetKey.substring(0, targetKey.length - 1);
    }

    let targetVal = val;
    if (targetVal.endsWith('/*')) {
      targetVal = targetVal.substring(0, targetVal.length - 2);
    }
    if (targetVal.endsWith('/')) {
      targetVal = targetVal.substring(0, targetVal.length - 1);
    }
    if (targetVal.startsWith('./')) {
      targetVal = targetVal.substring(2);
    }

    pured[targetKey] = targetVal;
  });

  return pured;
}

/**
 * @param {object} options
 * @param {string} [options.inputDir] - 输入目录
 * @param {string} [options.outputDir] - 输出目录，如想覆盖掉输入目录里的原始内容，可将输出目录设置为和输入目录一样的值
 * @param {string[] | '*'} [options.includeExts] - 欲做替换的文件扩展名，默认是 innerUtil.DEFAULT_EXTS，如设置为 '*'，表示包含所有文件
 * @param {string[]} [options.excludeExts] - 排除掉通过 includeExts 设定筛选出来文件，例如 a.service.ts 满足包含 .ts 后缀，可设定 ['.service.ts'] 将其排除掉
 * @param {boolean} [options.enableReplace] - default: true，是否开启替换功能，默认 true 表示开启
 * @param {(options:{fullPath:string, fileName:string, fileExt:string, fileFullExt: string})=>string} [options.appendToFileHead] - default: null
 * @param {boolean} [options.autoAttachEOL] - default:true
 * @param {object} [options.alias] - default:{} ，相对路径别名映射关系，例如 {'@lib':'xx/yy'}，表示 '@lib' 相对路径对应源码根目录里实际相对路径是 'xx/yy' 目录
 * 如对应顶层目录，可写为 {'@lib':''}
 * @param {object} [options.extraDirs] - default:{} ，额外的一级目录，指源码根目录之外的其他目录, key 目录名称，value 目录全路径
 * @param {()=>void} [options.afterReplaced] - 替换结束后的动作
 */
async function replaceRelativePath(options) {
  // 由 getFirstLevelDirsAndFiles 算出
  const firstLevelDirs = [];
  const firstLevelFiles = [];

  let _includeExts = innerUtil.DEFAULT_EXTS; // 如设置我，表示包含所有文件
  let _excludeExts = [];
  let _alias = {};
  let fileCount = 0;
  let fileWriteEndCount = 0;

  const fullPath2lineList = {};
  const fileWriteEvent = {
    cb: () => {},
    emit: (...args) => {
      fileWriteEvent.cb(...args);
    },
    on: (cb) => {
      fileWriteEvent.cb = cb;
    },
  };

  const optionsVar = options || {};
  const {
    inputDir,
    outputDir,
    includeExts = innerUtil.DEFAULT_EXTS,
    excludeExts = [],
    afterReplaced = innerUtil.noop,
    enableReplace = true,
    appendToFileHead = null,
    autoAttachEOL = true,
    alias = {},
    extraDirs = {},
  } = optionsVar;

  _includeExts = includeExts;
  _excludeExts = excludeExts;
  _alias = pureAlias(alias);

  if (!inputDir) {
    throw new Error('miss inputDir');
  }
  if (!outputDir) {
    throw new Error('miss outputDir, you can set outputDir equal to inputDir explicitly if you want to rewrite original files');
  }

  function matchKeyword(str, names) {
    let matchedKeyword = '';
    const len = names.length;
    for (let i = 0; i < len; i++) {
      const keyword = names[i];
      if (str.startsWith(keyword)) {
        matchedKeyword = keyword;
        break;
      }
    }
    return matchedKeyword;
  }

  function getPathInfo(line, firstQuoteIdx, lastQuoteIdx) {
    const firstQuote = line.substring(0, firstQuoteIdx + 1);
    let modPath = line.substring(firstQuoteIdx + 1, lastQuoteIdx);
    const lastQuote = line.substring(lastQuoteIdx);

    // 将映射的相对路径转为实际相对路径
    // 例如：@lib/xx/yy ---> my-comps/modules/xx/yy
    Object.keys(_alias).forEach((userPathPrefix) => {
      const realPathPrefix = _alias[userPathPrefix];
      if (modPath.startsWith(userPathPrefix)) {
        // 配置为 { '@ttt': '' }, 期望转换格式形如：@ttt/xx/yy ---> xx/yy
        if (!realPathPrefix) {
          modPath = modPath.substring(userPathPrefix.length + 1);
        } else {
          modPath = `${realPathPrefix}${modPath.substring(userPathPrefix.length)}`;
        }
      }
    });
    const matchedKeyword = matchKeyword(modPath, firstLevelDirs) || matchKeyword(modPath, firstLevelFiles);
    return { firstQuote, modPath, lastQuote, matchedKeyword };
  }

  function getFirstLevelDirsAndFiles(srcPath, optionExtraDirs) {
    const filenames = fs.readdirSync(srcPath);
    filenames.forEach(function (name) {
      const fullPath = `${srcPath}/${name}`;
      const stats = fs.statSync(fullPath);
      if (stats.isDirectory()) {
        firstLevelDirs.push(name);
      } else {
        firstLevelFiles.push(innerUtil.delFilenameFmt(name));
      }
    });

    optionExtraDirs.forEach((dir) => {
      if (!firstLevelDirs.includes(dir)) {
        firstLevelDirs.push(dir);
      }
    });
  }

  function startRewrite(fullPath, level) {
    /** @type string[] */
    const lineList = fullPath2lineList[fullPath] || [];
    const fWrite = fs.createWriteStream(fullPath);
    const skipLineIndexList = [];
    const lineIdx2ReplaceLine = {};

    // 计算出当前行需不需要被替换导入语句，如果是导入语句，返回替换行具体数据
    const getReplaceLineData = (curLineIndex) => {
      const curLine = lineList[curLineIndex];
      const lastIndex = lineList.length - 1;

      if (!enableReplace) {
        return { shouldBeenReplaced: false, line: '', lineIndex: curLineIndex };
      }

      if (skipLineIndexList.includes(curLineIndex)) {
        return { shouldBeenReplaced: false, line: '', lineIndex: curLineIndex };
      }

      if (innerUtil.isImportExportLine(curLine)) {
        const isCurLineEnd = innerUtil.judgeLineEnd(curLine);
        if (isCurLineEnd) {
          return { shouldBeenReplaced: true, line: curLine, lineIndex: curLineIndex };
        }

        // 类似 import { x, y, z, q, m, t } from 'xx';  未被拆成了多行，向下找当到最后一行
        let importEndLine = '';
        let importEndLineIndex = '';
        let tmpLine = curLine;
        let tmpLineIndex = curLineIndex;
        let isLineEnd = isCurLineEnd;

        // 开始寻找 import 结束的那一行
        while (!isLineEnd) {
          skipLineIndexList.push(tmpLineIndex);
          tmpLineIndex += 1;
          if (tmpLineIndex > lastIndex) {
            break;
          }

          // 尝试判断下一行是不是结束行
          tmpLine = lineList[tmpLineIndex];
          let isLineEnd = innerUtil.judgeLineEnd(tmpLine);
          if (isLineEnd) {
            importEndLine = tmpLine;
            importEndLineIndex = tmpLineIndex;
            break;
          }
        }

        // 始终未找到，就不做任何替换了
        if (!importEndLine) {
          return { shouldBeenReplaced: false, line: '', lineIndex: 0 };
        }

        // 特殊处理如下导出方式
        // export {
        //   xxx,
        //   yyy,
        // }
        if (!(importEndLine.includes(" from '") || importEndLine.includes(' from "'))) {
          return { shouldBeenReplaced: false, line: '', lineIndex: 0 };
        }

        return { shouldBeenReplaced: true, line: importEndLine, lineIndex: importEndLineIndex };
      }

      return { shouldBeenReplaced: false, line: '', lineIndex: curLineIndex };
    };

    // 遍历文件的行数据，开始做处理
    lineList.forEach((/** @type string */ oriLine, idx) => {
      // 已有计算好的替换数据，直接替换
      const cachedReplaceLine = lineIdx2ReplaceLine[idx];
      if (cachedReplaceLine) {
        fWrite.write(cachedReplaceLine);
        return;
      }

      const { shouldBeenReplaced, line, lineIndex } = getReplaceLineData(idx);
      if (shouldBeenReplaced) {
        let firstQuoteIdx = line.indexOf("'");
        let lastQuoteIdx = line.lastIndexOf("'");
        // 用户可能使用双引号引入其他模块
        if (firstQuoteIdx === -1 && lastQuoteIdx === -1) {
          firstQuoteIdx = line.indexOf('"');
          lastQuoteIdx = line.lastIndexOf('"');
        }
        // 未发现任何引号对，直接写入此行
        if (firstQuoteIdx === -1 && lastQuoteIdx === -1) {
          fWrite.write(`${line}${os.EOL}`);
          return;
        }

        const { firstQuote, modPath, lastQuote, matchedKeyword } = getPathInfo(line, firstQuoteIdx, lastQuoteIdx);
        // console.log('modPath', modPath);
        // console.log('matchedKeyword', matchedKeyword);
        if (matchedKeyword) {
          // services
          // 'services/xxx/yyy' -->  xxx/yyy
          const [, restStr = ''] = modPath.split(`${matchedKeyword}/`);
          const restPath = restStr ? `/${restStr}${lastQuote}` : `${lastQuote}`;
          const newLine = `${firstQuote}${getRelativePrefix(level)}${matchedKeyword}${restPath}`;
          const replaceLine = `${newLine}${os.EOL}`;
          // console.log('replaceLine', replaceLine);
          if (idx === lineIndex) {
            fWrite.write(replaceLine);
            return;
          }

          // 替换缓存好替换行数据，写入原始行数据
          lineIdx2ReplaceLine[lineIndex] = replaceLine;
          fWrite.write(`${oriLine}${os.EOL}`);
          return;
        }

        fWrite.write(`${oriLine}${os.EOL}`);
      } else {
        fWrite.write(`${oriLine}${os.EOL}`);
      }
    });
  }

  function mayAppendContentToFileHead(options) {
    const { fullPath } = options;
    if (!appendToFileHead) {
      return;
    }
    const content = appendToFileHead(options);
    if (!content) {
      return;
    }
    const oriContent = fs.readFileSync(fullPath);
    const eol = autoAttachEOL ? os.EOL : '';
    fs.writeFileSync(fullPath, `${content}${eol}${oriContent}`);
  }

  function traverseAllFiles(dirPath, level) {
    const _traverseAllFiles = (dirPath, level) => {
      const filenames = fs.readdirSync(dirPath);

      filenames.forEach(function (name) {
        // console.log(`name is ${name}`);
        const fullPath = `${dirPath}/${name}`;
        const stats = fs.statSync(fullPath);

        // 此时 fullPath 是目录
        if (stats.isDirectory()) {
          // 递归获取目录下子文件
          _traverseAllFiles(fullPath, level + 1);
        } else {
          fileCount += 1;
          const { simpleExt: ext, fullExt } = getFileExt(fullPath);
          let shouldRewrite = true;

          if (_includeExts === '*') {
            shouldRewrite = true;
          } else if (_includeExts.includes(ext) || _includeExts.includes(fullExt)) {
            shouldRewrite = true;
          }

          if (shouldRewrite) {
            // 筛选出来为需要重写的文件后，再查看有没有在排除名单里
            if (_excludeExts.includes(ext) || _excludeExts.includes(fullExt)) {
              shouldRewrite = false;
            }
          }

          mayAppendContentToFileHead({ fullPath, fileName: name, fileExt: ext, fileFullExt: fullExt });

          if (!shouldRewrite) {
            fileWriteEndCount += 1;
            // 不做任何覆盖写操作，直接结束
            fileWriteEvent.emit();
            return;
          }

          const rlIns = rl.createInterface({
            input: fs.createReadStream(fullPath),
          });
          rlIns.on('line', (line) => {
            // 记录文件的行数据，方便后面的 startRewrite 之用
            safePush(fullPath2lineList, fullPath, line);
          });
          rlIns.on('close', () => {
            fileWriteEndCount += 1;
            startRewrite(fullPath, level);
            // 当前文件写操作结束
            fileWriteEvent.emit();
          });
        }
      });
    };

    _traverseAllFiles(dirPath, level);
  }

  const dirNames = Object.keys(extraDirs);
  getFirstLevelDirsAndFiles(inputDir, dirNames);
  if (inputDir !== outputDir) {
    const makeCmd = (cmd) => {
      const shx = innerUtil.isWin() ? 'shx ' : '';
      return `${shx}${cmd}`;
    };

    if (!fs.existsSync(outputDir)) {
      await exec(makeCmd(`mkdir ${outputDir}`));
    }
    await exec(makeCmd(`rm -rf ${outputDir}/*`));
    await exec(makeCmd(`cp -r ${inputDir}/* ${outputDir}`));

    const len = dirNames.length;
    if (len) {
      for (let i = 0; i < len; i++) {
        const key = dirNames[i];
        const dirFullPath = extraDirs[key];
        // 复制额外目录（包含目录自身）到输出目录下
        await exec(makeCmd(`cp -r ${dirFullPath} ${outputDir}`));
      }
    }
  }
  traverseAllFiles(outputDir, 1);

  await new Promise((resolve) => {
    fileWriteEvent.on(() => {
      // 所有文件都写入完毕
      if (fileWriteEndCount === fileCount) {
        resolve();
      }
    });
  });

  afterReplaced();
}

// support: import {replaceRelativePath} from 'replace-relative-path';
// support: const { replaceRelativePath } = require('replace-relative-path');
replaceRelativePath.replaceRelativePath = replaceRelativePath;

replaceRelativePath.DEFAULT_EXTS = innerUtil.DEFAULT_EXTS;

module.exports = replaceRelativePath;
