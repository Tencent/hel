import axios from 'axios';
import { PLATFORM } from '../base/consts';
import { writeLog } from '../base/logger';
import type { IFetchModMetaOptions, IMeta, IModInfo } from '../base/types';
import { hasAllProps, hasProp } from '../base/util';
import { getSdkCtx } from '../context';
import { STATUS_OK } from '../mod-view/consts';
import { makeModInfo } from './mod-meta-helper';
import { getRequestMetaUrl } from './mod-meta-url';

/**
 * 提取 meta 对象，应对多种输入情况并做一定的兼容处理
 */
function extractMeta(metaWrap: any, helModName: string): IMeta {
  if (!metaWrap) {
    throw new Error(`No hel mod meta found for ${helModName}`);
  }

  let app: any = null;
  let version: any = null;
  const assignValue = (data: any) => {
    app = data.app;
    version = data.version;
  };

  // axios response
  if (hasAllProps(metaWrap, ['data', 'status', 'statusText', 'config'])) {
    if (metaWrap.status !== 200) {
      throw new Error(metaWrap.statusText);
    }
    const userData = metaWrap.data;
    if (hasProp(userData, 'code')) {
      // userData 是 helpack 返回数据，结果形如:
      // https://helmicro.com/openapi/meta/remote-react-comps-tpl
      // https://helmicro.com/openapi/meta/hel-demo-lib1-test
      if (userData.code !== STATUS_OK) {
        throw new Error(userData.msg || `Fetch meta failed, code ${userData.code}`);
      }
      assignValue(userData.data);
    } else {
      // userData 自身就是 meta
      // 例如来自 unpkg 的返回结果 https://unpkg.com/hel-demo-lib1@0.2.6/hel_dist/hel-meta.json
      assignValue(userData);
    }
  } else if (hasProp(metaWrap, 'app')) {
    // user specified getMeta return meta directly
    assignValue(metaWrap);
  }

  if (!app || !version) {
    if (app && !version) {
      throw new Error(`Hel mod ${helModName} just created on helpack but no build version data generated`);
    }
    throw new Error(`No hel mod meta found for ${helModName}`);
  }

  return { app, version };
}

export async function fetchModMeta(helModName: string, options?: IFetchModMetaOptions | null): Promise<IMeta> {
  const { platform = PLATFORM, ...rest } = options || {};
  const sdkCtx = getSdkCtx(platform);

  let reply: any;
  // 用户定制了模块元数据请求器
  if (sdkCtx.getMeta) {
    const params = { ...rest, helModName, platform };
    reply = await sdkCtx.getMeta(params);
  } else {
    // 走内部自己的拼接规则
    const url = getRequestMetaUrl(helModName, options);
    writeLog(`fetch meta ${url}`);
    const getFn = sdkCtx.httpGet || axios.get;
    // @ts-ignore 此处仅传 url，参数可兼容
    reply = await getFn(url);
  }
  const meta = extractMeta(reply, helModName);

  return meta;
}

export async function fetchModInfo(helModName: string, options?: IFetchModMetaOptions | null): Promise<IModInfo> {
  const meta = await fetchModMeta(helModName, options);
  const modInfo = makeModInfo(meta);
  return modInfo;
}
