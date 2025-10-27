/* eslint-disable no-underscore-dangle,no-param-reassign */
import { DEFAULT_LOGO } from 'configs/constant';

export function formatSubApp(/** @type {import('types/domain').SubApp}*/ subApp, starAppNames) {
  if (!subApp.logo) subApp.logo = DEFAULT_LOGO;

  subApp._loading = false;
  if (starAppNames) {
    subApp._star = starAppNames.includes(subApp.name);
  }

  // 兼容老数据
  if (subApp.enable_gray === undefined) subApp.enable_gray = 0;
  if (subApp.is_in_gray === undefined) subApp.is_in_gray = 0;
}

export function formatSubApps(/** @type {import('types/domain').SubApp[]}*/ subApps, starAppNames, $name2SubApp) {
  const name2SubApp = $name2SubApp || {};
  subApps.forEach((v) => {
    formatSubApp(v, starAppNames);
    name2SubApp[v.name] = v;
  });

  return { subApps, name2SubApp };
}

export function makeQueryOptions(inputOptions) {
  const { appNames, user, page = 1, size = 20, isTop } = inputOptions;
  const queryOptions = { page, size, where: {} };

  if (appNames) {
    queryOptions.where.name = appNames;
  }
  if (isTop !== undefined) {
    queryOptions.where.is_top = isTop;
  }
  if (user) {
    queryOptions.where.create_by = user;
  }

  return queryOptions;
}
