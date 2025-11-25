import { SERVER_INFO } from '../base/consts';

const { env, containerName, workerId } = SERVER_INFO;

/** 标记hel中间件环境变量 */
export function markHelEnv(ctx: any, isGrayVer?: boolean) {
  // 123env-nodeWorkerId-isGrayUser
  const mark = `${env}-${containerName}-${workerId}-${isGrayVer ? '1' : '0'}`;
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
