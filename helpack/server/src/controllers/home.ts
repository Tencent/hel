import { MIXED_KEY } from 'at/configs/biz';
import { getAdminUsers, getSignSecStr } from 'at/configs/rainbowConf';
import type { ICuteExpressCtxBase } from 'at/types';
import { getAppName, isLocal, isSimpleServer } from 'at/utils/deploy';
import * as cryptojs from 'crypto-js';
import { statSrv } from 'services/stat';
import * as appCtrl from './app';

function injectAdminUsers(html: string) {
  const users = getAdminUsers();
  const adminsStr = `window.__HELPACK_ADMINS__=${JSON.stringify(users)};`;

  // 设置加密选项
  const options = {
    mode: cryptojs.mode.ECB, // 使用ECB模式
    padding: cryptojs.pad.Pkcs7, // 使用Pkcs7填充方式
  };
  const rawSecStr = getSignSecStr();
  const key = MIXED_KEY.replace('x', '').replace('y', '').replace('z', '');
  const encryptedSec = cryptojs.AES.encrypt(rawSecStr, key, options).toString();
  const secStr = `window.__HELPACK_SECSTR__="${encryptedSec}";`;

  const newHtml = html.replace('<script id="HelPackDataSlot"></script>', `<script id="HelPackDataSlot">${adminsStr}${secStr}</script>`);
  return newHtml;
}

/**
 * tnews 主页渲染逻辑如果出现任何异常，则用项目里提前编译好的的index.html兜底
 */
export default async (ctx: ICuteExpressCtxBase) => {
  if (isSimpleServer()) {
    return 'hi simple server';
  }

  const { view, output, req } = ctx;
  const ua = req.header('user-agent') || '';
  // 是健康检查
  if (ua.includes('healthcheck')) {
    return output({ key: 'hi check' });
  }

  if (isLocal()) {
    return view('index');
  }

  const userName = ctx.pipes.getRtxName();
  ctx.query.name = ctx.query.hubname || getAppName();
  statSrv.incVisitHome(userName);
  try {
    const ret = await appCtrl.getSubAppAndItsFullVersion(ctx);
    let html = '';
    if (ret && ret.version) {
      html = ret.version.html_content || '';
    }
    if (!html) {
      return view('index');
    }
    if (ctx.query.dev === '1' && html.includes('react.js')) {
      html = html.replace('react.js', 'react.dev.js');
    }

    html = injectAdminUsers(html);
    return view('dynamic-index', { html });
  } catch (err) {
    return view('index');
  }
};
