import * as baseUtils from './base-utils/index';
import check from './check';
import cst from './configs/consts';
import createLibSubApp from './sub-app/createLibSubApp';
import createReactSubApp from './sub-app/createReactSubApp';
import { createVue2SubApp, createVue3SubApp, createVueSubApp } from './sub-app/createVueSubApp';

export { check, cst, baseUtils, createReactSubApp, createVue2SubApp, createVue3SubApp, createVueSubApp, createLibSubApp };

export default {
  cst,
  check,
  baseUtils,
  createReactSubApp,
  createVue2SubApp,
  createVue3SubApp,
  createVueSubApp,
  createLibSubApp,
};
