import { SET_BY } from '../base/consts';
import type { IModInfo } from '../base/types';
import { getGlobalConfig } from '../context/global-config';
import { getSdkCtx } from '../context/index';
import { mayUpdateModPresetData } from '../mod-planner/facade';
import { markAppDesc } from '../mod-planner/facade-helper';
import { presetDataMgr } from '../mod-planner/preset-data';
import { getBackupModInfo, loadMetasFromFile } from '../server-mod/mod-meta-backup';

/**
 * 同步缓存模块相关预置数据，由 loadBackupHelMod 调用，此场景本地磁盘有备份文件，故可用同步模式来缓存
 */
function updateModPresetDataSync(platform: string, setBy: string, modInfo: IModInfo | null) {
  if (!modInfo) {
    return;
  }
  markAppDesc(setBy, modInfo);
  presetDataMgr.updateForClient(platform, modInfo);
}

/** 标记hel中间件环境变量，方便在下发给前端首页的响应里查看 */
export function markHelEnv(ctx: any, isGrayVer?: boolean) {
  const { envName, containerName, workerId } = getGlobalConfig().getEnvInfo();
  // someEnv-someWorkerId-isGrayUser
  const mark = `${envName}-${containerName}-${workerId}-${isGrayVer ? '1' : '0'}`;
  ctx.response.set('Hel-Env', mark);
}

let seg = 0;
let num = 0;
/** 标记hel渲染命中 */
export function markHelHit(ctx: any) {
  num += 1;
  if (num === Number.MAX_SAFE_INTEGER) {
    seg += 1;
    num = 0;
  }
  const mark = `${seg}_${num}`;
  ctx.response.set('Hel-Hit', mark);
}

/**
 * 服务于 initMiddleware 流程，
 * 使用 server 镜像里的数据（来自 server 构建产物里的 hel-meta.json 文件）来生成 initMiddleware 需要的预置数据
 */
export function loadInitMiddlewareHelMods(platform?: string) {
  const sdkCtx = getSdkCtx(platform);
  const { metaBackupFilePath } = getGlobalConfig();
  // initMiddleware 暂定强制要求必须本地有 meta 备份文件，后续看情况再做优化
  loadMetasFromFile(metaBackupFilePath);

  const modInfoList: IModInfo[] = [];
  try {
    sdkCtx.modNames.forEach((name) => {
      const modInfo = getBackupModInfo(sdkCtx.platform, name);
      updateModPresetDataSync(sdkCtx.platform, SET_BY.init, modInfo);
      modInfoList.push(modInfo);
    });
    return modInfoList.filter((v) => !!v);
  } catch (err: any) {
    if (getGlobalConfig().isProd) {
      throw err;
    }

    // 允许 initMiddleware 在测试环境运行或本地运行无备份 meta，
    // 当没有时会自动拉取最新的 meta 数据，这样可支持用测试环境来运行正式环境构建的镜像
    mayUpdateModPresetData(sdkCtx.platform, SET_BY.init).catch((err) => {
      const { reporter } = getGlobalConfig();
      reporter.reportError({ message: err.stack, desc: 'err-loadInitMiddlewareHelMods', data: platform });
    });
  }
  return modInfoList;
}
