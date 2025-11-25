import * as fs from 'fs';
import * as path from 'path';
import { getHelLogFilesDir } from './path-helper';

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
  const dir = getHelLogFilesDir();
  const file = path.join(dir, './running.log');
  const time = new Date().toLocaleString();
  fs.appendFileSync(file, `[${time}]: ${msg}\n`);
}
