import { getGlobalConfig } from '../context/global-config';

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
