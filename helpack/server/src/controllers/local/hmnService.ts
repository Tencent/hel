import { TController } from 'at/types';
import type { IOnClientCloseParams } from 'services/hel-micro-socket/types';

// 本地环境的HMN统计数据模拟缓存
const localHMNStatData = new Map<string, any[]>();
const localHMNStatLogData = new Map<string, any[]>();
/**
 * 本地环境下模拟获取统计列表
 */
export const getStatList: TController = async (ctx) => {
  console.log('[Local Mode] getStatList called with body:', ctx.body);

  const { name, page = 0, size = 10 } = ctx.body;

  // 如果还没有该应用的数据，则初始化
  if (!localHMNStatData.has(name)) {
    localHMNStatData.set(name, []);
  }

  const statData = localHMNStatData.get(name) || [];

  // 分页处理
  const startIndex = page * size;
  const endIndex = startIndex + size;
  const rows = statData.slice(startIndex, endIndex);
  const count = statData.length;

  console.log(`[Local Mode] Returning ${rows.length} stats for ${name}, total: ${count}`);
  return { list: rows, count };
};
/**
 * 本地环境下模拟获取统计日志列表
 */
export const getStatLogList: TController = async (ctx) => {
  console.log('[Local Mode] getStatLogList called with body:', ctx.body);

  const { name, page = 0, size = 10 } = ctx.body;

  // 如果还没有该应用的日志数据，则初始化
  if (!localHMNStatLogData.has(name)) {
    localHMNStatLogData.set(name, []);
  }

  const logData = localHMNStatLogData.get(name) || [];

  // 分页处理
  const startIndex = page * size;
  const endIndex = startIndex + size;
  const rows = logData.slice(startIndex, endIndex);
  const count = logData.length;

  console.log(`[Local Mode] Returning ${rows.length} logs for ${name}, total: ${count}`);
  return { list: rows, count };
};

export const handleClientClose = async (params: IOnClientCloseParams) => {
  localHMNStatData.clear();
  localHMNStatLogData.clear();
};

/**
 * 本地环境下模拟上报统计信息
 */
export const reportHelModStat: TController<any, any, any> = async (ctx) => {
  console.log('[Local Mode] reportHelModStat called with body:', ctx.body);

  const { body } = ctx;
  const mod_name = body.modName || body.mod_name;
  const modVersion = body.modVersion || body.mod_version;
  const loadAt = body.loadAt || body.load_at;
  const envInfo = body.envInfo || body.env_info || {};

  try {
    // 验证必要字段
    if (!mod_name) {
      console.error('[Local Mode] Missing modName in report data');
      return false;
    }

    // 获取现有统计数据
    if (!localHMNStatData.has(mod_name)) {
      localHMNStatData.set(mod_name, []);
    }

    const statData = localHMNStatData.get(mod_name) || [];

    // 构造新的统计数据
    const newStat = {
      id: statData.length + 1,
      mod_name,
      mod_version: modVersion,
      load_at: loadAt,
      container_name: envInfo.containerName,
      container_ip: envInfo.containerIP,
      pod_name: envInfo.podName,
      img_version: envInfo.imgVersion,
      env_name: envInfo.envName,
      city: envInfo.city,
      env_info: envInfo,
      user_id: envInfo.workerId || 'unknown',
      created_at: new Date(),
    };

    // 查找是否有相同的 container_name 记录
    const existingIndex = statData.findIndex((stat: any) => stat.container_name === envInfo.containerName);

    if (existingIndex !== -1) {
      // 如果找到相同 container_name 的记录，则替换它
      newStat.id = statData[existingIndex].id; // 保留原有的 ID
      statData[existingIndex] = newStat;
      console.log('[Local Mode] Updated existing stat record for container:', envInfo.containerName);
    } else {
      // 否则添加新的记录
      statData.push(newStat);
      console.log('[Local Mode] Added new stat record for container:', envInfo.containerName);
    }

    localHMNStatData.set(mod_name, statData);

    // 同时记录日志
    if (!localHMNStatLogData.has(mod_name)) {
      localHMNStatLogData.set(mod_name, []);
    }

    const logData = localHMNStatLogData.get(mod_name) || [];
    const newLog = {
      id: logData.length + 1,
      mod_name,
      mod_version: modVersion,
      user_id: envInfo.workerId || 'unknown',
      action: 'report',
      load_at: loadAt,
      container_name: envInfo.containerName,
      container_ip: envInfo.containerIP,
      pod_name: envInfo.podName,
      img_version: envInfo.imgVersion,
      env_name: envInfo.envName,
      city: envInfo.city,
      env_info: envInfo,
      created_at: new Date(),
    };

    logData.push(newLog);
    localHMNStatLogData.set(mod_name, logData);

    console.log('[Local Mode] Report saved:', newStat);
    return true;
  } catch (err) {
    console.error('[Local Mode] Error in reportHelModStat:', err);
    return false;
  }
};
