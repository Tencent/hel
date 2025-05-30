'use strict';
var __createBinding =
  (this && this.__createBinding)
  || (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault)
  || (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar)
  || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod) if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __awaiter =
  (this && this.__awaiter)
  || function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator)
  || function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function'
        && (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y
              && (t = op[0] & 2 ? y['return'] : op[0] ? y['throw'] || ((t = y['return']) && t.call(y), 0) : y.next)
              && !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
exports.__esModule = true;
/**
 * some setup work here
 */
var hel_micro_core_1 = require('hel-micro-core');
var qs = __importStar(require('qs'));
var mockData = __importStar(require('./mockData'));
// prettier-ignore
var noop = function () { };
var localStorageCache = {};
function guessNameAndVer(url) {
  if (url.includes('@')) {
    // unpkg
    var str = url.split('/').find(function (str) {
      return str.includes('@');
    });
    var _a = str.split('@'),
      name_1 = _a[0],
      ver = _a[1];
    return { name: name_1, ver: ver };
  }
  var searchObj = qs.parse(url.split('?')[1]);
  return { name: searchObj.name, ver: searchObj.ver };
}
/**
 * 提供模拟的 globalThis，方便为测试用例打桩
 */
(0, hel_micro_core_1.setGlobalThis)(
  {
    fetch: function (url) {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          // mock unpkg redirect
          if (url.includes('@latest/')) {
            return [2 /*return*/, { status: 404, url: url.replace('@latest/', '@1.1.3/') }];
          }
          return [
            2 /*return*/,
            {
              json: function () {
                return __awaiter(void 0, void 0, void 0, function () {
                  var _a, name, ver, app, version;
                  return __generator(this, function (_b) {
                    (_a = guessNameAndVer(url)), (name = _a.name), (ver = _a.ver);
                    if (name === 'invalid-module') {
                      return [
                        2 /*return*/,
                        {
                          data: { app: null, version: null },
                        },
                      ];
                    }
                    app = mockData.makeApp({ app: { name: name, build_version: ver } });
                    version = mockData.makeVersion({ versionId: ver });
                    // 走
                    if (url.includes('/getSubAppVersion') || url.includes('/getSubAppFullVersion')) {
                      return [2 /*return*/, { data: version, code: 0 }];
                    }
                    if (url.includes('/getSubAppAndItsVersion') || url.includes('/getSubAppAndItsFullVersion')) {
                      return [2 /*return*/, { data: { app: app, version: version }, code: 0 }];
                    }
                    // semverApi 直接返回 { app, version }
                    // see https://unpkg.com/browse/hel-tpl-remote-vue-comps@1.1.3/hel_dist/hel-meta.json
                    return [2 /*return*/, { app: app, version: version }];
                  });
                });
              },
              text: function () {
                if (url.endsWith('chunk1.css')) {
                  return 'html{width:100%;height:100%;}body{font-size:12px;}';
                }
                if (url.endsWith('chunk2.css')) {
                  return 'p{padding:1px;}';
                }
                return '';
              },
              status: 200,
              url: url,
            },
          ];
        });
      });
    },
  },
  true,
);
