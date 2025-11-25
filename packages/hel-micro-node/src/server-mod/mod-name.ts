import { PLATFORM } from '../base/consts';
import { INDEX_JS } from '../base/mod-consts';
import type { INameData } from '../base/types';

/**
 * 提取 hel 名称相关数据
 * @example
 * in: 'a/b.js'
 * out: {helModName: 'a', relPath: 'b.js'}
 *
 * in: 'a/d/d1/b.js'
 * out: {helModName: 'a', relPath: 'd/d1/b.js'}
 */
export function extractNameData(helModNameOrPath: string, platform = PLATFORM): INameData {
  let helModName = helModNameOrPath;
  const helModPath = helModNameOrPath;
  let relPath = INDEX_JS;
  let proxyFileName = `${helModNameOrPath}.js`;
  const splittedList = helModNameOrPath.split('/');
  const includeSlash = splittedList.length > 1;

  if (helModNameOrPath.startsWith('@')) {
    if (!includeSlash) {
      throw new Error(`Found invalid scoped helModName ${helModNameOrPath}`);
    }
    const [scope, name, ...rest] = splittedList;
    helModName = `${scope}/${name}`;
    relPath = rest.join('/');
    proxyFileName = `${scope}+${name}.js`;
  } else if (includeSlash) {
    const [name, ...rest] = splittedList;
    helModName = name;
    relPath = rest.join('/');
    proxyFileName = `${name}.js`;
  }

  if (platform !== PLATFORM) {
    proxyFileName = `${platform}+${proxyFileName}`;
  }

  const hasFileExt = relPath.endsWith('.js') || relPath.endsWith('.cjs') || relPath.endsWith('.mjs');
  if (!hasFileExt) {
    // 当做目录处理，拼接结果 xxx-dir/index.js 做为 relPath
    relPath = relPath ? `${relPath}/${INDEX_JS}` : INDEX_JS;
  }

  return { helModName, relPath, helModPath, helModNameOrPath, proxyFileName };
}
