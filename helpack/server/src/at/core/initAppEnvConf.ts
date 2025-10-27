import { isLocal } from 'at/utils/deploy';

/**
 * 根据不同的123部署环境从tconf初始化各自对应的无为配置
 */
export default async function initAppEnvConf() {
  // 本地开发时，调不通tconf，尝试从process.env里获取配置参数
  if (isLocal()) {
    // TODO assign env for local
    return;
  }

  // TODO assign env for online
}
