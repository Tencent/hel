import { isLocal } from 'at/utils/deploy';
import { Request } from 'express';

/**
 * 各种请求参数提取函数，controller的ctx调用时无需传入req，框架会自动注入
 *
 * export.someMethod = ctx=>{
 *    const rtxName = ctx.pipes.getRtxName();
 * }
 */

export function getRtxName(req?: Request): string {
  if (!req) return '';

  const { cookies, query } = req;
  const { OA_USER_NAME, TNEWS_OA_USER, leah_auth, tnews_user, t_uid } = cookies;
  const { rtx, userName } = query;
  let rtxName = TNEWS_OA_USER || OA_USER_NAME || leah_auth || tnews_user || t_uid || rtx || userName || '';
  // console.log('see cookies ', cookies);

  if (!rtxName) {
    // 本地调试兜底逻辑，使用 hi-bro 的权限
    if (req.host === 'localhost' || req.hostname === 'localhost' || isLocal()) {
      rtxName = 'hi-bro';
    }
  }

  return rtxName;
}

export function getPageAndSize(req: Request) {
  const { page, size } = req.query as any;
  const targetPage = page ? parseInt(page) : 1;
  const targetSize = size ? parseInt(size) : 20;
  return { page: targetPage, size: targetSize };
}

export function getQueryAppName(req: Request): string {
  const { name } = req.query;
  if (!name) {
    throw new Error('param name is required');
  }
  return name as string;
}
