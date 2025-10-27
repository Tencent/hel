/**
 * original version @see https://github.com/tj/co/blob/master/index.js
 */
export function isPromise(obj) {
  // return 'function' == typeof obj.then;
  return obj.constructor.name === 'AsyncFunction' || 'function' === typeof obj.then;
}

/**
 * Check if `obj` is a generator.
 *
 * @param {Mixed} obj
 * @return {Boolean}
 * @api private
 */

export function isGenerator(obj) {
  return 'function' === typeof obj.next && 'function' === typeof obj.throw;
}

/**
 * Check if `obj` is a generator function.
 *
 * @param {Mixed} obj
 * @return {Boolean}
 * @api private
 */
export function isGeneratorFunction(obj) {
  const { constructor } = obj;
  if (!constructor) return false;
  if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) return true;
  return exports.isGenerator(constructor.prototype);
}
