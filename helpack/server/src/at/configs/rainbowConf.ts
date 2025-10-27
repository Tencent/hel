import biz from 'at/configs/biz';

interface IHelpackConf {
  apiHelperToken: string;
  signSecStr: string;
  adminUsers: string[];
}

const makeHelpackConf = (): IHelpackConf => {
  return {
    adminUsers: [biz.HEL_OWNER],
    apiHelperToken: '',
    signSecStr: '',
  };
};

const groupDataCache: Record<string, Record<string, any>> = {
  common: {
    HELPACK_CONF: makeHelpackConf(),
  },
};

export function getConf<T = any>(group: string, key: string): T {
  return groupDataCache[group][key];
}

export function getAllowApps() {
  return getConf<string[]>('common', 'ALLOW_APPS');
}

export function getHelpackConf() {
  return getConf<IHelpackConf>('common', 'HELPACK_CONF') || makeHelpackConf();
}

export function getAdminUsers() {
  return getHelpackConf().adminUsers || [biz.HEL_OWNER];
}

/**
 * 调用 /openapi/openApiUserTokens 接口查看内存里的OPEN_API_USER_TOKENS值时
 * 计算 nonce 字符串的需要的token
 */
export function getOAUTToken() {
  return getConf<string>('common', 'OAUT_TOKEN') || '';
}

export function getApiHelperToken() {
  return getHelpackConf().apiHelperToken || '';
}

/**
 * 不在query或body里出现的秘串，加大破解签名方式难度，该串仅客户端和服务器端知道，
 * 支持随时在七彩石修改。
 */
export function getSignSecStr() {
  return getHelpackConf().signSecStr || 'xc_is_cool_bilibalaweiwei';
}

/**
 * 获取开放api授权给具体用户的安全令牌，用于计算加密字符串的签名值
 */
export function getOpenApiUserTokens() {
  return getConf<Record<string, string>>('common', 'OPEN_API_USER_TOKENS') || {};
}

/**
 * 调用 delSubApp 接口时计算 nonce 字符串的需要的token
 */
export function getDelAppToken() {
  return getConf<string>('common', 'DEL_APP_TOKEN') || {};
}

export function getUpdateAppGroupNameToken() {
  return getConf<string>('common', 'UPDATE_APP_GROUP_NAME_TOKEN') || {};
}
