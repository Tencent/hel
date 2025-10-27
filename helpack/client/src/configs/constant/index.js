import cryptojs from 'crypto-js';
import * as ccModule from './ccModule';
import * as page from './page';

export const OUT_URL_PREFIX = 'https://footprint.qq.com/hel';

/** 此域名支持海外访问，是推荐的域名 */
export const OUT_URL_PREFIX_V2 = 'https://helmicro.com';

/** hel负责人 */
export const HEL_CHARGER = 'fantasticsoul';

/** @type string[] */
export const HEL_ADMINS = window.__HELPACK_ADMINS__ || [HEL_CHARGER];

/** 配合fast load */
export const LS_HUB_PORTAL_STATE = 'hub.portalState';

export const IMG_TNEWS_SPLASH_SCREEN = 'https://mat1.gtimg.com/news/js/tnfe/imgs/leah4/t-fetching.png';

export const DEFAULT_LOGO = 'https://tnfe.gtimg.com/hel-img/tnew-logo.png';

export const ICON_HEL = 'https://tnfe.gtimg.com/hel-img/hel-logo-64.png';

export const ICON_PIPELINE = 'https://tnfe.gtimg.com/image/k7ajm4boap_1623656062511.png';

export const ICON_GITCODE = 'https://tnfe.gtimg.com/hel-img/gitcode-logo-v2.png';

export const ICON_STAR_NO = 'https://tnfe.gtimg.com/hel-img/star-no-v3.png';

export const ICON_STAR = 'https://tnfe.gtimg.com/hel-img/star.png';

export const ICON_DEL = 'https://tnfe.gtimg.com/hel-img/icon-del.png';

export const HEL_ARCH = 'https://tnfe.gtimg.com/image/f13q7cuzxt_1652895450360.png';

export const HEL_BANNER = 'https://tnfe.gtimg.com/image/eai2tlcqqm_1641021424949.jpg';

export const HEL_LABEL_LOGO = 'https://tnfe.gtimg.com/image/cr34f76naf_1641028409205.png';

export const HEL_REMOTE_LIB_CASE = 'https://tnfe.gtimg.com/image/7bljnu12is_1652903733496.png';

export const HEL_REMOTE_REACT_CASE = 'https://tnfe.gtimg.com/image/as5esz5jel_1652903738582.png';

export const HEL_REMOTE_VUE_CASE = 'https://tnfe.gtimg.com/image/snddrqs0o9_1652903744537.png';

export const DEMO_EDITOR_BG = 'https://tnfe.gtimg.com/image/li4ag50scc_1653811070745.png';

export const APP_CARD_GRAY = 'TODO:app-card-gray-demo-image';

const localSec = 'xc_is_cool_bilibalaweiwei';
// 定义密文和密钥
const encrypedStr = window.__HELPACK_SECSTR__ || localSec;
let plaintext = '';

if (encrypedStr === localSec) {
  plaintext = localSec;
} else {
  const mixedKey = 'ayxfbrysVczsIVjsgo';
  const key = mixedKey.replace('x', '').replace('y', '').replace('z', '');
  // 设置解密选项
  const options = {
    mode: cryptojs.mode.ECB, // 使用ECB模式
    padding: cryptojs.pad.Pkcs7, // 使用Pkcs7填充方式
  };
  // 执行解密操作
  const decrypted = cryptojs.AES.decrypt(encrypedStr, key, options);
  // 获取解密后的明文
  plaintext = decrypted.toString(cryptojs.enc.Utf8);
}

// 不在 query 或 body 里出现的秘串，加大破解签名方式难度，该串仅客户端和服务器端知道
// 因 helpack 属于内网部署站点，无效非常严格的安全机制，如需更严格的加密建议后台下发动态的 __HELPACK_SECSTR__
export const SEC_STR = plaintext;

export const path2Module = {
  [page.LATEST_VISIT]: ccModule.LATEST_VISIT,
  [page.STAR]: ccModule.STAR_LIST,
  [page.STORE]: ccModule.APP_STORE,
  [page.TOP]: ccModule.TOP,
  [page.CREATED]: ccModule.CREATED_LIST,
};

export const lsKeys = {
  APP_CARD_GRAY: 'helpack.appCard.bgGray',
  LIST_MODE: 'helpack.appStore.listMode',
};
