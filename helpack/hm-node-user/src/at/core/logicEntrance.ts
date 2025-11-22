/**
 * 所有业务逻辑函数的出入口,
 * 统一包装请求payload
 * 统一处理返回数据
 */
import { Request, Response } from 'express';
import xss from 'xss-filters';
import * as logger from '../../services/logger';
import { ICuteExpressCtxBase } from '../types/index';
import { getContainerId } from '../utils/deploy';
import { code, cst, errCode, file, jsonp, jsonpOutput, output, skip, view } from './responseHelper';

const { viewSymbol, fileSymbol, outputSymbol, codeSymbol, skipSymbol, jsonpSymbol, jsonpOutputSymbol, errCodeSymbol } = cst;

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
    'xc-container-id': getContainerId(),
    'xc-fn-time': fnTime,
    'xc-stringify-time': stringifyTime,
  });
  return toReturn;
}

/** 结果响应 */
function resSend(res: Response, sendData: any, fnStart: number) {
  const dataStr = attachMeasureData(res, sendData, fnStart, true);
  res.send(dataStr);
}

/** 标准化输出结果 */
function standardOutput(data = {}, options?: any) {
  const { msg = '', code = '0' } = options || {};
  const toReturn = { data, msg, code };
  return toReturn;
}

/** 分析并处理业务层返回结果 */
function handleResult(res: Response, ret: any, start: number) {
  if (ret === null || ret === undefined) {
    resSend(res, standardOutput(), start);
    return;
  }

  // 处理 ctx.code 返回数据
  const codeWrap = ret[codeSymbol] || ret[errCodeSymbol];
  if (codeWrap) {
    const { data, msg, code } = codeWrap;
    resSend(res, standardOutput(data, { msg, code }), start); // send customized code to client
    return;
  }

  // 处理 ctx.jsonp 返回数据
  const jsonpData = ret[jsonpSymbol];
  if (jsonpData !== undefined) {
    const sendData = attachMeasureData(res, standardOutput(jsonpData), start);
    res.jsonp(sendData);
    return;
  }

  // 处理 ctx.jsonpOutput 返回数据，表示不做任何包裹，以 jsonp 形式直接返回前端业务层返回的数据
  const jsonpOutputData = ret[jsonpOutputSymbol];
  if (jsonpOutputData) {
    const sendData = attachMeasureData(res, jsonpOutputData, start);
    res.jsonp(sendData);
    return;
  }

  // 使用 ctx.skip 人工标记了不做任何处理
  const skip = ret[skipSymbol];
  if (skip) {
    // do nothing
    return;
  }

  // 处理 ctx.file 返回数据，表示触发文件下载
  const file = ret[fileSymbol];
  if (file) {
    res.sendFile(file.path, file.options, (err) => {
      if (err) {
        const req = res.req;
        logger.error({
          msg: err.message,
          source: 'res.sendFile error',
          url: req.url,
          method: req.method,
          body: req.body,
          error: err,
        });
      }
    });
    return;
  }

  // 处理 ctx.view 返回数据，表示渲染模板
  const view = ret[viewSymbol];
  if (view) {
    const { name, data, options = {} } = view;
    options.data = data; // adapt to express-handlebars input shape
    attachMeasureData(res, {}, start);
    res.render(name, options);
    return;
  }

  // 处理 ctx.output 返回数据，表示不做任何包裹，直接返回前端业务层返回的数据
  const output = ret[outputSymbol];
  if (output) {
    resSend(res, output, start); // send original data to client
    return;
  }

  // 兜底返回
  resSend(res, standardOutput(ret), start);
}

/** 处理业务侧 controller 函数的错误 */
function handleError(res, err, ctx: ICuteExpressCtxBase, start: number) {
  const msg = err.message || err;
  logger.error({
    msg,
    source: 'handleError',
    url: ctx.req.url,
    method: ctx.req.method,
    body: ctx.body,
    error: err,
  });
  const errCode = err.code || '-1';
  attachMeasureData(res, {}, start);
  res.status(ctx.httpErrorStatus).send(standardOutput({}, { msg, code: errCode }));
}

/** 预防 xss 攻击 */
function handleXss(ctx: ICuteExpressCtxBase) {
  try {
    const { query = {} } = ctx;
    Object.keys(query).forEach((key) => {
      query[key] = xss.inHTMLData(query[key]);
    });
  } catch (err) {
    logger.error({
      msg: 'handleXss error',
      source: 'handleXss',
      url: ctx.req.url,
      method: ctx.req.method,
      body: ctx.body,
      error: err,
    });
  }
}

/**
 * 执行路由匹配的目标业务逻辑函数
 */
export function executeLogicFn(fn, options: { req: Request; res: Response; httpErrorStatus?: number }) {
  const { req, res, httpErrorStatus = 200 } = options;
  if (typeof fn !== 'function') {
    throw new Error('target controller is not a function');
  }
  const start = Date.now();
  const { query, params, body } = req;

  // 将view, file, code, output等响应助手函数穿透给ctx，方便用户直接使用
  // httpErrorStatus：当业务逻辑层出现错误时响应的状态码，默认200，支持在controller里重新赋值
  const ctx = {
    httpErrorStatus,
    jsonp,
    jsonpOutput,
    query,
    params,
    body,
    view,
    file,
    code,
    errCode,
    output,
    skip,
    req,
    res,
  };
  handleXss(ctx);

  // 开始执行路由匹配的 controller 业务层逻辑函数
  Promise.resolve(fn(ctx))
    .then((ret) => {
      handleResult(res, ret, start);
    })
    .catch((err) => {
      handleError(res, err, ctx, start);
    });
}

/**
 * 暴露为 thunk 函数，方便对接 expressRouter
 * ```ts
 *  expressRouter.get(path, useExecuteLogicFn(logicFn));
 * ```
 */
export function useExecuteLogicFn(fn: any) {
  return (req: Request, res: Response) => executeLogicFn(fn, { req, res });
}
