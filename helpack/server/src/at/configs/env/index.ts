/**
 * 当前配置文件会在启动后台时，先执行 at/core/initAppEnvConf 文件的逻辑，拉取七彩石配置数据来填充
 * 如果是本地运行，则读取 server根目录 .env.js（已加入.gitignore） 配置来填充
 */

const env = {
  port: '',
  tcos: {
    appId: '75675',
    secretId: '',
    secretKey: '',
    access: {
      target: 'gzc', // 参考上面的配置，也支持自定义
      type: 'domain', // l5 or domain
    } as const,
  },
  dbConf: {
    username: 'writeuser',
    password: '',
    database: 'tnews_cms_portal',
    host: 'transformer.mdb.mig',
    port: '20385',
    dialect: 'mysql',
  } as unknown as nsdb.DBConfigItem,
  redisConf: {
    ip: '11.177.230.56',
    port: 6379,
    password: '',
    keyPrefix: 'xc_',
  },
  other: {
    redirectHost: '',
    smartProxyToken: '',
    appName: '',
    /** tcosParams 模块使用 */
    tcosEncryptSecretKey: '',
    enableReplyTcosParams: false,
    /** hel-micro-node 请求加密之用 */
    hmnApiSecForReq: '',
    /** 后台加密 hmnApiKey 之用 */
    hmnApiSecForBackend: '',
  },
  /** 敏感权限系统中的相关配置 */
  sec: {
    sysId: 23338,
    appId: 10721,
    appKey: 'R&#&H@%C38f~cvbd',
  },
  /**
   * 不区分环境的无为配置，即不同环境的123镜像都读取的相同配置
   * appid、masterkey由tconf填充，
   */
  cmmonWuwei: {
    legacyAppid: '', // 遗留业务需要的无为配置
    legacyMasterkey: '',
    appPlatformMetaAppid: '', // app_platform_meta的无为配置
    appPlatformMetaMasterkey: '',
  },
};

export default env;
