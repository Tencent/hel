/** @typedef {import('typings').ICreateSubAppOptions} ICreateSubAppOptions */
import createSubApp from '../share/createSubApp';

/**
 * 
 * @param {Record<string, any>} pkg
 * @param {ICreateSubAppOptions} [options] 
 * @returns 
 */
export default function createVue2SubApp(pkg, options) {
  return createSubApp(pkg, { frameworkType: 'vue2' }, options);
}
