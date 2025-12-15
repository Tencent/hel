import { isLocal } from 'at/utils/deploy';
import express from 'express';
import use from './logicGateway';

const expressRouter = express.Router();

const METHODS = ['get', 'post', 'del', 'put', 'patch'] as const;
type TMethod = typeof METHODS[number];

/**
 * 将最后一个逻辑处理函数包裹为cute-express的回调处理形式
 * @param {*} logicFnWithMids
 */
function _warpLogicFn(logicFnWithMids) {
  const fns = logicFnWithMids.slice();
  const logicFnIdx = fns.length - 1;
  const logicFn = fns[logicFnIdx];
  fns[logicFnIdx] = use(logicFn);
  return fns;
}

function _checkLoginFn(method, logicFn, path = '') {
  if (!logicFn) {
    if (isLocal()) {
      return () => {};
    }
    throw new Error(`[routerFactory.${method}] ${path} need logicFn`);
  }
  return logicFn;
}

export function get(path, logicFn) {
  const fn = _checkLoginFn('get', logicFn, path);
  expressRouter.get(path, use(fn));
}

export function getm(path, ...logicFnWithMids) {
  expressRouter.get(path, ..._warpLogicFn(logicFnWithMids));
}

export function getHot(path, logicFnMaker) {
  if (!logicFnMaker) throw new Error(`[routerFactory.get] ${path} need logicFnMaker`);
  expressRouter.get(path, (req, res) => {
    const logicFn = logicFnMaker();
    return use(logicFn, { req, res });
  });
}

export function put(path, logicFn) {
  const fn = _checkLoginFn('put', logicFn);
  expressRouter.put(path, use(fn));
}

export function putm(path, ...logicFnWithMids) {
  expressRouter.put(path, ..._warpLogicFn(logicFnWithMids));
}

export function post(path, logicFn) {
  const fn = _checkLoginFn('post', logicFn);
  expressRouter.post(path, use(fn));
}

export function postm(path, ...logicFnWithMids) {
  expressRouter.post(path, ..._warpLogicFn(logicFnWithMids));
}

export function del(path, logicFn) {
  const fn = _checkLoginFn('del', logicFn);
  expressRouter.delete(path, use(fn));
}

export function delm(path, ...logicFnWithMids) {
  expressRouter.delete(path, ..._warpLogicFn(logicFnWithMids));
}

export function patch(path, logicFn) {
  const fn = _checkLoginFn('patch', logicFn);
  expressRouter.patch(path, use(fn));
}

export function patchm(path, ...logicFnWithMids) {
  expressRouter.patch(path, ..._warpLogicFn(logicFnWithMids));
}

/**
 * 如果逻辑模块是一个函数，则自动将此函数映射为 get post put patch delete 方法的公共处理函数
 * 如果逻辑模块是一个对象，则尝试提取对象里的存在的get post put patch delete属性来映射各自的处理函数
 */
export function restful(path: string, logicModule: Function | { [key in TMethod]?: Function }, options: any = {}) {
  const methods = options.methods || METHODS;
  const middlewares = options.mids || [];

  const isLogicModuleFn = typeof logicModule === 'function';
  methods.forEach((m) => {
    const handler = isLogicModuleFn ? logicModule : logicModule[m];
    if (handler && typeof handler === 'function') {
      middlewares.push(handler);
      // 调用当前模块内部的 get post put patch del 方法映射路由
      module.exports[m](path, ...middlewares);
    }
  });
}

export const router = expressRouter;
