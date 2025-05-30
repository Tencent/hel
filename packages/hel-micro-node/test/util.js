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
exports.__esModule = true;
exports.isCustomPlat = exports.mockEmitAppRootComponent = exports.mockEmitModule = void 0;
var hel_micro_core_1 = require('hel-micro-core');
var mockData = __importStar(require('./mockData'));
var eventBus = (0, hel_micro_core_1.getHelEventBus)();
// getHelDebug().logMode = 1;
/** 模拟模块获取到并发射的行为 */
function mockEmitModule(options) {
  var _a = options || {},
    _b = _a.platform,
    platform = _b === void 0 ? (0, hel_micro_core_1.getPlatform)() : _b,
    semverApi = _a.semverApi;
  var app = mockData.makeApp(options);
  var version = mockData.makeVersion({ name: app.name, platform: platform, versionId: app.build_version, semverApi: semverApi });
  (0, hel_micro_core_1.setAppMeta)(app, platform);
  (0, hel_micro_core_1.setVersion)(app.name, version, { platform: platform });
  setTimeout(function () {
    var libInfo = {
      platform: platform,
      appName: app.name,
      appGroupName: app.app_group_name,
      versionId: version.sub_app_version,
      appProperties: {
        getNum: function () {
          return 1;
        },
      },
      isLib: true,
      Comp: null,
    };
    (0, hel_micro_core_1.setEmitLib)(app.name, libInfo, { platform: platform });
    eventBus.emit(hel_micro_core_1.helEvents.SUB_LIB_LOADED, libInfo);
  }, 500);
  return { app: app, version: version };
}
exports.mockEmitModule = mockEmitModule;
/** 模拟应用根组件获取到并发射的行为 */
function mockEmitAppRootComponent(options) {
  var _a = options || {},
    _b = _a.platform,
    platform = _b === void 0 ? (0, hel_micro_core_1.getPlatform)() : _b,
    semverApi = _a.semverApi;
  var app = mockData.makeApp(options);
  var version = mockData.makeVersion({ name: app.name, platform: platform, versionId: app.online_version, semverApi: semverApi });
  (0, hel_micro_core_1.setAppMeta)(app, platform);
  (0, hel_micro_core_1.setVersion)(app.name, version, { platform: platform });
  setTimeout(function () {
    var compInfo = {
      platform: platform,
      appName: app.name,
      appGroupName: app.app_group_name,
      versionId: version.sub_app_version,
      appProperties: null,
      isLib: false,
      // prettier-ignore
      Comp: function RootComponent() { },
    };
    (0, hel_micro_core_1.setEmitApp)(app.name, compInfo);
    eventBus.emit(hel_micro_core_1.helEvents.SUB_APP_LOADED, compInfo);
  }, 500);
}
exports.mockEmitAppRootComponent = mockEmitAppRootComponent;
function isCustomPlat() {
  return !!process.env.IS_CUSTOM;
}
exports.isCustomPlat = isCustomPlat;
