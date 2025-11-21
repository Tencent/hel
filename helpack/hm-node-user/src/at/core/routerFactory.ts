import * as express from 'express';
import { useExecuteLogicFn as use } from './logicEntrance';

const expressRouter = express.Router();

const METHODS = ['get', 'post', 'del', 'put', 'patch'];
/** @typedef {'get'|'post'|'del'|'put'|'patch'} TMethod */

function checkLoginFn(method, logicFn) {
  if (!logicFn) throw new Error(`[routerFactory.${method}] need logicFn`);
}

export function get(path, logicFn) {
  checkLoginFn('get', logicFn);
  expressRouter.get(path, use(logicFn));
}

export function put(path, logicFn) {
  checkLoginFn('put', logicFn);
  expressRouter.put(path, use(logicFn));
}

export function post(path, logicFn) {
  checkLoginFn('post', logicFn);
  expressRouter.post(path, use(logicFn));
}

export function del(path, logicFn) {
  checkLoginFn('del', logicFn);
  expressRouter.delete(path, use(logicFn));
}

export function patch(path, logicFn) {
  checkLoginFn('patch', logicFn);
  expressRouter.patch(path, use(logicFn));
}

/**
 *
 * 如果逻辑模块是一个函数，则自动将此函数映射为 get post put patch del 方法的处理函数
 * 如果逻辑模块是一个对象，则尝试提取对象里的存在的get post put patch del 属性来映射各自的处理函数
 * @param {string} path
 * @param {Function | {[key in TMethod]?:Function} } logicModule
 * @param {{methods:Array<TMethod>, mid:Array<Function>}} [options]
 * @param {Array<TMethod>} [options.method=METHODS] 当逻辑模块为对象时，读取的方法名称
 */
export function restful(path, logicModule, options: any = {}) {
  const methods = options.methods || METHODS;
  const middlewares = options.mids || [];

  const isLogicModuleFn = typeof logicModule === 'function';
  methods.forEach((m) => {
    const handler = isLogicModuleFn ? logicModule : logicModule[m];
    if (handler) {
      middlewares.push(handler);
      module.exports[m](path, ...middlewares);
    }
  });
}

/**
 * 获取 router 实例
 */
export function getRouter() {
  return expressRouter;
}
