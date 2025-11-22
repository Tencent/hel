import { isLocal } from '../utils/deploy';

export default async function initAppEnvConf() {
  // 本地开发时，是调不通 tconf 的，且每个人可能有自己的数据库环境，
  if (isLocal()) {
    // TODO read .localenv.json 里获取配置参数 .gitignore 已忽略该文件
  }

  return {};
}
