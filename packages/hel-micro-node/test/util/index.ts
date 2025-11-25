import * as fs from 'fs';
import * as path from 'path';

export const next = () => Promise.resolve('done');

export function delay(ms = 1000) {
  return new Promise((r) => setTimeout(r, ms));
}

export function arrItemInclues(arr: string[], keyword: string) {
  return arr.some((v) => v.includes(keyword));
}

/** 获取一个模拟的伽利略上报模块对象 */
export function getReporter() {
  const errDescList: string[] = [];
  const infoDescList: string[] = [];

  return {
    errDescList,
    reporter: {
      reportError(message: string, desc: string) {
        errDescList.push(desc);
        return message;
      },
      reportInfo(message: string, desc: string) {
        infoDescList.push(desc);
        return message;
      },
    },
  };
}

export function loadJson<T = any>(jsonFileName: string): T {
  const fullPath = path.join(__dirname, `../data/${jsonFileName}`);
  const data = fs.readFileSync(fullPath, 'utf8');
  return JSON.parse(data);
}

export function cloneJson(rawJson: object) {
  return JSON.parse(JSON.stringify(rawJson));
}
