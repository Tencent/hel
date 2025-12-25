import type { ICuteExpressCtx } from 'at/types';
import regs from 'at/utils/regs';
import type { ISubAppVersion } from 'hel-types';

export function fillVersionForCreate(version: ISubAppVersion) {
  const ensureValue = (prop: string, defaultVal = '') => {
    version[prop] = version[prop] || defaultVal;
  };
  ensureValue('build_id');
}

export function checkVersionIndex(appName: string, versionIndex: string) {
  if (!versionIndex.startsWith(appName)) {
    throw new Error(`versionIndex ${versionIndex} must starts with ${appName}`);
  }
  if (!regs.versionIndexReg.test(versionIndex)) {
    throw new Error(`versionIndex ${versionIndex} must satisfy reg ${regs.versionIndexReg}`);
  }
}

/**
 * 转为版本索引，
 * in: xxxx, xxxx_202501011212 --> xxxx_202501011212
 * in: xxxx, 1.1.1 --> xxxx@1.1.1
 */
export function toVersionIndex(name: string, mayVersionTag: string) {
  // 旧格式版本索引形如：xxxx_202501011212，此时版本标签和版本索引是同一个值
  if (mayVersionTag.startsWith(`${name}_`)) {
    return mayVersionTag;
  }
  // 旧版本sdk和前端代码的请求
  if (mayVersionTag.startsWith(`${name}@`)) {
    return mayVersionTag;
  }

  return `${name}@${mayVersionTag}`;
}

export function getVersionTag(versionIndex: string) {
  // 符合 npm cdn 规范的版本索引值
  if (versionIndex.includes('@')) {
    // 'goggo' 'goggo@1.1.1' --> 1.1.1
    // '@xc/goggo' '@xc/goggo@1.1.1' --> 1.1.1
    const strList = versionIndex.split('@');
    const vertionTag = strList[strList.length - 1];
    return vertionTag;
  }

  // 旧版本 helpack cdn 链接规范的版本索引值，就当做是 vertionTag 去存储
  return versionIndex;
}

/**
 * 按原来的语义，query.version 指的是数据库里的 sub_app_version 即可做索引的值，
 * 支持 scope 逻辑后，需要将可能在 params 参数里的数据转移到 query 里且需要保持原来的语义，避免底层逻辑做调整，
 * 注：赋值 params.appName 是为了适配 appPage.loadSubApp 逻辑
 */
export function assignNameAndVerToQuery(ctx: ICuteExpressCtx) {
  const { params, query } = ctx.req;
  const { scope, versionIndex } = params;
  const queryVer = query.version || query.ver || '';

  // 命中了 meta/:versionIndex 路由
  if (!scope) {
    const [nameAsPrefix, ymdhmsStr = ''] = versionIndex.split('_');
    // 兼容旧格式： xxxx_20250101130101
    if (ymdhmsStr.length === 14) {
      query.name = nameAsPrefix;
      query.version = versionIndex;
      params.appName = nameAsPrefix;
      return;
    }

    const [name, versionTag = ''] = versionIndex.split('@');
    query.name = name;
    query.version = versionTag ? versionIndex : queryVer;
    params.appName = name;
    return;
  }

  // 命中了 meta/:scope/:versionIndex 路由
  // 注：支持 scope 后新数据 versionIndex 全部是 {name}@{ver} 格式，故
  const [name, versionTag = ''] = versionIndex.split('@');
  query.name = `${scope}/${name}`;
  query.version = versionTag ? `${scope}/${versionIndex}` : queryVer;
  params.appName = name;
}
