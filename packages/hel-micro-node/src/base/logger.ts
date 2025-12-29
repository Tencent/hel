import * as fs from 'fs';
import * as path from 'path';
import { getHelLogFilesDir } from './path-helper';

let runningLogPath = '';
function getRunningLogPath() {
  if (!runningLogPath) {
    const dir = getHelLogFilesDir();
    runningLogPath = path.join(dir, './running.log');
  }

  return runningLogPath;
}

export function print(...args: any[]) {
  if (String(args[0] || '').includes('Cannot set properties of')) {
    console.trace(...args);
  }
  if (String(args[0] || '').includes('Cannot find module')) {
    console.trace(...args);
  }
  console.log(...args);
}

export function printError(...args: any[]) {
  console.error(...args);
}

export function printWarn(...args: any[]) {
  console.error(...args);
}

export function writeLog(msg: string) {
  const filePath = getRunningLogPath();
  const time = new Date().toLocaleString();
  fs.appendFileSync(filePath, `[${time}]: ${msg}\n`);
}
