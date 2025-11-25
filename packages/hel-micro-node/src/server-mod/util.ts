import * as fs from 'fs';
import { recordMemLog } from '../base/mem-logger';
import { isFn, isModuleLike } from '../base/util';

export function extractFnAndDictProps(source: object) {
  if (!isModuleLike(source)) {
    throw new Error('Source module must be a plain json object!');
  }

  const fnProps: Record<any, boolean> = {};
  const dictProps: Record<any, boolean> = {};
  Object.keys(source).forEach((key) => {
    const val = source[key];
    if (isFn(val)) {
      fnProps[key] = true;
    } else if (isModuleLike(val)) {
      dictProps[key] = true;
    }
  });

  return { fnProps, dictProps };
}

export function wait(ms = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function loadJson<T extends any>(jsonFilePath: string, defaultVal: T): T {
  try {
    const data = fs.readFileSync(jsonFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err: any) {
    return defaultVal;
  }
}

export function safeUnlinkFile(filePath: string) {
  try {
    fs.unlinkSync(filePath);
  } catch (err: any) {
    recordMemLog({ type: 'ModIns', subType: 'safeUnlinkFile', desc: err.message, data: filePath });
  }
}

export function noSlash(str: string) {
  if (str.endsWith('/')) {
    return str.substring(0, str.length - 1);
  }
  return str;
}
