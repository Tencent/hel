import * as diff from '../_diff/index';

/** @typedef {typeof diff.DEFAULT_PLAT} Plat */

/**
 * @type {{
 *  HEL_DIST_DIR: 'hel_dist',
 *  HEL_PROXY_DIR: 'hel_proxy',
 *  HEL_BUNDLE_DIR: 'hel_bundle',
 *  DEFAULT_PLAT: Plat,
 *  DEFAULT_NPM_CDN_TYPE: 'unpkg',
 *  PLUGIN_VER:string,
 * }}
 */
export default {
  HEL_DIST_DIR: 'hel_dist',
  HEL_PROXY_DIR: 'hel_proxy',
  HEL_BUNDLE_DIR: 'hel_bundle',
  DEFAULT_PLAT: diff.DEFAULT_PLAT,
  DEFAULT_NPM_CDN_TYPE: 'unpkg',
  PLUGIN_VER: diff.PLUGIN_VER,
};
