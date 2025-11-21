const viewSymbol = Symbol('view');
const fileSymbol = Symbol('file');
const outputSymbol = Symbol('output');
const codeSymbol = Symbol('code');
const errCodeSymbol = Symbol('errCode');
const skipSymbol = Symbol('skip');
const jsonpSymbol = Symbol('jsonp');
const jsonpOutputSymbol = Symbol('jsonpOutput');

/**
 * 发送 views 目录下指定的模板文件给客户端
 * @param name
 * @param data
 * @param options
 * @returns
 */
export const view = (name, data, options) => ({ [viewSymbol]: { name, data, options } });

export const file = (path) => ({ [fileSymbol]: { path } });

/**
 * 自定义 code，然后系统包裹为 { data, code, msg } 格式后，以 json 形式发送给客户点
 * @param code
 * @param data
 * @param msg
 * @returns
 */
export const code = (code, data, msg) => ({ [codeSymbol]: { code, data, msg } });

/**
 * 默认错误码为 '-1'
 * @param msg
 * @returns
 */
export const errCode = (msg?: string) => ({ [errCodeSymbol]: { code: '-1', data: {}, msg: msg || '' } });

/**
 * 原封不动的将 data 以 json 形式发送给客户点
 * @returns
 */
export const output = (data) => ({ [outputSymbol]: data });

/**
 * 跳过后置处理流程，此时用户应该是在controller函数里手动调用了例如 ctx.res.end({...}) 返回了结果
 * @returns
 */
export const skip = () => ({ [skipSymbol]: 1 });

/**
 * 将 data 包裹为 { data, code, msg } 格式后，以 jsonp 形式发送给客户点
 * @returns
 */
export const jsonp = (data: any) => ({ [jsonpSymbol]: data });

/**
 * 原封不动的将 data 以 jsonp 形式发送给客户点
 * @returns
 */
export const jsonpOutput = (data: any) => ({ [jsonpOutputSymbol]: data });

/** 尝试提取包裹了 symbol 的原始逻辑返回结果 */
export const unboxRet = <T = any>(wrappedCtxData: any): T => {
  const symbols: symbol[] = [codeSymbol, outputSymbol, errCodeSymbol, jsonpSymbol, jsonpOutputSymbol];
  let result = null;
  for (let i = 0; i < symbols.length; i++) {
    const data = wrappedCtxData[symbols[i]];
    if (data) {
      result = data;
      break;
    }
  }
  return result || wrappedCtxData;
};

export const cst = {
  viewSymbol,
  fileSymbol,
  outputSymbol,
  codeSymbol,
  errCodeSymbol,
  skipSymbol,
  jsonpSymbol,
  jsonpOutputSymbol,
};
