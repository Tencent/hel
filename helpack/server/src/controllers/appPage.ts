import { TController } from 'at/types';
import regs from 'at/utils/regs';
import { toVersionIndex } from 'controllers/share/version';
import xss from 'xss-filters';

const verMaxLen = 120;

/**
 * 加载子应用
 */
export const loadSubApp: TController = async (ctx) => {
  const { params, query } = ctx;
  const { scope, appName } = params;
  let queryVerTag = query.version || query.ver || '';
  queryVerTag = xss.inHTMLData(queryVerTag);

  if (queryVerTag && (queryVerTag.length > verMaxLen || !regs.versionTagReg.test(queryVerTag))) {
    return ctx.view('sub-app-render-err', { msg: `version ${queryVerTag} invalid` });
  }

  const helAppName = scope ? `${scope}/${appName}` : appName;

  const subApp = await ctx.services.app.getAppByName(helAppName);
  if (!subApp) {
    return ctx.view('sub-app-render-err', { msg: `应用 ${helAppName} 不存在` });
  }

  const versionTag = queryVerTag || subApp.online_version || subApp.build_version;
  if (!versionTag) {
    return ctx.view('sub-app-render-err', { msg: `应用 ${helAppName} 未发布` });
  }

  const versionIndex = toVersionIndex(helAppName, versionTag);
  const subAppVersion = await ctx.services.app.querySubAppVersionByVerId(versionIndex);
  if (!subAppVersion) {
    return ctx.view('sub-app-render-err', { msg: `版本 ${queryVerTag} 数据不存在` });
  }

  let htmlContent = subAppVersion.html_content;
  htmlContent = htmlContent.replace('manifest.json">', 'manifest.json" crossorigin="anonymous">');

  return ctx.view('sub-app', { htmlContent });
};
