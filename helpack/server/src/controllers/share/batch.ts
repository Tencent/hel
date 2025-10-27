import { ICuteExpressCtx } from 'at/types';

export function makeCtxList(ctx: ICuteExpressCtx) {
  const ctxList: ICuteExpressCtx[] = [];
  const { name, version = '', projId = '' } = ctx.query;
  const nameList = name.split(',');
  const versionList = version.split(',');
  const projIdList = projId.split(',');
  if (nameList.length > 8) {
    throw new Error(`batch get only support 8 names at most`);
  }

  nameList.forEach((name, idx) => {
    const ctxCopy = { ...ctx };
    ctxCopy.query = { ...ctxCopy.query };
    ctxCopy.query.name = name;
    ctxCopy.query.version = versionList[idx] || '';
    ctxCopy.query.projId = projIdList[idx] || '';
    ctxList.push(ctxCopy);
  });

  return ctxList;
}
