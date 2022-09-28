/**
 * some setup work here
 */
import { setGlobalThis } from 'hel-micro-core';
import * as qs from 'qs';
import * as mockData from './mockData';

const noop = () => {};

setGlobalThis({
  fetch: async (url: string) => {
    return {
      json: async () => {
        const searchObj: any = qs.parse(url.split('?')[1]);
        if (searchObj.name === 'invalid-module') {
          return {
            data: { app: null, version: null },
          };
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
