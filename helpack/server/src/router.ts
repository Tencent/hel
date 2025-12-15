/**
 * 集中式的把所有逻辑的路由定义在此文件里，在 at/core/app.ts 文件里会被载入
 */
import { get, post, put } from 'at/core/routerFactory';
import { isLocal, isSimpleServer } from 'at/utils/deploy';
import * as allowedApp from 'controllers/allowedApp';
import * as appPage from 'controllers/appPage';
import * as appSimpleCtrl from 'controllers/appSimple';
import * as classInfo from 'controllers/classInfo';
import * as helperCtrl from 'controllers/helper';
import * as hmnCtrl from 'controllers/hmn';
import * as plugin from 'controllers/plugin';
import * as sdk from 'controllers/sdk';
import * as userCtrl from 'controllers/user';
import markMethod from './at/core/markControllerMethod';

import * as app from 'controllers/app';
import * as appVersion from 'controllers/appVersion';
import * as localCtrl from 'controllers/local';

let appCtrl = app;
let hmn = hmnCtrl;
let appVersionCtrl = appVersion;

// 标记 IS_LOCAL 时，连接自己定制的 local 接口调试前端ui
if (isLocal()) {
  // @ts-ignore
  appCtrl = localCtrl.app;
  appVersionCtrl = localCtrl.appVersion;
  hmn = localCtrl.hmn;
}

// for localhost mock
markMethod([{ name: 'app', mod: appCtrl }]);

get('/api/helper/allowApps', helperCtrl.allowApps);
get('/api/helper/allowAppsV2', helperCtrl.allowAppsV2);
get('/api/helper/runningLogs', helperCtrl.runningLogs);
get('/api/helper/getStat', helperCtrl.getStat);
get('/api/helper/seeLocalCache', helperCtrl.seeLocalCache);
get('/api/helper/seeRemoteCache', helperCtrl.seeRemoteCache);

