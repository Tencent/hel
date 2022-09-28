/** @typedef {import('typings').ICreateSubAppOptions} ICreateSubAppOptions */
import createSubApp from '../share/createSubApp';

/**
 *
 * @param {Record<string, any>} pkg
 * @param {ICreateSubAppOptions} [options]
 * @returns
 */
export default function createLibSubApp(pkg, options) {
  return createSubApp(pkg, { frameworkType: 'lib' }, options);
}
