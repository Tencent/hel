import * as fs from 'fs';

const fsOptions = { encoding: 'utf8' as const };

export function ensureDict(filePath) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '{}', fsOptions);
  }
  const dictStr = readFileContent(filePath);
  const dict = JSON.parse(dictStr);
  return dict;
}

export function saveDict(filePath, dict: object) {
  fs.writeFileSync(filePath, JSON.stringify(dict, null, 2), fsOptions);
}

export function clearSubDict(dictFilePath: string, helModName: string) {
  const dict = ensureDict(dictFilePath);
  dict[helModName] = {};
  saveDict(dictFilePath, dict);
}

export function readFileContent(filePath: string) {
  const content = fs.readFileSync(filePath, fsOptions);
  return content;
}
