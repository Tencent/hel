import errCode from 'at/configs/errCode';
import { isHel } from 'at/utils/deploy';
import regs from 'at/utils/regs';
import { genNonceStr } from 'at/utils/str';
import { checkTimestamp } from 'at/utils/time-check';
import { ISubApp } from 'hel-types';
import { has } from 'lodash';
import * as appSrv from 'services/app';
import * as classInfoSrv from 'services/classInfo';

const { HEL_ERR_NONCE_INVALID } = errCode;

export function getNewToken(prefix: string) {
  return `${prefix}-${genNonceStr()}-${Date.now()}`;
}

export function fillSubAppForCreate(subApp: nsModel.SubAppInfoParsed) {
  const isHelPublicServer = isHel();
  const hasProp = (prop: string) => has(subApp, prop);
  const ensureTrueFalse = (prop: string, defaultVal = 0) => {
    if (hasProp(prop)) {
      subApp[prop] = subApp[prop] ? 1 : defaultVal;
    }
  };

  if (!hasProp('extract_mode')) {
    subApp.extract_mode = 'all';
  }
  if (!hasProp('class_key')) {
    subApp.class_key = '';
    subApp.class_name = '';
  }
  ensureTrueFalse('is_top');
  ensureTrueFalse('is_back_render');
  ensureTrueFalse('is_rich');
  ensureTrueFalse('enable_pipeline');
  ensureTrueFalse('is_test');
  ensureTrueFalse('is_local_render');
  ensureTrueFalse('is_in_gray');
  ensureTrueFalse('enable_build_to_online', 1);

  // 来自 openapi 调用
  if (!subApp.token) {
    const prefix = isHelPublicServer ? 'hel' : 'tnews';
    subApp.token = getNewToken(prefix);
  }
  if (!hasProp('platform')) {
    subApp.platform = isHelPublicServer ? 'hel' : 'tnews';
  }
}

export function checkNonce(nonce: any, serverNonce: any) {
  if (nonce !== serverNonce) {
    throw new HelError('nonce invalid', HEL_ERR_NONCE_INVALID);
  }
}

export async function checkApp(appName: string) {
  const app = await appSrv.getAppByName(appName);
  if (!app) {
    throw new Error(`app [${appName}] not exist`);
  }
  return app;
}

export async function getSDKRequestNonce(app: ISubApp, timestamp: number | string) {
  // @ts-ignore
  const classInfo = await classInfoSrv.getByKey(app.class_key, false);
  // 暂时规避可选链写法，容器环境还未支持
  const classToken = (classInfo || {}).class_token || '';
  const serverNonce = appSrv.signAppForSdk(app.name, classToken, timestamp);
  return serverNonce;
}

export function checkCommon(str: string, nonce: string, timestamp: string | number) {
  // 校验时间戳应当未超时
  checkTimestamp(timestamp);
  const serverNonce = appSrv.signStrCommon(str, timestamp);
  checkNonce(nonce, serverNonce);
}

export function checkAppName(name: string, label = 'sub_app_name') {
  if (!regs.versionIndexReg.test(name)) {
    const tipValid = 'it can only be a combination of these symbols(a~z, 0~9, -, _, @, /, .)';
    const tipValidDemos = 'valid demos: @xx-scope/xx-name (with scope), xx-name (without scope)';
    throw new Error(`name (${name}) is invalid, ${tipValid}, ${tipValidDemos}`);
  }

  const chars = name.split('');
  const atIdx = name.indexOf('@');
  const slashIdx = name.indexOf('/');
  const lastIdx = chars.length - 1;
  const slashCount = chars.filter((v) => v === '/').length;
  const atCount = chars.filter((v) => v === '@').length;
  if (
    // '/a/a'
    slashCount > 1
    // '@a@a'
    || atCount > 1
    // aa@a
    || (atCount === 1 && !name.startsWith('@'))
    // @aa
    || (atCount === 1 && name.startsWith('@') && slashCount === 0)
    // @/aa
    || (atCount === 1 && name.startsWith('@') && slashCount === 1 && slashIdx === atIdx + 1)
    // @aa/
    || (atCount === 1 && name.startsWith('@') && slashCount === 1 && slashIdx === lastIdx)
  ) {
    throw new Error(`${label} value (${name}) is invalid, valid demos: @xx-scope/xx-name (with scope), xx-name (without scope)`);
  }
}

export function checkCommonNonce(query) {
  const { timestamp, nonce } = query;
  checkTimestamp(timestamp);
  const serverNonce = appSrv.signCommon(timestamp);
  checkNonce(nonce, serverNonce);
}