if (isSimpleServer()) {
  // ****** 定义服务于外网的接口 ******
  get('/openapi/out', () => 'hello simple server'); // 测试简单服务是否生效
  get('/openapi/v1/app/info/getSubAppVersion', appSimpleCtrl.getSubAppVersionForSimple);
  get('/openapi/v1/app/info/getSubAppAndItsVersion', appSimpleCtrl.getSubAppAndItsVersionForSimple);
  get('/openapi/v1/app/info/getSubAppAndItsFullVersion', appSimpleCtrl.getSubAppAndItsFullVersionForSimple);
  // batch 支持
  get('/openapi/v1/app/info/batchGetSubAppAndItsVersion', appSimpleCtrl.batchGetSubAppAndItsVersionForSimple);
  get('/openapi/v1/app/info/batchGetSubAppAndItsFullVersion', appSimpleCtrl.batchGetSubAppAndItsFullVersionForSimple);
  // 新增 jsonp 支持
  get('/openapi/v1/app/info/getSubAppVersionJsonp', appSimpleCtrl.getSubAppVersionJsonpForSimple);
  get('/openapi/v1/app/info/getSubAppAndItsVersionJsonp', appSimpleCtrl.getSubAppAndItsVersionJsonpForSimple);
  get('/openapi/v1/app/info/getSubAppAndItsFullVersionJsonp', appSimpleCtrl.getSubAppAndItsFullVersionJsonpForSimple);
  // 新增 jsonp batch 支持
  get('/openapi/v1/app/info/batchGetSubAppAndItsVersionJsonp', appSimpleCtrl.batchGetSubAppAndItsVersionJsonpForSimple);
  get('/openapi/v1/app/info/batchGetSubAppAndItsFullVersionJsonp', appSimpleCtrl.batchGetSubAppAndItsFullVersionJsonpForSimple);
  // 新版获取 meta 接口，简化了路径长度，更贴近类似 unpkg cdn 的链接格式
  get('/openapi/meta/:scope/:versionIndex', appSimpleCtrl.getMeta);
  get('/openapi/meta/:versionIndex', appSimpleCtrl.getMeta);
  // 只出 html，以 text/html 格式返回
  get('/openapi/html/:scope/:versionIndex', appSimpleCtrl.getHtml);
  put('/openapi/html/:scope/:versionIndex', appSimpleCtrl.getHtml);
  get('/openapi/html/:versionIndex', appSimpleCtrl.getHtml);
  put('/openapi/html/:versionIndex', appSimpleCtrl.getHtml);
} else {
  // ****** 定义服务于内网的接口 ******
  get('/page/:appName', appPage.loadSubApp);
  put('/page/:appName', appPage.loadSubApp);
  get('/page/:scope/:appName', appPage.loadSubApp);
  put('/page/:scope/:appName', appPage.loadSubApp);

  // 只出 html，以 text/html 格式返回
  get('/openapi/html/:scope/:versionIndex', appCtrl.getHtml);
  put('/openapi/html/:scope/:versionIndex', appCtrl.getHtml);
  get('/openapi/html/:versionIndex', appCtrl.getHtml);
  put('/openapi/html/:versionIndex', appCtrl.getHtml);

  // openapi 已加入智能网关的免登陆策略
  get('/openapi/v1/app/info/getSubAppVersion', appCtrl.getSubAppVersionNormal);
  get('/openapi/v1/app/info/getSubAppAndItsVersion', appCtrl.getSubAppAndItsVersion);
  get('/openapi/v1/app/info/getSubAppAndItsFullVersion', appCtrl.getSubAppAndItsFullVersion);
  // 新版获取 meta 接口，简化了路径长度，符合类 unpkg cdn 链接的格式标准
  get('/openapi/meta/:scope/:versionIndex', appCtrl.getMeta);
  get('/openapi/meta/:versionIndex', appCtrl.getMeta);
  // batch 支持
  get('/openapi/v1/app/info/batchGetSubAppAndItsVersion', appCtrl.batchGetSubAppAndItsVersion);
  get('/openapi/v1/app/info/batchGetSubAppAndItsFullVersion', appCtrl.batchGetSubAppAndItsFullVersion);
  // 新增 jsonp 支持
  get('/openapi/v1/app/info/getSubAppVersionJsonp', appCtrl.getSubAppVersionJsonp);
  get('/openapi/v1/app/info/getSubAppAndItsVersionJsonp', appCtrl.getSubAppAndItsVersionJsonp);
  get('/openapi/v1/app/info/getSubAppAndItsFullVersionJsonp', appCtrl.getSubAppAndItsFullVersionJsonp);
  // 新增 jsonp batch 支持
  get('/openapi/v1/app/info/batchGetSubAppAndItsVersionJsonp', appCtrl.batchGetSubAppAndItsVersionJsonp);
  get('/openapi/v1/app/info/batchGetSubAppAndItsFullVersionJsonp', appCtrl.batchGetSubAppAndItsFullVersionJsonp);
  // helpack-js-sdk 相关接口
  post('/openapi/v1/sdk/createSubApp', sdk.createSubApp);
  post('/openapi/v1/sdk/updateSubApp', sdk.updateSubApp);
  post('/openapi/v1/sdk/getSubApp', sdk.getSubApp);
  post('/openapi/v1/sdk/addVersion', sdk.addVersion);
  post('/openapi/v1/sdk/queryBackupAssetsProgress', sdk.queryBackupAssetsProgress);
  post('/openapi/v1/sdk/getVersion', sdk.getVersion);
  post('/openapi/v1/sdk/getVersionList', sdk.getVersionList);
  // 分类相关接口
  get('/api/v1/classInfo/list', classInfo.getClassInfoList);
  post('/api/v1/classInfo/create', classInfo.createClassInfo);
  post('/api/v1/classInfo/update', classInfo.updateClassInfo);
  get('/api/v1/classInfo/getFull', classInfo.getFullClassInfoById);
  // hel-micro-node sdk相关接口
  get('/openapi/v1/hmn/ping', hmn.ping);
  get('/openapi/v1/hmn/getHmnApiParams', hmn.getHmnApiParams);
  post('/openapi/v1/hmn/reportHelModStat', hmn.reportHelModStat);
  // 获取 hmn 相关统计的接口
  post('/api/v1/hmn/statList', hmn.getStatList);
  post('/api/v1/hmn/statLogList', hmn.getStatLogList);

  get('/api/v1/app/info/combine3api', appCtrl.combine3api);
  get('/api/v1/app/info/querySubApps', appCtrl.querySubApps);
  post('/api/v1/app/info/querySubApps', appCtrl.querySubApps);
  get('/api/v1/app/info/getSubApp', appCtrl.getSubApp);
  get('/api/v1/app/info/getSubAppToken', appCtrl.getSubAppToken);
  get('/api/v1/app/info/getSubAppVersion', appCtrl.getSubAppVersion);
  get('/api/v1/app/info/getSubAppAndItsVersion', appCtrl.getSubAppAndItsVersion);
  get('/api/v1/app/info/updateUserStarApp', appCtrl.updateUserStarApp);
  get('/api/v1/app/info/updateUserVisitApp', appCtrl.updateUserVisitApp);
  get('/api/v1/app/info/delUserVisitApp', appCtrl.delUserVisitApp);
  post('/api/v1/app/info/createSubApp', appCtrl.createSubApp);
  post('/api/v1/app/info/updateSubApp', appCtrl.updateSubApp);
  // 版本标记相关接口（获取应用个人标记信息已包含在 combine3api 里，下面不再单独实现）
  post('/api/v1/app/info/updateAppGlobalMarkInfo', appCtrl.updateAppGlobalMarkInfo);
  post('/api/v1/app/info/delAppGlobalMarkInfo', appCtrl.delAppGlobalMarkInfo);
  get('/api/v1/app/info/getAppGlobalData', appCtrl.getAppGlobalData);
  post('/api/v1/app/info/updateAppUserMarkInfo', appCtrl.updateAppUserMarkInfo);
  post('/api/v1/app/info/delAppUserMarkInfo', appCtrl.delAppUserMarkInfo);
  post('/api/v1/app/info/resetAppInfoCache', appCtrl.resetAppInfoCache);

  post('/api/v1/app/version/getSubAppVersionListByName', appVersionCtrl.getSubAppVersionListByName);
  post('/api/v1/app/version/countSubAppVersionListByName', appVersionCtrl.countSubAppVersionListByName);
  post('/api/v1/app/version/getSubAppVersionListByVers', appVersionCtrl.getSubAppVersionListByVers);
  post('/api/v1/app/version/resetVerCache', appVersionCtrl.resetVerCache);

  // devop平台插件使用的api
  get('/api/openApi/plugin/getAppByName', plugin.getAppByName);
  post('/api/openApi/plugin/getAppByNameAndClass', plugin.getAppByNameAndClass);
  get('/api/openApi/plugin/getCos', plugin.getCos);
  post('/api/openApi/plugin/updateApp', plugin.updateApp);
  post('/api/openApi/plugin/addAppVersion', plugin.addAppVersion);
  post('/api/openApi/plugin/addCosUploadLog', plugin.addCosUploadLog);
  get('/api/openApi/plugin/getCommonSignSec', plugin.getCommonSignSec);
  get('/api/openApi/plugin/getIsVersionExist', plugin.getIsVersionExist);

  // rtx服务相关
  get('/api/user/getAllUsers', userCtrl.getAllUsers);
  get('/api/user/getUserCount', userCtrl.getUserCount);
  get('/api/user/getUser', userCtrl.getUser);
  get('/api/user/getUsers', userCtrl.getUsers);
  get('/api/user/searchUser', userCtrl.searchUser);
  get('/api/user/searchUserV2', userCtrl.searchUserV2);

  post('/api/helper/syncStaff', helperCtrl.syncStaff);
  get('/api/helper/openApiUserTokens', helperCtrl.openApiUserTokens);
  get('/api/helper/delSubApp', appCtrl.delSubApp);
  get('/api/helper/updateSubAppGroupName', appCtrl.updateSubAppGroupName);
  get('/api/helper/saveStatData', helperCtrl.saveStatData);

  // 白名单服务
  get('/api/v1/allowed-app/addAllowed', allowedApp.addAllowed);
  get('/api/v1/allowed-app/delAllowed', allowedApp.delAllowed);
  get('/api/v1/allowed-app/isAllowed', allowedApp.isAllowed);
  get('/api/v1/allowed-app/refresh', allowedApp.refresh);
  get('/api/v1/allowed-app/getList', allowedApp.getList);
  get('/api/v1/allowed-app/getListWithEnv', allowedApp.getListWithEnv);

  /**
   * 此处不能通过 * 去让剩下未匹配上的路由加载hel首页
   * 因为这样的话，假设用户 访问 /api，在 at/core/handleAllRequest 里当成api路由了
   * 然后会重写 Content-Type 值为 applicatin/json
   * 接着执行完 homeCtrl 返回的页面就是原始的字符串了
   *
   * homeCtrl 的执行时机已直接提前到 at/core/handleAllRequest 里面
   * 非api路由或page路由，都直接调用 homeCtrl 来下发页面给前端
   */
  // get('/*', homeCtrl);
}
