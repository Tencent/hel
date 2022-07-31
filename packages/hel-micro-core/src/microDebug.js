import { getHelSingletonHost } from './utilBase';

/** @type {import('../index').IHelMicroDebug} */
let helMicroDebug = getHelSingletonHost().__HEL_MICRO_DEBUG__;

function makeHelMicroDebug() {
  return {
    allowLog: false,
  };
}

function ensureHelMicroDebug() {
  if (helMicroDebug) {
    return;
  }

  helMicroDebug = makeHelMicroDebug();
  getHelSingletonHost().__HEL_MICRO_DEBUG__ = helMicroDebug;
}

ensureHelMicroDebug();

export function getHelMicroDebug() {
  return helMicroDebug;
}
