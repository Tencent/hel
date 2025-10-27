/**
 * 所有业务逻辑函数的出入口,
 * 统一包装请求payload
 * 统一处理返回数据
 */
import { getServerEnv } from 'at/utils/deploy';
import { Request, Response } from 'express';
import services from '../../services';
import { default as dao, default as daoV2 } from '../dao';
import * as pipes from '../pipes';
import { code, cst, file, jsonp, jsonpCode, jsonpOutput, output, skip, view } from './replyHelper';

const { env, workerID, containerName } = getServerEnv();
const helEnv = `${env}-${containerName}-${workerID}`;

const { viewSymbol, fileSymbol, outputSymbol, codeSymbol, skipSymbol, jsonpSymbol, jsonpCodeSymbol, jsonpOutputSymbol } = cst;

let seg = 0;
let num = 0;
/** 标记 hel api 访问次数 */
function getHelVisit() {
  num += 1;
  if (num === Number.MAX_SAFE_INTEGER) {
    seg += 1;
    num = 1;
  }
  const mark = `${seg}_${num}`;
  return mark;
}

/** 附加上性能度量数据到 header 里 */
function attachMeasureData(res: Response, sendData: any, fnStart: number, needStringify?: boolean) {
  const stringifyStart = Date.now();
  const fnTime = stringifyStart - fnStart;
  let toReturn = sendData;
  let stringifyTime = 0;
  if (needStringify) {
    toReturn = JSON.stringify(sendData);
    stringifyTime = Date.now() - stringifyStart;
  }
  /** 前端可通过这三个header key 查看请求打到了哪个容器、函数执行耗时、序列化耗时 */
  res.set({
    'Hel-Env': helEnv,
    'Hel-Fn': fnTime,
    'Hel-Strfy': stringifyTime,
    'Hel-V': getHelVisit(),
  });
  return toReturn;
}

function resSend(res: Response, sendData: any, fnStart: number) {
  const dataStr = attachMeasureData(res, sendData, fnStart, true);
  res.send(dataStr);
}

function standardOutput(data = {}, msg = '', code = '0') {
  return { data, msg, code };
}

function handleResult(res: Response, ret: any, start: number) {
  if (ret === null || ret === undefined) {
    resSend(res, standardOutput(), start);
    return;
  }

  const jsonpData = ret[jsonpSymbol];
  if (jsonpData !== undefined) {
    const sendData = attachMeasureData(res, standardOutput(jsonpData), start);
    res.jsonp(sendData);
    return;
  }

  const jsonpCodeWrap = ret[jsonpCodeSymbol];
  if (jsonpCodeWrap) {
    const { data, code, msg } = jsonpCodeWrap;
    const sendData = attachMeasureData(res, standardOutput(data, msg, code), start);
    res.jsonp(sendData);
    return;
  }

  const jsonpOutputData = ret[jsonpOutputSymbol];
  if (jsonpOutputData !== undefined) {
    const sendData = attachMeasureData(res, jsonpOutputData, start);
    res.jsonp(sendData);
    return;
  }

  const skip = ret[skipSymbol];
  if (skip) {
    // do nothing
    return;
  }

  const file = ret[fileSymbol];
  if (file) {
    res.sendFile(file.path, file.options, (err) => {
      if (err) {
        console.log(err); // todo, record error log
      }
    });
    return;
  }

  const view = ret[viewSymbol];
  if (view) {
    const { name, data, options = {} } = view;
    options.data = data; // adapt to express-handlebars input shape
    attachMeasureData(res, {}, start);
    res.header('Content-Type', 'text/html; charset=utf-8');
    res.render(name, options);
    return;
  }

  const output = ret[outputSymbol];
  if (output) {
    resSend(res, output, start); // send original data to client
    return;
  }

  const codeWrap = ret[codeSymbol];
  if (codeWrap) {
    const { data, msg, code } = codeWrap;
    resSend(res, standardOutput(data, msg, code), start); // send customized code to client
    return;
  }

  // 兜底返回
  resSend(res, standardOutput(ret), start);
}

function isLocalHost(req) {
  const host = req.headers.host;
  // 暂时这样判断
  return host.includes('localhost') || host.includes('127.0.0.1');
}

function handleError(res: Response, err, httpErrorStatus, start: number) {
  const originalUrl = res.req?.originalUrl || '';
  const user = pipes.getRtxName(res.req);
  console.log(`error occurred while user ${user} call ${originalUrl}:`, err);
  const msg = err.message || err;
  const code = err.code || '-1';
  attachMeasureData(res, {}, start);
  res.status(httpErrorStatus).send(standardOutput({}, msg, code));
}

async function tryMock(req, res, fn, ctx) {
  let isMockSuccess = false;
  try {
    if (isLocalHost(req)) {
      const fnName = fn.__fnName__;
      const modName = fn.__modName__;
      // @ts-ignore
      const mockMod = await import(`../../controllers/__mymock__/${modName}`);
      const start = Date.now();
      const ret = mockMod[fnName](ctx);
      handleResult(res, ret, start);
      isMockSuccess = true;
    }
  } catch (err) {
    // pass
    console.error('Logic error detected! see details:');
    console.error(err);
  }
  return isMockSuccess;
}

export function executeLogicFn(fn, options: { req: Request; res: Response; httpErrorStatus?: number }) {
  if (typeof fn !== 'function') {
    throw new Error('target controller is not a function');
  }
  const { req, res, httpErrorStatus = 200 } = options;
  const start = Date.now();
  const { query, params, body } = req;
  const proxyPipes = new Proxy(pipes, {
    get(target, key) {
      const pipeFn = target[key];
      return (userPayload) => pipeFn(req, userPayload);
    },
  });
  const midData: xc.Dict = {};
  const setQueryValue = (key: string, value: any) => (query[key] = value);

  // 将view, file, code, output等响应助手函数穿透给ctx，方便用户直接使用
  // httpErrorStatus：当业务逻辑层出现错误时响应的状态码，默认200，支持在controller里重新赋值
  const ctx = {
    query,
    params,
    body,
    req,
    res,
    midData,
    view,
    file,
    code,
    output,
    jsonp,
    jsonpCode,
    jsonpOutput,
    skip,
    httpErrorStatus,
    services,
    pipes: proxyPipes,
    dao,
    daoV2,
    setQueryValue,
  };

  Promise.resolve(fn(ctx))
    .then((ret) => {
      handleResult(res, ret, start);
    })
    .catch((err) => {
      tryMock(req, res, fn, ctx).then((mockSuccess) => {
        if (!mockSuccess) handleError(res, err, ctx.httpErrorStatus, start);
      });
    });
}

// httpErrorStatus
export default (fn, options: any = {}): any => {
  if (options.req) {
    executeLogicFn(fn, options);
  } else {
    return (req, res) => executeLogicFn(fn, { req, res });
  }
};
