const viewSymbol = Symbol('view');
const fileSymbol = Symbol('file');
const outputSymbol = Symbol('output');
const codeSymbol = Symbol('code');
const skipSymbol = Symbol('skip');
const jsonpSymbol = Symbol('jsonp');
const jsonpCodeSymbol = Symbol('jsonpCode');
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
export const jsonp = (data: any) => ({ [jsonpSymbol]: data === undefined ? null : data });

/**
 * 将 data 包裹为 { data, code, msg } 格式后，以 jsonp 形式发送给客户点
 * 支持自定义 code msg
 * @returns
 */
export const jsonpCode = (data: any, code: any, msg?: string) => ({ [jsonpCodeSymbol]: { data, code, msg } });

/**
 * 原封不动的将 data 以 jsonp 形式发送给客户点
 * @returns
 */
export const jsonpOutput = (data: any) => ({ [jsonpOutputSymbol]: data === undefined ? null : data });

export const cst = {
  viewSymbol,
  fileSymbol,
  outputSymbol,
  codeSymbol,
  skipSymbol,
  jsonpSymbol,
  jsonpCodeSymbol,
  jsonpOutputSymbol,
};
