import * as baseUtils from './base-utils/index';
import check from './check';
import cst from './configs/consts';
import extractHelMetaJson from './meta-extractor/index';
import createLibSubApp from './sub-app/createLibSubApp';
import createReactSubApp from './sub-app/createReactSubApp';
import { createVue2SubApp, createVue3SubApp, createVueSubApp } from './sub-app/createVueSubApp';

export {
  check,
  cst,
  baseUtils,
  createReactSubApp,
  createVue2SubApp,
  createVue3SubApp,
  createVueSubApp,
  createLibSubApp,
  extractHelMetaJson,
};

export default {
  cst,
  check,
  baseUtils,
  createReactSubApp,
  createVue2SubApp,
  createVue3SubApp,
  createVueSubApp,
  createLibSubApp,
  extractHelMetaJson,
};
