/** @typedef {import('../../typings').ICreateSubAppOptions} ICreateSubAppOptions */
import createSubApp from '../share/createSubApp';

/**
 * @deprecated
 * 创建 vue2 应用的描述对象，可使用 createVueSubApp 替代
 * 该接口为历史遗留接口，仅为保持兼容性而保留，目前看来 2 和 3 映射的 externals 无区别
 * @param {Record<string, any>} pkg
 * @param {ICreateSubAppOptions} [options]
 * @returns
 */
export function createVue2SubApp(pkg, options) {
  return createSubApp(pkg, { frameworkType: 'vue2' }, options);
}

/**
 * @deprecated
 * 创建 vue3 应用的描述对象，可使用 createVueSubApp 替代
 * 该接口为历史遗留接口，仅为保持兼容性而保留，目前看来 2 和 3 映射的 externals 无区别
 * @param {Record<string, any>} pkg
 * @param {ICreateSubAppOptions} [options]
 * @returns
 */
export function createVue3SubApp(pkg, options) {
  return createSubApp(pkg, { frameworkType: 'vue3' }, options);
}

/**
 * 创建 vue 应用的描述对象
 * @param {Record<string, any>} pkg
 * @param {ICreateSubAppOptions} [options]
 * @returns
 */
export function createVueSubApp(pkg, options) {
  return createSubApp(pkg, { frameworkType: 'vue' }, options);
}
