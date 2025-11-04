'use strict';
var __assign =
  (this && this.__assign)
  || function () {
    __assign =
      Object.assign
      || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
exports.__esModule = true;
var FALSE = 0;
var TRUE = 1;
function makeApp(options) {
  var _a = options || {},
    _b = _a.app,
    app = _b === void 0 ? {} : _b,
    _c = _a.semverApi,
    semverApi = _c === void 0 ? true : _c;
  var _d = app.name,
    name = _d === void 0 ? app.name || 'remote-vue-comps-tpl' : _d,
    _e = app.app_group_name,
    appGroupName = _e === void 0 ? app.app_group_name || 'remote-vue-comps-tpl' : _e;
  var buildVer = app.build_version;
  if (!buildVer) {
    buildVer = semverApi ? '1.1.3' : ''.concat(name, '_20220602022833');
  }
  var appDemo = {
    id: 1016,
    name: name,
    app_group_name: appGroupName,
    name_in_sec: '',
    logo: '',
    splash_screen: '',
    is_test: FALSE,
    enable_build_to_online: TRUE,
    enable_pipeline: TRUE,
    token: '******',
    cnname: '',
    desc: '远程vue组件模板',
    class_name: '',
    create_by: 'fantasticsoul',
    online_version: buildVer,
    pre_version: buildVer,
    test_version: buildVer,
    build_version: buildVer,
    enable_display: TRUE,
    api_host: '',
    render_mode: '',
    ui_framework: 'lib',
    iframe_src_map: {},
    host_map: {},
    git_repo_url: 'https://github.com/hel-eco/hel-tpl-remote-vue-comp.git',
    is_rich: FALSE,
    is_top: FALSE,
    is_back_render: FALSE,
    extract_mode: 'bu_st',
    additional_scripts: [],
    additional_body_scripts: [],
    is_local_render: TRUE,
    render_app_host: '',
    enable_gray: FALSE,
    is_in_gray: FALSE,
    owners: [],
    gray_users: [],
    proj_ver: { map: {}, utime: 0 },
    create_at: '2022-05-31T17:34:13.000Z',
    update_at: '2022-06-01T18:29:18.000Z',
  };
  return __assign(__assign({}, appDemo), options || {});
}
exports['default'] = makeApp;
