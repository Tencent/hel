import * as apis from 'index';
import * as util from './util';

const semverApi = false;
const platform = 'hel';
export const ins = apis.createOriginInstance(platform, {
  apiPrefix: 'https://www.custom-hel.com',
  semverApi,
});

export const ori = apis;

export type Api = typeof ori;

function makeTestKitContext(api: Api, platform: string, semverApi: boolean) {
  const isIns = !semverApi; // 非语义化版本 api 配置（ semverApi=false ） 即是实例 api
  return {
    api,
    isIns,
    semverApi,
    platform,
    describe: (label: string, describeCb: any) => {
      const mark = isIns ? 'ins' : 'ori';
      describe(`${mark}: ${label}`, describeCb);
    },
    util,
  };
}

export function runTest(cb: (kitCtx: ReturnType<typeof makeTestKitContext>) => void) {
  cb(makeTestKitContext(ins, platform, semverApi));
  cb(makeTestKitContext(ori, apis.core.getPlatform(), true));
}
