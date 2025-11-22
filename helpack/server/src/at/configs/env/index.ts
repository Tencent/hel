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
    username: 'root',
    password: '123456',
    database: 'server',
    host: 'localhost',
    port: '3306',
    dialect: 'mysql',
  } as unknown as nsdb.DBConfigItem,
  redisConf: {
    ip: '127.0.0.1',
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
};

export default env;
