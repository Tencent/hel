import * as baseUtilsMod from './base-utils/index';
import checkMod from './check';
import cstMod from './configs/consts';
import extractHelMetaJsonMod from './meta-extractor/index';
import createLibSubAppMod from './sub-app/createLibSubApp';
import createReactSubAppMod from './sub-app/createReactSubApp';
import createVue2SubAppMod from './sub-app/createVue2SubApp';
import createVue3SubAppMod from './sub-app/createVue3SubApp';

export const check = checkMod;
export const cst = cstMod;
export const baseUtils = baseUtilsMod;
export const createReactSubApp = createReactSubAppMod;
export const createVue3SubApp = createVue3SubAppMod;
export const createVue2SubApp = createVue2SubAppMod;
export const createLibSubApp = createLibSubAppMod;
export const extractHelMetaJson = extractHelMetaJsonMod;

export default {
  cst,
  check,
  baseUtils,
  createReactSubApp,
  createVue3SubApp,
  createVue2SubApp,
  createLibSubApp,
  extractHelMetaJson,
};
