import { helConsts, logModeEnum } from './consts';
import { getGlobalThis } from './globalRef';
import { setLsItem } from './util';

const { LS_LOG_MODE, LS_LOG_FILTER } = helConsts;
const { NONE, LOG, TRACE } = logModeEnum;
ensureHelMicroDebug();

export const inner = {
  getLogMode() {
    return getHelMicroDebug().logMode;
  },
  setLogMode(value, memVal = true) {
    const modeNum = parseInt(value, 10);
    if ([NONE, LOG, TRACE].includes(modeNum)) {
      getHelMicroDebug().logMode = modeNum;
      memVal && setLsItem(LS_LOG_MODE, modeNum);
    }
  },
  setLogFilter(value, memVal = true) {
    getHelMicroDebug().logFilter = value;
    memVal && setLsItem(LS_LOG_FILTER, value);
  },
};

/** @type {import('../index').IHelMicroDebug} */
let helMicroDebug: any = {};

/**
 * @returns {import('../index').IHelMicroDebug}
 */
function makeHelMicroDebug() {
  return {
    logMode: NONE,
    logFilter: '',
    isInit: false,
  };
}

export function ensureHelMicroDebug() {
  helMicroDebug = getGlobalThis().__HEL_MICRO_DEBUG__;
  if (!helMicroDebug || JSON.stringify(helMicroDebug) === '{}') {
    helMicroDebug = makeHelMicroDebug();
    getGlobalThis().__HEL_MICRO_DEBUG__ = helMicroDebug;
  }
}

export function getHelMicroDebug() {
  return helMicroDebug;
}

export function allowLog() {
  return inner.getLogMode() !== NONE;
}

const logPrefix = '  %c--> HEL LOG:';
const colorDesc = 'color:#ad4e00;font-weight:600';
export function log(p1, p2, p3, p4) {
  if (!allowLog()) {
    return;
  }
  const logFn = inner.getLogMode() === LOG ? console.log : console.trace || console.log;
  if (typeof p1 !== 'string') {
    return logFn(logPrefix, colorDesc, p1, p2, p3, p4);
  }

  logFn(`${logPrefix} ${p1}`, colorDesc, p2, p3, p4);
}
