/* eslint-disable @typescript-eslint/no-require-imports */
import { loadJson } from '../util/index';

const axiosMod = require('./axios-mod');

// 重写 get 方法，返回打桩的元数据
axiosMod.get = async function (url: string) {
  const json = loadJson('backup-data.json');
  let meta: any = null;
  if (url.indexOf('name=qqnews-pc-components-lite') >= 0) {
    meta = json['qqnews-pc-components-lite'];
  } else if (url.indexOf('name=qqnews-pc-dc-test') >= 0) {
    meta = json['qqnews-pc-dc-test'];
  } else if (url.indexOf('name=qqnews-pc-channel') >= 0) {
    meta = json['qqnews-pc-channel'];
  }

  return {
    data: {
      code: '0',
      data: meta,
    },
  };
};

jest.doMock('axios', () => axiosMod);
