/**
 * some setup work here
 */
import { setGlobalThis } from 'hel-micro-core';
import * as qs from 'qs';
import * as mockData from './mockData';

const noop = () => { };
const INVALID_MODULE = 'invalid-module';

setGlobalThis({
  fetch: async (url: string) => {
    let resUrl = url;
    console.log(`fetch url is ${url}`);
    // mock for unpkg 404 req
    if (url.includes(`${INVALID_MODULE}@latest/`)) {
      resUrl = '';
    } else if (url.includes('@latest/')) {
      resUrl = 'https://unpkg.com/xxx-aap@app_20220606060606';
    }

    return {
      url: resUrl,
      json: async () => {
        const searchObj: any = qs.parse(url.split('?')[1]);
        // 请求hel 或 unpkg
        if (searchObj.name === INVALID_MODULE || url.includes(`/${INVALID_MODULE}@`)) {
          console.log('return null for url', url);
          return { app: null, version: null };
        }
        return {
          app: mockData.makeApp({ name: searchObj.name }),
          version: mockData.makeVersion(),
        };
      },
    };
  },
  document: {
    querySelectorAll: () => [],
    head: {
      appendChild: noop,
    },
    body: {
      appendChild: noop,
    },
    createElement: () => ({}),
    getElementById: noop,
    getElementsByTagName: noop,
  },
});
