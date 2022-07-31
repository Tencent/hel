import type { IGetOptions } from '../services/api';
import * as appSrv from '../services/app';

// 独立暴露的接口，默认返回完整的应用版本（即包含 html_content）
export default async function fetchAppAndVersion(appName: string, getOptions?: IGetOptions) {
  const passOptions = { ...(getOptions || {}) };
  passOptions.isFullVersion = passOptions.isFullVersion ?? true;
  const data = await appSrv.getAppAndVersion(appName, passOptions);
  return data;
};
