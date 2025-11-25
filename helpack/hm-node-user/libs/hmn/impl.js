/* eslint-disable */
"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod2) => function __require2() {
  return mod2 || (0, cb[__getOwnPropNames(cb)[0]])((mod2 = { exports: {} }).exports, mod2), mod2.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod2, isNodeMode, target) => (target = mod2 != null ? __create(__getProtoOf(mod2)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod2 || !mod2.__esModule ? __defProp(target, "default", { value: mod2, enumerable: true }) : target,
  mod2
));

// src/base/util.ts
function strItems2Dict(strItems, val) {
  const dict = {};
  strItems.forEach((item) => dict[item] = val);
  return dict;
}
function isModuleLike(mayModule) {
  if (!mayModule) {
    return false;
  }
  if (typeof mayModule.toString !== "function") {
    return false;
  }
  try {
    return [OBJ_DESC, MODULE_DESC].includes(mayModule.toString());
  } catch (err) {
    return false;
  }
}
function isFn(mayFn) {
  return typeof mayFn === "function";
}
function isValidModule(mayModule) {
  if (!mayModule) {
    return false;
  }
  const len = Object.keys(mayModule).length;
  if (!len) {
    try {
      return mayModule.toString() === MODULE_DESC;
    } catch (err) {
      return false;
    }
  }
  return true;
}
function xssFilter(input) {
  return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
}
function purify(raw) {
  const pured = {};
  Object.keys(raw).forEach((key) => {
    const val = raw[key];
    if (![void 0, null, ""].includes(val)) {
      pured[key] = val;
    }
  });
  return pured;
}
function purifyFn(raw) {
  const pured = {};
  Object.keys(raw).forEach((key) => {
    const val = raw[key];
    if (typeof val === "function") {
      pured[key] = val;
    }
  });
  return pured;
}
function lastNItem(strList, lastIdx = 1) {
  const idx = strList.length - lastIdx;
  return strList[idx];
}
function uniqueStrPush(strList, str) {
  if (!strList.includes(str)) {
    strList.push(str);
  }
  return strList;
}
function safeGet(dict, key, defaultVal) {
  let val = dict[key];
  if (!val) {
    dict[key] = defaultVal;
    val = defaultVal;
  }
  return val;
}
function maySet(dict, key, val) {
  if (!val) {
    return false;
  }
  dict[key] = val;
  return true;
}
function maySetFn(dict, key, val) {
  if (typeof val === "function") {
    dict[key] = val;
  }
}
function noop(...args) {
  return args;
}
function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
var init_util = __esm({
  "src/base/util.ts"() {
    init_mod_consts();
  }
});

// src/base/consts.ts
var _path = require('path'); var path = _interopRequireWildcard(_path); var path2 = _interopRequireWildcard(_path); var path3 = _interopRequireWildcard(_path); var path4 = _interopRequireWildcard(_path); var path5 = _interopRequireWildcard(_path); var path6 = _interopRequireWildcard(_path); var path7 = _interopRequireWildcard(_path); var path8 = _interopRequireWildcard(_path); var path9 = _interopRequireWildcard(_path);
function setCtxEnv(options) {
  const pured = purify(options);
  Object.assign(CTX_ENV, pured);
}
var SUMERU_CONTAINER_NAME, WORKER_ID, SUMERU_ENV, NODE_APP_INSTANCE, PLATFORM, PLATFORM_HEL, HEL_API_URL, HELPACK_API_URL, SDK_NAME, CHANNEL_APP_INFO_CHANGED, CHANNEL_APP_VERSION_CHANGED, SDK_PKG_ROOT, HEL_SDK_SRC, SERVER_INFO, CTX_ENV, AS_TRUE, AS_FALSE, HOOK_TYPE;
var init_consts = __esm({
  "src/base/consts.ts"() {
    init_util();
    ({ SUMERU_CONTAINER_NAME, WORKER_ID, SUMERU_ENV, NODE_APP_INSTANCE } = process.env);
    PLATFORM = "unpkg";
    PLATFORM_HEL = "hel";
    HEL_API_URL = "https://unpkg.com";
    HELPACK_API_URL = "https://helmicro.com/openapi/meta";
    SDK_NAME = require('path').join(__dirname, './impl.js').replace(/\\/g, '/');
    CHANNEL_APP_INFO_CHANGED = "appInfoChanged";
    CHANNEL_APP_VERSION_CHANGED = "appVersionChanged";
    SDK_PKG_ROOT = path.join(__dirname, "../../");
    HEL_SDK_SRC = "https://tnfe.gtimg.com/hel-runtime/level1/hel-base-v28.js";
    SERVER_INFO = {
      containerName: SUMERU_CONTAINER_NAME || "",
      workerId: WORKER_ID || NODE_APP_INSTANCE || 0,
      env: SUMERU_ENV || ""
    };
    CTX_ENV = {
      isProd: SERVER_INFO.env === "formal"
    };
    AS_TRUE = "1";
    AS_FALSE = "0";
    HOOK_TYPE = {
      onInitialHelMetaFetched: "onInitialHelMetaFetched",
      onHelModLoaded: "onHelModLoaded",
      onMessageReceived: "onMessageReceived"
    };
  }
});

// src/base/mod-consts.ts

var HEL_META_JSON, SOCKET_MSG_TYPE, HEL_MDO_PROXY, IS_HEL_MOD_PROXY, NODE_MODULES, REAL_MOD_DIR_NAME, DOT_HEL_MODULES, MOD_FILES_DIR, LIMIT_VER_COUNT, HEL_DIST, MOD_INIT_VER, INDEX_JS, KEY_DEFAULT, MOD_TPL, FILE_SUBPATH_LIMIT, MOD_MGR_DIR_NAME, MAP_NODE_MOD_DIR_NAME, KW_NODE_MOD_NAME, DOWNLOAD_RETRY_LIMIT, OBJ_DESC, MODULE_DESC, WAIT_INTERVAL_MS, HEL_LOCK_FILE_VALID_TIME_MS, COMPILED_PROXY_FILE_TPL;
var init_mod_consts = __esm({
  "src/base/mod-consts.ts"() {
    init_consts();
    HEL_META_JSON = "hel-meta.json";
    SOCKET_MSG_TYPE = {
      initHelMods: "initHelMods",
      addHelMods: "addHelMods"
    };
    HEL_MDO_PROXY = Symbol("HelModProxy");
    IS_HEL_MOD_PROXY = 1;
    NODE_MODULES = "node_modules";
    REAL_MOD_DIR_NAME = "mod-files";
    DOT_HEL_MODULES = ".hel_modules";
    MOD_FILES_DIR = path2.join(__dirname, `../${REAL_MOD_DIR_NAME}`);
    LIMIT_VER_COUNT = 1e4;
    HEL_DIST = "hel_dist";
    MOD_INIT_VER = "MOD_INIT_VER";
    INDEX_JS = "index.js";
    KEY_DEFAULT = "default";
    MOD_TPL = path2.join(__dirname, "./mod-tpl.js");
    FILE_SUBPATH_LIMIT = 20;
    MOD_MGR_DIR_NAME = "mod-manager";
    MAP_NODE_MOD_DIR_NAME = "map-node-mods";
    KW_NODE_MOD_NAME = "{{NODE_MOD_NAME}}";
    DOWNLOAD_RETRY_LIMIT = 3;
    OBJ_DESC = "[object Object]";
    MODULE_DESC = "[object Module]";
    WAIT_INTERVAL_MS = 100;
    HEL_LOCK_FILE_VALID_TIME_MS = 60 * 1e3;
    COMPILED_PROXY_FILE_TPL = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hmn = require("${SDK_NAME}");
const proxyMod = hmn.requireNodeMod('{{NODE_MOD_NAME}}');
module.exports = proxyMod;
`;
  }
});

// src/test-util/jest-env.ts
function isRunInJest() {
  return !!process.env.JEST_WORKER_ID;
}
var init_jest_env = __esm({
  "src/test-util/jest-env.ts"() {
  }
});

// src/context/global-config.ts
function mergeGlobalConfig(config) {
  const { helModulesDir, helProxyFilesDir, strict = true, hooks = {}, shouldAcceptVersion: shouldAcceptVersion2 } = config;
  sdkGlobalConfig.strict = strict;
  if (isRunInJest() && helProxyFilesDir) {
    sdkGlobalConfig.helProxyFilesDir = helProxyFilesDir;
  }
  Object.assign(sdkGlobalConfig.hooks, purifyFn(hooks));
  maySet(sdkGlobalConfig, "helModulesDir", helModulesDir);
  maySetFn(sdkGlobalConfig, "shouldAcceptVersion", shouldAcceptVersion2);
}
function getGlobalConfig() {
  return sdkGlobalConfig;
}
var sdkGlobalConfig;
var init_global_config = __esm({
  "src/context/global-config.ts"() {
    init_util();
    init_jest_env();
    sdkGlobalConfig = {
      helModulesDir: "",
      helProxyFilesDir: "",
      helLogFilesDir: "",
      strict: true,
      hooks: {
        onInitialHelMetaFetched: noop,
        onHelModLoaded: noop,
        onMessageReceived: noop
      },
      shouldAcceptVersion: () => true
    };
  }
});

// src/base/path-helper.ts
var _fs = require('fs'); var fs = _interopRequireWildcard(_fs); var fs2 = _interopRequireWildcard(_fs); var fs3 = _interopRequireWildcard(_fs); var fs4 = _interopRequireWildcard(_fs); var fs5 = _interopRequireWildcard(_fs); var fs6 = _interopRequireWildcard(_fs); var fs7 = _interopRequireWildcard(_fs); var fs8 = _interopRequireWildcard(_fs); var fs10 = _interopRequireWildcard(_fs); var fs9 = _interopRequireWildcard(_fs);

function getDotHelModulesPath() {
  const list = SDK_PKG_ROOT.split(path3.sep);
  const lastIdx = list.length - 1;
  let nodeModulesIdx = -1;
  let nodeModulesPath = "";
  let firstSideNodeModulesPath = "";
  for (let idx = lastIdx; idx >= 0; idx--) {
    const name = list[idx];
    if (NODE_MODULES === name) {
      nodeModulesIdx = idx;
      break;
    }
    if (!firstSideNodeModulesPath) {
      const curList = list.slice(0, idx);
      curList.push(NODE_MODULES);
      const curPath = curList.join(path3.sep);
      if (fs.existsSync(curPath)) {
        firstSideNodeModulesPath = curPath;
      }
    }
  }
  if (nodeModulesIdx >= 0) {
    nodeModulesPath = list.slice(0, nodeModulesIdx + 1).join(path3.sep);
  } else {
    nodeModulesPath = firstSideNodeModulesPath;
  }
  const dotHelModulesPath = nodeModulesPath ? path3.join(nodeModulesPath, DOT_HEL_MODULES) : "";
  return dotHelModulesPath;
}
function resolveNodeModPath(nodeModNameOrPath, allowNull) {
  try {
    return __require.resolve(nodeModNameOrPath);
  } catch (err) {
    if (allowNull) {
      return "";
    }
    throw err;
  }
}
function getHelModulesPath() {
  if (!lockedHelModulesDir) {
    lockedHelModulesDir = getGlobalConfig().helModulesDir;
    if (!lockedHelModulesDir) {
      const dotHelModulesPath = getDotHelModulesPath();
      lockedHelModulesDir = dotHelModulesPath || MOD_FILES_DIR;
    }
    if (!fs.existsSync(lockedHelModulesDir)) {
      fs.mkdirSync(lockedHelModulesDir, { recursive: true });
      const readmeFile = path3.join(lockedHelModulesDir, "./README.txt");
      const starMe = "star it(https://github.com/Tencent/hel) if you like our open source works.";
      let hint = `Thank you for using hel-micro-node sdk ^_^, ${starMe}
`;
      hint += "Hel-micro-node will use below directory to store downloaded files!\n";
      hint += `${lockedHelModulesDir}
`;
      fs.writeFileSync(readmeFile, hint, { encoding: "utf8" });
    }
  }
  return lockedHelModulesDir;
}
function getDirFileList(dirPath, filePathList = []) {
  const names = fs.readdirSync(dirPath);
  names.forEach((name) => {
    const maySubDirPath = `${dirPath}/${name}`;
    const stats = fs.statSync(maySubDirPath);
    if (stats.isDirectory()) {
      getDirFileList(maySubDirPath, filePathList);
    } else {
      filePathList.push(maySubDirPath);
    }
  });
  return filePathList;
}
function getHelProxyFilesDir() {
  if (lockedHelProxyFilesDir) {
    return lockedHelProxyFilesDir;
  }
  const targetDir = getGlobalConfig().helProxyFilesDir;
  if (targetDir) {
    lockedHelProxyFilesDir = targetDir;
    return lockedHelProxyFilesDir;
  }
  const helModulesDir = getHelModulesPath();
  const helProxyFilesDir = path3.join(helModulesDir, "./.proxy");
  lockedHelProxyFilesDir = helProxyFilesDir;
  if (!fs.existsSync(lockedHelProxyFilesDir)) {
    fs.mkdirSync(lockedHelProxyFilesDir, { recursive: true });
  }
  return lockedHelProxyFilesDir;
}
function getHelLogFilesDir() {
  if (lockedHelLogFilesDir) {
    return lockedHelLogFilesDir;
  }
  const targetDir = getGlobalConfig().helLogFilesDir;
  if (targetDir) {
    lockedHelLogFilesDir = targetDir;
    return lockedHelLogFilesDir;
  }
  const helModulesDir = getHelModulesPath();
  const helLogFilesDir = path3.join(helModulesDir, "./.log");
  lockedHelLogFilesDir = helLogFilesDir;
  if (!fs.existsSync(lockedHelLogFilesDir)) {
    fs.mkdirSync(lockedHelLogFilesDir, { recursive: true });
  }
  return lockedHelLogFilesDir;
}
function getModRootDirName(helModName, platform = PLATFORM) {
  const prefix = platform !== PLATFORM ? `${platform}+` : "";
  if (helModName.startsWith("@")) {
    const [scope, name] = helModName.split("/");
    return `${prefix}${scope}+${name}`;
  }
  return `${prefix}${helModName}`;
}
function getModRootDirData(params) {
  const {
    meta: { app, version },
    webDirPath
  } = params;
  const platform = params.platform || app.platform || PLATFORM;
  const { name } = app;
  const modRootDirName = getModRootDirName(name, platform);
  if (!webDirPath) {
    return { modRootDirName, modVer: version.sub_app_version };
  }
  const strList = webDirPath.split("/");
  let modNameAndVer = lastNItem(strList);
  if (HEL_DIST === modNameAndVer) {
    modNameAndVer = lastNItem(strList, 2);
  }
  let modVer = "";
  if (!modNameAndVer.includes(name)) {
    modVer = modNameAndVer;
  } else {
    const [, ver] = modNameAndVer.split(name);
    const hasDelimiter = ver.startsWith("_") || ver.startsWith("@");
    modVer = hasDelimiter ? ver.substring(1) : ver;
  }
  if (modVer.includes("@")) {
    const [, ver] = modVer.split("@");
    modVer = ver;
  }
  return { modRootDirName, modVer };
}
function getFilePathData(webDirPath, url) {
  let [, relativePathName = ""] = url.split(webDirPath);
  relativePathName = relativePathName.substring(1);
  const list = relativePathName.split("/");
  const len = list.length;
  const fileName = list[len - 1];
  if (len === 1) {
    return { relativeDir: "", fileName, fileRelPath: INDEX_JS };
  }
  const dirNames = list.slice(0, len - 1);
  const relativeDir = dirNames.join("/");
  return { relativeDir, fileName, fileRelPath: `${relativeDir}/${fileName}` };
}
function getModRootDirPath(modRootDirName) {
  const helModulesPath = getHelModulesPath();
  const modRootDirPath = path3.join(helModulesPath, `./${modRootDirName}`);
  return modRootDirPath;
}
function getModPathData(webFile) {
  const { urls, webDirPath, indexUrl, relPath, name, modRootDirName, modVer } = webFile;
  const modRootDirPath = getModRootDirPath(modRootDirName);
  const modDirPath = path3.join(modRootDirPath, `./${modVer}`);
  if (!fs.existsSync(modDirPath)) {
    fs.mkdirSync(modDirPath, { recursive: true });
  }
  if (!urls.length) {
    throw new Error(`no files for ${name}`);
  }
  const fileDownloadInfos = [];
  const oneUrl = urls[0];
  const isMainMod = relPath === INDEX_JS;
  let modPath = "";
  let modRelPath = "";
  let mainModPath = "";
  if (indexUrl && !urls.includes(indexUrl)) {
    throw new Error(`${indexUrl} is not in (${urls})`);
  }
  if (urls.length === 1) {
    const { relativeDir, fileName, fileRelPath } = getFilePathData(webDirPath, oneUrl);
    fileDownloadInfos.push({ url: oneUrl, fileDir: path3.join(modDirPath, relativeDir), fileName });
    if (!isMainMod && relPath !== fileRelPath) {
      throw new Error(`no server mod entry file for ${relPath}`);
    }
    modPath = path3.join(modDirPath, fileRelPath);
    modRelPath = INDEX_JS;
    mainModPath = modPath;
  } else {
    for (const url of urls) {
      const { relativeDir, fileName, fileRelPath } = getFilePathData(webDirPath, url);
      const tmpModPath = path3.join(modDirPath, fileRelPath);
      const isMainModUrl = indexUrl === url;
      if (isMainMod && isMainModUrl || !isMainMod && fileRelPath === relPath) {
        modPath = tmpModPath;
        modRelPath = fileRelPath;
      }
      if (isMainModUrl) {
        mainModPath = tmpModPath;
      }
      fileDownloadInfos.push({ url, fileDir: path3.join(modDirPath, relativeDir), fileName });
    }
    if (!modRelPath) {
      throw new Error(`no server mod entry file for ${name}/${relPath}`);
    }
  }
  return { modPath, modRelPath, isMainMod, mainModPath, modDirPath, modRootDirPath, modVer, fileDownloadInfos };
}
var lockedHelModulesDir, lockedHelProxyFilesDir, lockedHelLogFilesDir;
var init_path_helper = __esm({
  "src/base/path-helper.ts"() {
    init_global_config();
    init_consts();
    init_mod_consts();
    init_util();
    lockedHelModulesDir = "";
    lockedHelProxyFilesDir = "";
    lockedHelLogFilesDir = "";
  }
});

// src/mod-view/consts.ts
var UPDATE_INTERVAL, STATUS_OK, SET_BY, HEL_SOCKET_URL;
var init_consts2 = __esm({
  "src/mod-view/consts.ts"() {
    UPDATE_INTERVAL = 3 * 60 * 1e3;
    STATUS_OK = "0";
    SET_BY = {
      init: "init",
      timer: "timer",
      watch: "watch"
    };
    HEL_SOCKET_URL = "";
  }
});

// src/context/index.ts
function getRestOptions(passOptions) {
  const _a = passOptions, { mod2conf, modNames } = _a, rest = __objRest(_a, ["mod2conf", "modNames"]);
  return rest;
}
function makeSdkCtx(platform, options) {
  const { registrationSource = "", isActive = false } = options;
  const sdkCtx = {
    api: {},
    platform,
    registrationSource,
    isActive,
    helpackApiUrl: HEL_API_URL,
    isApiUrlOverwrite: false,
    helpackSocketUrl: HEL_SOCKET_URL,
    helSdkSrc: HEL_SDK_SRC,
    helEntrySrc: "",
    mod2conf: {},
    modNames: [],
    reporter: {
      reportError: () => "",
      reportInfo: () => ""
    },
    view2assetName: {},
    assetNameInfos: [],
    assetName2view: {},
    view2appName: {},
    careAllModsChange: false,
    isPreloadMode: false,
    helMetaBackupFilePath: "",
    getHelRenderParams: (cbParams) => Promise.resolve({ viewPath: cbParams.viewPath, pageData: cbParams.pageData }),
    regHooks: defaultHooks,
    bizHooks: defaultHooks,
    confHooks: defaultHooks,
    getEnvInfo: () => null,
    shouldAcceptVersion: () => true
  };
  return sdkCtx;
}
function getSdkCtx(platform = PLATFORM) {
  let sdkCtx = sdkCtxDict[platform];
  if (!sdkCtx) {
    sdkCtx = makeSdkCtx(platform, { isActive: false });
    sdkCtxDict[platform] = sdkCtx;
  }
  return sdkCtx;
}
function mergeConfig(config) {
  const sdkCtx = getSdkCtx(config.platform);
  const { helpackApiUrl, helpackSocketUrl, careAllModsChange, hooks = {}, helMetaBackupFilePath } = config;
  const toMerge = {
    helpackSocketUrl,
    helpackApiUrl,
    careAllModsChange,
    helMetaBackupFilePath
  };
  Object.assign(sdkCtx, purify(toMerge));
  Object.assign(sdkCtx.confHooks, purifyFn(hooks));
}
function mergeOptions(passOptions) {
  const sdkCtx = getSdkCtx(passOptions.platform);
  const { modNames, mod2conf } = sdkCtx;
  const assetNameInfos = [];
  const assetName2view = {};
  const view2appName = {};
  const { view2assetName = {}, deps = {} } = passOptions;
  Object.keys(view2assetName).forEach((view) => {
    const assetName = view2assetName[view];
    if (!assetName.includes("/")) {
      throw new Error("assetName must be prefixed with helModName, a valid example may be like this: xxxMod/xxxAssetName");
    }
    const [appName, entryName] = assetName.split("/");
    assetNameInfos.push({ appName, entryName, name: assetName });
    assetName2view[assetName] = view;
    view2appName[view] = appName;
  });
  const passMod2conf = passOptions.mod2conf || {};
  Object.keys(passMod2conf).forEach((name) => {
    uniqueStrPush(modNames, name);
    const newConf = passMod2conf[name];
    const storedConf = mod2conf[name];
    if (storedConf) {
      Object.assign(storedConf, newConf);
    } else {
      mod2conf[name] = newConf;
    }
  });
  const rest = getRestOptions(passOptions);
  Object.assign(sdkCtx, rest, { assetNameInfos, assetName2view, view2appName });
  if (deps.reporter) {
    sdkCtx.reporter = deps.reporter;
  }
}
function addBizHooks(hooks, platform) {
  if (isAddBizHooksCalled) {
    return false;
  }
  const sdkCtx = getSdkCtx(platform);
  Object.assign(sdkCtx.bizHooks, purifyFn(hooks));
  isAddBizHooksCalled = true;
  return true;
}
var defaultHooks, isAddBizHooksCalled, defaultSdkCtx, sdkCtxDict;
var init_context = __esm({
  "src/context/index.ts"() {
    init_consts();
    init_util();
    init_consts2();
    defaultHooks = {
      onInitialHelMetaFetched: noop,
      onHelModLoaded: noop,
      onMessageReceived: noop
    };
    isAddBizHooksCalled = false;
    defaultSdkCtx = makeSdkCtx(PLATFORM, { registrationSource: SDK_NAME, isActive: true });
    sdkCtxDict = { [PLATFORM]: defaultSdkCtx };
  }
});

// src/base/logger.ts


function print(...args) {
  if (String(args[0] || "").includes("Cannot set properties of")) {
    console.trace(...args);
  }
  if (String(args[0] || "").includes("Cannot find module")) {
    console.trace(...args);
  }
  console.log(...args);
}
function printWarn(...args) {
  console.error(...args);
}
function writeLog(msg) {
  const dir = getHelLogFilesDir();
  const file = path4.join(dir, "./running.log");
  const time = (/* @__PURE__ */ new Date()).toLocaleString();
  fs2.appendFileSync(file, `[${time}]: ${msg}
`);
}
var init_logger = __esm({
  "src/base/logger.ts"() {
    init_path_helper();
  }
});

// src/base/mem-logger.ts
function recordMemLog(options) {
  const { type, subType = "", desc = "", data, f1 = "", f2 = "" } = options;
  const item = {
    type,
    subType,
    desc,
    data,
    f1,
    f2,
    time: (/* @__PURE__ */ new Date()).toLocaleString()
  };
  logs.unshift(item);
  if (logs.length > recordLimit) {
    logs.splice(logs.length - 1);
  }
}
function rawLog(...args) {
  if (!CTX_ENV.isProd) {
    print(...args);
  }
}
function getMemLogs(options) {
  const { type, subType } = options || {};
  let targetLogs = type ? logs.filter((v) => v.type === type) : logs;
  targetLogs = subType ? targetLogs.filter((v) => v.subType === subType) : targetLogs;
  return targetLogs;
}
var logs, recordLimit;
var init_mem_logger = __esm({
  "src/base/mem-logger.ts"() {
    init_consts();
    init_logger();
    logs = [];
    recordLimit = 100;
  }
});

// src/server-mod/util.ts

function extractFnAndDictProps(source) {
  if (!isModuleLike(source)) {
    throw new Error("Source module must be a plain json object!");
  }
  const fnProps = {};
  const dictProps = {};
  Object.keys(source).forEach((key) => {
    const val = source[key];
    if (isFn(val)) {
      fnProps[key] = true;
    } else if (isModuleLike(val)) {
      dictProps[key] = true;
    }
  });
  return { fnProps, dictProps };
}
function wait(ms = 1e3) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function loadJson(jsonFilePath, defaultVal) {
  try {
    const data = fs3.readFileSync(jsonFilePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return defaultVal;
  }
}
function safeUnlinkFile(filePath) {
  try {
    fs3.unlinkSync(filePath);
  } catch (err) {
    recordMemLog({ type: "ModIns", subType: "safeUnlinkFile", desc: err.message, data: filePath });
  }
}
function noSlash(str) {
  if (str.endsWith("/")) {
    return str.substring(0, str.length - 1);
  }
  return str;
}
var init_util2 = __esm({
  "src/server-mod/util.ts"() {
    init_mem_logger();
    init_util();
  }
});

// src/server-mod/file-helper.ts

var _fsextra = require('fs-extra'); var fsExtra = _interopRequireWildcard(_fsextra);
var _helfetchfile = require('hel-fetch-file'); var _helfetchfile2 = _interopRequireDefault(_helfetchfile);

async function downloadFile(fileWebPath, fileLocalPath) {
  const list = fileLocalPath.split("/");
  const [filename] = list.splice(list.length - 1, 1);
  const fileDir = list.join("/");
  await _helfetchfile2.default.call(void 0, fileWebPath, fileDir, { filename });
}
function getPrepareFilesParams(name, modDirPath, fileInfos) {
  const filePaths = fileInfos.map((v) => ({ fileLocalPath: path5.join(v.fileDir, v.fileName), fileWebPath: v.url }));
  const writeIndexContent = (content) => {
    const indexFile = path5.join(modDirPath, "./index.js");
    fs4.writeFileSync(indexFile, content, { encoding: "utf8" });
  };
  const params = { modDirPath, filePaths, name, downloadFile, writeIndexContent };
  return params;
}
async function downloadModFiles(fileInfos, options, retryCount = 1) {
  if (retryCount === 1) {
    print(`start download ${options.webFile.webDirPath}`);
    const dirMarked = {};
    fileInfos.forEach(({ fileDir }) => {
      if (dirMarked[fileDir]) {
        return;
      }
      if (!fs4.existsSync(fileDir)) {
        fs4.mkdirSync(fileDir, { recursive: true });
      }
      dirMarked[fileDir] = true;
    });
  }
  try {
    const { prepareFiles, modDirPath, name, onSuccess, meta } = options;
    let hasMetaFile = false;
    if (prepareFiles) {
      const params = getPrepareFilesParams(name, modDirPath, fileInfos);
      await Promise.resolve(prepareFiles(params));
    } else {
      await Promise.all(
        fileInfos.map(({ url, fileDir, fileName }) => {
          if (HEL_META_JSON === fileName && !hasMetaFile) {
            hasMetaFile = true;
          }
          return _helfetchfile2.default.call(void 0, url, fileDir, { filename: fileName });
        })
      );
    }
    if (options.onFilesReady) {
      const files = getDirFileList(modDirPath);
      await Promise.resolve(options.onFilesReady({ modDirPath, files, name, meta }));
    }
    if (!hasMetaFile && meta) {
      const metaFilePath = path5.join(modDirPath, HEL_META_JSON);
      fs4.writeFileSync(metaFilePath, JSON.stringify(meta, null, 2));
    }
    onSuccess();
  } catch (err) {
    if (retryCount < DOWNLOAD_RETRY_LIMIT) {
      await downloadModFiles(fileInfos, options, retryCount + 1);
    } else {
      options.onFailed();
      throw err;
    }
  }
}
function getIsFilesReusable(fileDownloadInfos) {
  let fileExistCount = 0;
  fileDownloadInfos.forEach(({ fileDir, fileName }) => {
    if (fs4.existsSync(path5.join(fileDir, fileName))) {
      fileExistCount += 1;
    }
  });
  const isFilesReusable = fileExistCount === fileDownloadInfos.length;
  return isFilesReusable;
}
function delFileOrDir(fileOrDirPath, options) {
  var _a, _b;
  try {
    if (fs4.existsSync(fileOrDirPath)) {
      fs4.rmSync(fileOrDirPath, { recursive: true, force: true });
      (_a = options == null ? void 0 : options.onSuccess) == null ? void 0 : _a.call(options);
    }
  } catch (err) {
    (_b = options == null ? void 0 : options.onFail) == null ? void 0 : _b.call(options, err);
  }
}
function cpSync(fromDirPath, toDirPath) {
  fsExtra.copySync(fromDirPath, toDirPath);
}
var init_file_helper = __esm({
  "src/server-mod/file-helper.ts"() {
    init_logger();
    init_mod_consts();
    init_path_helper();
  }
});

// src/server-mod/lock-file.ts


async function waitLockFileDeleted(lockFile) {
  rawLog(`[gwmi]: found lock file exist ${lockFile}`);
  let curWaitTotalMs = 0;
  let lockFileExist = true;
  while (lockFileExist && curWaitTotalMs <= HEL_LOCK_FILE_VALID_TIME_MS) {
    await wait(WAIT_INTERVAL_MS);
    curWaitTotalMs += WAIT_INTERVAL_MS;
    if (!fs5.existsSync(lockFile)) {
      lockFileExist = false;
      rawLog("[gwmi]: found lock file deleted");
    } else {
      rawLog(`[gwmi]: found lock file still exist after ${curWaitTotalMs} ms`);
    }
  }
}
function getLockFilePath(modDir) {
  const lockFilePath = path6.join(modDir, "./hel-download-lock.json");
  return lockFilePath;
}
function createLockFile(lockFilePath) {
  try {
    fs5.writeFileSync(lockFilePath, `{"time":${Date.now()},"wid": ${SERVER_INFO.workerId}}`);
    return true;
  } catch (err) {
    return false;
  }
}
function isLockFileValid(lockFilePath) {
  const lockData = loadJson(lockFilePath, { time: 0, wid: 0 });
  return Date.now() - lockData.time < HEL_LOCK_FILE_VALID_TIME_MS;
}
var init_lock_file = __esm({
  "src/server-mod/lock-file.ts"() {
    init_consts();
    init_mem_logger();
    init_mod_consts();
    init_util2();
  }
});

// src/server-mod/mod-ins.ts

function getModByPath(modPath, options) {
  const { allowNull = false, shouldResolve = false } = options || {};
  try {
    if (!modPath && allowNull) {
      return null;
    }
    const path10 = shouldResolve ? resolveNodeModPath(modPath) : modPath;
    const mod2 = __require(path10);
    return mod2;
  } catch (err) {
    if (!allowNull) {
      throw err;
    }
    return null;
  }
}
function getDiskModInsByInitPath(initPath, modVer = MOD_INIT_VER) {
  const mod2 = getModByPath(initPath);
  let modDirPath = initPath;
  let modRootDirPath = "";
  if (initPath.endsWith(".js")) {
    const list = initPath.split("/");
    const len = list.length;
    modDirPath = list.slice(0, len - 1).join("/");
    modRootDirPath = modDirPath;
    if (len > 2) {
      modRootDirPath = list.slice(0, len - 1).join("/");
    }
  }
  return {
    mod: mod2,
    modPath: initPath,
    isMainMod: true,
    mainModPath: initPath,
    modRelPath: INDEX_JS,
    modDirPath,
    modRootDirPath,
    modVer,
    isInit: true
  };
}
function getDiskModIns(webFile) {
  const { modPath, modDirPath, modRootDirPath, modVer, modRelPath, isMainMod, mainModPath } = getModPathData(webFile);
  const mod2 = getModByPath(modPath);
  return { mod: mod2, modPath, modRelPath, isMainMod, mainModPath, modDirPath, modRootDirPath, modVer, isInit: false };
}
async function prepareWebModFiles(webFile, options) {
  var _a;
  const reuseLocalFiles = (_a = options.reuseLocalFiles) != null ? _a : true;
  const modPathData = getModPathData(webFile);
  const { modDirPath, fileDownloadInfos } = modPathData;
  const { name } = webFile;
  if (!reuseLocalFiles || !getIsFilesReusable(fileDownloadInfos) || !webFile.webDirPath) {
    const lockFilePath = getLockFilePath(modDirPath);
    let isCurrentWorkerCreateLockFile = false;
    if (fs6.existsSync(lockFilePath) && isLockFileValid(lockFilePath)) {
      await waitLockFileDeleted(lockFilePath);
    } else {
      createLockFile(lockFilePath);
      isCurrentWorkerCreateLockFile = true;
    }
    if (
      // 非当前 worker 创建锁文件时，执行到这里表示锁文件已释放，检查一下文件是否可复用即可
      !isCurrentWorkerCreateLockFile && !getIsFilesReusable(fileDownloadInfos) || isCurrentWorkerCreateLockFile
    ) {
      const delLockFile = () => {
        if (isCurrentWorkerCreateLockFile) {
          safeUnlinkFile(lockFilePath);
        }
      };
      await downloadModFiles(
        fileDownloadInfos,
        // prettier-ignore
        __spreadProps(__spreadValues({}, options), { onSuccess: delLockFile, onFailed: delLockFile, modDirPath, name, webFile })
      );
    }
  }
  return modPathData;
}
async function getWebModIns(webFile, options) {
  const modPathData = await prepareWebModFiles(webFile, options);
  const { modPath, modRelPath, isMainMod, mainModPath, modDirPath, modRootDirPath, modVer } = modPathData;
  const mod2 = getModByPath(modPath);
  return { mod: mod2, modPath, modRelPath, isMainMod, mainModPath, modDirPath, modRootDirPath, modVer, isInit: false };
}
function getCustomModIns(webFile, prepareFilesSync, onFilesReady) {
  const { modPath, modRelPath, isMainMod, mainModPath, modDirPath, modRootDirPath, modVer, fileDownloadInfos } = getModPathData(webFile);
  const cbParams = getPrepareFilesParams(webFile.name, modDirPath, fileDownloadInfos);
  prepareFilesSync(cbParams);
  if (onFilesReady) {
    const files = getDirFileList(modDirPath);
    onFilesReady({ modDirPath, files, name: webFile.name });
  }
  const mod2 = getModByPath(modPath);
  return { mod: mod2, modPath, modRelPath, isMainMod, mainModPath, modDirPath, modRootDirPath, modVer, isInit: false };
}
var init_mod_ins = __esm({
  "src/server-mod/mod-ins.ts"() {
    init_mod_consts();
    init_file_helper();
    init_lock_file();
    init_path_helper();
    init_util2();
  }
});

// src/server-mod/mod-name.ts
function extractNameData(helModNameOrPath, platform = PLATFORM) {
  let helModName = helModNameOrPath;
  const helModPath = helModNameOrPath;
  let relPath = INDEX_JS;
  let proxyFileName = `${helModNameOrPath}.js`;
  const splittedList = helModNameOrPath.split("/");
  const includeSlash = splittedList.length > 1;
  if (helModNameOrPath.startsWith("@")) {
    if (!includeSlash) {
      throw new Error(`Found invalid scoped helModName ${helModNameOrPath}`);
    }
    const [scope, name, ...rest] = splittedList;
    helModName = `${scope}/${name}`;
    relPath = rest.join("/");
    proxyFileName = `${scope}+${name}.js`;
  } else if (includeSlash) {
    const [name, ...rest] = splittedList;
    helModName = name;
    relPath = rest.join("/");
    proxyFileName = `${name}.js`;
  }
  if (platform !== PLATFORM) {
    proxyFileName = `${platform}+${proxyFileName}`;
  }
  const hasFileExt = relPath.endsWith(".js") || relPath.endsWith(".cjs") || relPath.endsWith(".mjs");
  if (!hasFileExt) {
    relPath = relPath ? `${relPath}/${INDEX_JS}` : INDEX_JS;
  }
  return { helModName, relPath, helModPath, helModNameOrPath, proxyFileName };
}
var init_mod_name = __esm({
  "src/server-mod/mod-name.ts"() {
    init_consts();
    init_mod_consts();
  }
});

// src/server-mod/map-node-helper.ts
function getModShape(nodeModName, options) {
  let fnProps = {};
  let dictProps = {};
  let isShapeReady = false;
  if (options.modShape) {
    const { fnKeys = [], dictKeys = [] } = options.modShape;
    fnProps = strItems2Dict(fnKeys, true);
    dictProps = strItems2Dict(dictKeys, true);
    isShapeReady = true;
  } else if (isRunInJest()) {
    const modPath = resolveNodeModPath(nodeModName, true);
    const mod2 = getModByPath(modPath, { allowNull: true });
    if (mod2) {
      const result = extractFnAndDictProps(mod2);
      fnProps = result.fnProps;
      dictProps = result.dictProps;
      isShapeReady = true;
    }
  } else if (options.dangerouslyNoModShape) {
    isShapeReady = true;
  }
  return { fnProps, dictProps, isShapeReady };
}
function formatAndCheckModMapper(modMapper, checkData) {
  const stdMapper = {};
  const { modVerDict, modApiUrlDict } = checkData;
  Object.keys(modMapper).forEach((nodeModName) => {
    let val = modMapper[nodeModName];
    if (!val) {
      return;
    }
    if (typeof val === "string") {
      val = { helModName: val };
    } else if (typeof val === "boolean") {
      val = { helModName: nodeModName };
    }
    const { ver, helpackApiUrl } = val;
    const { helModName } = extractNameData(val.helModName || nodeModName);
    if (ver) {
      if (modVerDict[helModName]) {
        throw new Error(`specified different ver for hel module ${helModName}`);
      } else {
        modVerDict[helModName] = ver;
      }
    }
    if (helpackApiUrl) {
      if (modApiUrlDict[helModName]) {
        throw new Error(`specified different helpackApiUrl for hel module ${helModName}`);
      } else {
        modApiUrlDict[helModName] = helpackApiUrl;
      }
    }
    stdMapper[nodeModName] = val;
  });
  return stdMapper;
}
var init_map_node_helper = __esm({
  "src/server-mod/map-node-helper.ts"() {
    init_path_helper();
    init_util();
    init_util2();
    init_jest_env();
    init_mod_ins();
    init_mod_name();
  }
});

// src/server-mod/mod-tpl-helper.ts
function replaceTpl(content, nodeModName) {
  let newContent = content;
  newContent = newContent.replace(`./${MOD_MGR_DIR_NAME}`, `../${MOD_MGR_DIR_NAME}`);
  newContent = newContent.replace(`./${MAP_NODE_MOD_DIR_NAME}`, `../${MAP_NODE_MOD_DIR_NAME}`);
  newContent = newContent.replace(KW_NODE_MOD_NAME, nodeModName);
  return newContent;
}
var init_mod_tpl_helper = __esm({
  "src/server-mod/mod-tpl-helper.ts"() {
    init_mod_consts();
  }
});

// src/server-mod/map-node-mods.ts


function makeMapDetail() {
  return {
    mod2isPreloadTriggered: {},
    modOrPath2plat: {},
    mod2nodeName: {},
    mod2fetchOptions: {},
    mod2helModPaths: {},
    prepareFilesFns: {},
    helModFileCount: {},
    proxyFiles: {}
  };
}
var MapNodeModsManager, mapNodeModsManager;
var init_map_node_mods = __esm({
  "src/server-mod/map-node-mods.ts"() {
    init_consts();
    init_mod_consts();
    init_path_helper();
    init_util();
    init_context();
    init_map_node_helper();
    init_mod_ins();
    init_mod_name();
    init_mod_tpl_helper();
    MapNodeModsManager = class {
      constructor() {
        this.nodeName2data = {};
        this.mapDetails = { [PLATFORM]: makeMapDetail() };
        this.checkData = { modVerDict: {}, modApiUrlDict: {} };
      }
      /**
       * 获取node模块对应的hel代理模块文件路径
       */
      getProxyFile(pkgName, helModOrPath, sourceFullPath) {
        const { platform } = this.getNodeModData(pkgName);
        const mapDetail = this.getMapDetail(platform);
        const data = safeGet(this.nodeName2data, pkgName, { fallback: {} });
        data.rawPath = sourceFullPath;
        const { proxyFiles } = mapDetail;
        let proxyFile = proxyFiles[helModOrPath];
        if (!proxyFile) {
          proxyFile = this.genProxyModFile(pkgName, helModOrPath);
        }
        return proxyFile;
      }
      getNodeModData(nodeModName, allowFake = true) {
        const realData = this.nodeName2data[nodeModName];
        if (!realData && !allowFake) {
          throw new Error(`Unmapped node module ${nodeModName}`);
        }
        return realData || {
          helModName: "",
          helPath: "",
          platform: PLATFORM,
          fallback: { force: false, mod: null, path: "" },
          rawPath: "",
          proxyFilePath: "",
          fnProps: {},
          dictProps: {},
          isShapeReady: false
        };
      }
      getMappedPath(nodeModName) {
        return this.getNodeModData(nodeModName).helPath;
      }
      isFallbackModExist(nodeModName) {
        const { fallback } = this.getNodeModData(nodeModName);
        if (fallback.mod) {
          return true;
        }
        if (getModByPath(fallback.path, { allowNull: true })) {
          return true;
        }
        if (resolveNodeModPath(nodeModName, true)) {
          return true;
        }
        return false;
      }
      isModShapeExist(nodeModName) {
        const { isShapeReady } = this.getNodeModData(nodeModName);
        return isShapeReady;
      }
      getFallbackMod(helModNameOrPath, platform) {
        const nodeModName = this.getNodeModName(helModNameOrPath, platform);
        if (!nodeModName) {
          return null;
        }
        const { fallback } = this.getNodeModData(nodeModName);
        return fallback.mod || getModByPath(fallback.path, { allowNull: true }) || getModByPath(nodeModName, { allowNull: true });
      }
      getMappedApiUrl(helModName) {
        return this.checkData.modApiUrlDict[helModName] || "";
      }
      /**
       * 获取预设的准备文件函数
       */
      getPrepareFilesFn(helModNameOrPath, platform) {
        const { helModName } = extractNameData(helModNameOrPath, platform);
        const { prepareFilesFns } = this.getMapDetail(platform);
        return prepareFilesFns[helModNameOrPath] || prepareFilesFns[helModName];
      }
      /**
       * 获取hel模块名映射的node模块包名，如获得空字符串表示上传还未映射模块关系就直接调用了 importMod
       */
      getNodeModName(helModNameOrPath, platform) {
        const { mod2nodeName } = this.getMapDetail(platform);
        return mod2nodeName[helModNameOrPath] || "";
      }
      getHelModData(helModName, platform = PLATFORM) {
        const mapDetail = this.mapDetails[platform];
        if (!mapDetail) {
          return null;
        }
        const { mod2nodeName, mod2helModPaths } = mapDetail;
        const nodeModName = mod2nodeName[helModName] || "";
        const helModPaths = mod2helModPaths[helModName] || [];
        if (!helModPaths.length) {
          return null;
        }
        return { nodeModName, helModPaths };
      }
      /**
       * 获取映射 node 模块与 hel 模块关系时的拉取 meta 的请求参数选项
       */
      getFetchOptions(helModNameOrPath, platform) {
        const { mod2fetchOptions } = this.getMapDetail(platform);
        return mod2fetchOptions[helModNameOrPath] || null;
      }
      /**
       * 获取hel模块名下所有映射的hel模块路径
       */
      getHelModPaths(helModName, platform) {
        const { mod2helModPaths } = this.getMapDetail(platform);
        return mod2helModPaths[helModName] || [];
      }
      /**
       * 获取映射的 hel 模块名称列表，不传递 onlyUntriggered 或传递 onlyUntriggered=false 时，会获取所有的，
       * 传递 onlyUntriggered=true 时，只返回未触发 preload 流程的 hel 模块名称列表
       */
      getHelModNames(platform, onlyUntriggered) {
        const { mod2helModPaths, mod2isPreloadTriggered } = this.getMapDetail(platform);
        const helModNames = Object.keys(mod2helModPaths);
        if (!onlyUntriggered) {
          return helModNames;
        }
        const untriggeredNames = [];
        helModNames.forEach((name) => {
          if (!mod2isPreloadTriggered[name]) {
            untriggeredNames.push(name);
          }
        });
        return untriggeredNames;
      }
      setIsPreloadTriggered(helModName, platform) {
        const { mod2isPreloadTriggered } = this.getMapDetail(platform);
        mod2isPreloadTriggered[helModName] = true;
      }
      /**
       * 设置node模块与hel模块配置的映射关系
       */
      setModMapper(modMapper) {
        const stdMapper = formatAndCheckModMapper(modMapper, this.checkData);
        Object.keys(stdMapper).forEach((nodeModName) => {
          const val = stdMapper[nodeModName];
          const { prepareFiles, platform = PLATFORM, ver, projId, branch, gray, helpackApiUrl = "" } = val;
          const fallback = Object.assign({ force: false, mod: null, path: "" }, val.fallback || {});
          const fetchOptions = { platform, ver, projId, branch, gray, helpackApiUrl };
          const helModNameOrPath = val.helModName || nodeModName;
          const detail = this.getMapDetail(platform);
          const { mod2nodeName, mod2fetchOptions, modOrPath2plat, mod2helModPaths, prepareFilesFns } = detail;
          const mappedHelMod = this.getNodeModData(nodeModName).helModName;
          if (mappedHelMod) {
            const errTip = `Node module '${nodeModName}' has been mapped to hel module '${mappedHelMod}', you can not map it to ${helModNameOrPath} again!`;
            throw new Error(errTip);
          }
          const { helModName } = extractNameData(helModNameOrPath, platform);
          mod2nodeName[helModNameOrPath] = nodeModName;
          mod2nodeName[helModName] = nodeModName;
          mod2fetchOptions[helModName] = fetchOptions;
          modOrPath2plat[helModNameOrPath] = platform;
          modOrPath2plat[helModName] = platform;
          const helModPaths = safeGet(mod2helModPaths, helModName, []);
          uniqueStrPush(helModPaths, helModNameOrPath);
          if (prepareFiles) {
            prepareFilesFns[helModName] = prepareFiles;
            prepareFilesFns[helModNameOrPath] = prepareFiles;
          }
          const { fnProps, dictProps, isShapeReady } = getModShape(nodeModName, val);
          this.nodeName2data[nodeModName] = {
            helModName,
            helPath: helModNameOrPath,
            platform,
            fallback,
            rawPath: "",
            proxyFilePath: "",
            fnProps,
            dictProps,
            isShapeReady
          };
        });
      }
      /**
       * 根据 MOD_TPL 模板生成新的代理模块文件
       */
      genProxyModFile(nodeModName, helModOrPath) {
        const { platform } = this.getNodeModData(nodeModName);
        const { helModName, proxyFileName } = extractNameData(helModOrPath, platform);
        const detail = this.getMapDetail(platform);
        if (this.getProxyFileCount(helModName, platform) === FILE_SUBPATH_LIMIT) {
          throw new Error(`Too much sub path for ${helModName}, currently limit ${FILE_SUBPATH_LIMIT}`);
        }
        let content = COMPILED_PROXY_FILE_TPL;
        content = replaceTpl(content, nodeModName);
        const proxyFilePath = path7.join(getHelProxyFilesDir(), proxyFileName);
        fs7.writeFileSync(proxyFilePath, content);
        detail.proxyFiles[helModOrPath] = proxyFilePath;
        this.getNodeModData(nodeModName).proxyFilePath = proxyFilePath;
        this.incProxyFileCount(helModName, platform);
        return proxyFilePath;
      }
      /**
       * 对hel模块对应的导出文件数量加1
       */
      incProxyFileCount(helMod, platform) {
        const { helModFileCount } = this.getMapDetail(platform);
        if (!helModFileCount[helMod]) {
          helModFileCount[helMod] = 1;
        } else {
          helModFileCount[helMod] += 1;
        }
      }
      /**
       * 获取hel模块对应的导出文件数量
       */
      getProxyFileCount(helMod, platform) {
        const { helModFileCount } = this.getMapDetail(platform);
        return helModFileCount[helMod] || 0;
      }
      getMapDetail(platform) {
        noop(getSdkCtx(platform));
        let mapDetail = this.mapDetails[platform];
        if (!mapDetail) {
          mapDetail = makeMapDetail();
          this.mapDetails[platform] = mapDetail;
        }
        return mapDetail;
      }
    };
    mapNodeModsManager = new MapNodeModsManager();
  }
});

// src/context/facade.ts
function getEnsuredModConf(appName, platform) {
  const sdkCtx = getSdkCtx(platform);
  const modConf = sdkCtx.mod2conf[appName];
  return modConf;
}
function getModDerivedConf(platform) {
  const sdkCtx = getSdkCtx(platform);
  const { assetNameInfos, assetName2view } = sdkCtx;
  return { assetNameInfos, assetName2view };
}
function getCaredModNames(platform) {
  const sdkCtx = getSdkCtx(platform);
  const namesForNode = mapNodeModsManager.getHelModNames(platform);
  const namesForRender = sdkCtx.modNames;
  const names = Array.from(new Set(namesForNode.concat(namesForRender)));
  return names;
}
function getMappedModFetchOptions(helModName, platform) {
  const sdkCtx = getSdkCtx(platform);
  const { fetchOptions } = sdkCtx.mod2conf[helModName] || {};
  return fetchOptions || null;
}
function isModMapped(platform, helModOrPath) {
  const { helModName } = extractNameData(helModOrPath, platform);
  const helModNames = getCaredModNames(platform);
  return helModNames.includes(helModName);
}
function shouldAcceptVersion(params) {
  const sdkCtx = getSdkCtx(params.platform);
  if (sdkCtx.shouldAcceptVersion) {
    return sdkCtx.shouldAcceptVersion(params);
  }
  const sdkConf = getGlobalConfig();
  if (sdkConf.shouldAcceptVersion) {
    return sdkConf.shouldAcceptVersion(params);
  }
  return true;
}
var init_facade = __esm({
  "src/context/facade.ts"() {
    init_context();
    init_global_config();
    init_map_node_mods();
    init_mod_name();
  }
});

// src/base/clear-module.ts
var _clearmodule = require('clear-module'); var mod = _interopRequireWildcard(_clearmodule);
function clearModule(path10) {
  const clearFn = mod.default || mod;
  clearFn(path10);
}
var init_clear_module = __esm({
  "src/base/clear-module.ts"() {
  }
});

// src/context/hooks.ts
function triggerHook(hookType, params, platform) {
  const { regHooks, confHooks, bizHooks } = getSdkCtx(platform);
  regHooks[hookType](params);
  confHooks[hookType](params);
  bizHooks[hookType](params);
}
function isHookValid(hookType, platform) {
  const { regHooks, confHooks, bizHooks } = getSdkCtx(platform);
  return regHooks[hookType] !== noop || confHooks[hookType] !== noop || bizHooks[hookType] !== noop;
}
var init_hooks = __esm({
  "src/context/hooks.ts"() {
    init_util();
    init_context();
  }
});

// src/server-mod/mod-meta-helper.ts
function isHelpackMeta(meta) {
  const mayHelpackMeta = meta;
  return !!mayHelpackMeta.app.proj_ver;
}
function cutHelMeta(fullMeta) {
  if (!isHelpackMeta(fullMeta)) {
    return fullMeta;
  }
  const { id, name, app_group_name, proj_ver, online_version, build_version, update_at } = fullMeta.app;
  const { sub_app_name, sub_app_version, src_map, update_at: verUpdateAt, create_at: createAt } = fullMeta.version;
  return {
    app: {
      id,
      name,
      app_group_name,
      proj_ver,
      online_version,
      build_version,
      update_at
    },
    version: {
      sub_app_name,
      sub_app_version,
      src_map,
      update_at: verUpdateAt,
      create_at: createAt,
      _worker_id: workerId
    }
  };
}
function toCssHtmlStr(cssList) {
  let cssHtmlStr = "";
  cssList.forEach((url) => {
    cssHtmlStr += `<link href="${xssFilter(url)}" rel="stylesheet">`;
  });
  return cssHtmlStr;
}
function getCssHtmlStr(version) {
  const { headAssetList, bodyAssetList, chunkCssSrcList } = version.src_map;
  const cssList = [];
  const pushUrl = (url) => {
    if (url.endsWith(".css") && !cssList.includes(url)) {
      cssList.push(url);
    }
  };
  const handleAssetItem = (item) => {
    const { append, tag } = item;
    if (!append || !["link", "staticLink"].includes(tag)) {
      return;
    }
    const url = item.attrs.href;
    if (url.endsWith(".css") && !cssList.includes(url)) {
      cssList.push(url);
    }
  };
  chunkCssSrcList.forEach(pushUrl);
  headAssetList.forEach(handleAssetItem);
  bodyAssetList.forEach(handleAssetItem);
  return toCssHtmlStr(cssList);
}
function makeModInfo(fullMeta) {
  const meta = cutHelMeta(fullMeta);
  const cssHtmlStr = getCssHtmlStr(fullMeta.version);
  const createTime = new Date(meta.version.create_at).getTime();
  return { name: meta.app.name, cssHtmlStr, meta, fullMeta, createTime };
}
var workerId;
var init_mod_meta_helper = __esm({
  "src/server-mod/mod-meta-helper.ts"() {
    init_consts();
    init_util();
    ({ workerId } = SERVER_INFO);
  }
});

// src/server-mod/mod-meta-url.ts
function normalizeVer(name, mayVersionIndex) {
  const verStr = String(mayVersionIndex || "");
  let ver = verStr;
  const prefix = `${name}@`;
  if (verStr.startsWith(prefix)) {
    ver = verStr.substring(prefix.length);
  }
  return ver;
}
function getRequestMetaBaseUrl(helpackApiUrl, name, ver) {
  const verTag = normalizeVer(name, ver);
  const verSeg = verTag ? `@${verTag}` : "";
  return `${helpackApiUrl}/${name}${verSeg}`;
}
function getHelpackMetaUrl(name, helpackApiUrl, options) {
  const { branch = "", gray, ver = "", projId } = options || {};
  let url = getRequestMetaBaseUrl(helpackApiUrl, name, ver);
  let andStr = "?";
  const attachVal = (key, val, mayBool) => {
    const toJudge = mayBool === void 0 ? val : mayBool;
    if (toJudge) {
      url = `${url}${andStr}${key}=${val}`;
      andStr = "&";
    }
  };
  attachVal("projId", projId);
  attachVal("branch", branch);
  if (typeof gray === "boolean") {
    attachVal("gray", gray ? AS_TRUE : AS_FALSE, true);
  }
  return url;
}
function getRequestMetaUrl(name, options) {
  const { platform = PLATFORM, ver = "", helpackApiUrl = "" } = options || {};
  const sdkCtx = getSdkCtx(platform);
  let apiUrl = helpackApiUrl || sdkCtx.helpackApiUrl;
  if (PLATFORM === platform) {
    const baseUrl = getRequestMetaBaseUrl(apiUrl, name, ver);
    return `${baseUrl}/hel_dist/hel-meta.json`;
  }
  if (PLATFORM_HEL === platform && !sdkCtx.isApiUrlOverwrite) {
    apiUrl = helpackApiUrl || HELPACK_API_URL;
  }
  return getHelpackMetaUrl(name, apiUrl, options);
}
var init_mod_meta_url = __esm({
  "src/server-mod/mod-meta-url.ts"() {
    init_consts();
    init_context();
  }
});

// src/server-mod/mod-meta.ts
var _axios = require('axios'); var _axios2 = _interopRequireDefault(_axios);
function has(obj, prop) {
  return hasProp.call(obj, prop);
}
function extractMeta(metaWrap, helModName) {
  if (!metaWrap) {
    throw new Error(`No hel mod meta found for ${helModName}`);
  }
  let app = null;
  let version = null;
  const assignValue = (data) => {
    app = data.app;
    version = data.version;
  };
  if (has(metaWrap, "data") && has(metaWrap, "status") && has(metaWrap, "statusText") && has(metaWrap, "config")) {
    if (metaWrap.status !== 200) {
      throw new Error(metaWrap.statusText);
    }
    const userData = metaWrap.data;
    if (has(userData, "code")) {
      if (userData.code !== STATUS_OK) {
        throw new Error(userData.msg || `Fetch meta failed, code ${userData.code}`);
      }
      assignValue(userData.data);
    } else {
      assignValue(userData);
    }
  } else if (has(metaWrap, "app")) {
    assignValue(metaWrap);
  }
  if (!app || !version) {
    if (app && !version) {
      throw new Error(`Hel mod ${helModName} just created on helpack but no build version data generated`);
    }
    throw new Error(`No hel mod meta found for ${helModName}`);
  }
  return { app, version };
}
async function fetchModMeta(helModName, options) {
  const _a = options || {}, { platform = PLATFORM } = _a, rest = __objRest(_a, ["platform"]);
  const sdkCtx = getSdkCtx(platform);
  let reply;
  if (sdkCtx.getMeta) {
    const params = __spreadProps(__spreadValues({}, rest), { helModName, platform });
    reply = await sdkCtx.getMeta(params);
  } else {
    const url = getRequestMetaUrl(helModName, options);
    writeLog(`fetch meta ${url}`);
    const getFn = sdkCtx.httpGet || _axios2.default.get;
    reply = await getFn(url);
  }
  const meta = extractMeta(reply, helModName);
  return meta;
}
async function fetchModInfo(helModName, options) {
  const meta = await fetchModMeta(helModName, options);
  const modInfo = makeModInfo(meta);
  return modInfo;
}
var hasProp;
var init_mod_meta = __esm({
  "src/server-mod/mod-meta.ts"() {
    init_consts();
    init_logger();
    init_context();
    init_consts2();
    init_mod_meta_helper();
    init_mod_meta_url();
    hasProp = Object.prototype.hasOwnProperty;
  }
});

// src/server-mod/fake-meta.ts
function makeMeta(platform, helModName, customVer) {
  const ver = customVer || `${Date.now()}`;
  return {
    app: {
      name: helModName,
      app_group_name: helModName,
      online_version: "",
      build_version: "",
      git_repo_url: "",
      create_at: "",
      platform
    },
    version: {
      plugin_ver: "",
      extract_mode: "build",
      sub_app_name: helModName,
      sub_app_version: ver,
      version_tag: ver,
      src_map: {
        htmlIndexSrc: "",
        webDirPath: "",
        headAssetList: [],
        bodyAssetList: [],
        chunkJsSrcList: [],
        chunkCssSrcList: [],
        staticJsSrcList: [],
        staticCssSrcList: [],
        relativeJsSrcList: [],
        relativeCssSrcList: [],
        otherSrcList: [],
        srvModSrcList: ["http://fake-meta/index.js"],
        srvModSrcIndex: ""
      },
      html_content: "",
      create_at: "",
      desc: "this is a fake hel meta"
    }
  };
}
var init_fake_meta = __esm({
  "src/server-mod/fake-meta.ts"() {
  }
});

// src/test-util/jest-mock.ts
function doJestMock(nodeModName, mod2) {
  try {
    jest.doMock(nodeModName, () => mod2);
  } catch (err) {
    if (!err.message.includes("Cannot find module")) {
      throw err;
    }
    jest.doMock(nodeModName, () => mod2, { virtual: true });
  }
}
function maySetToJestMock(platform, helModNameOrPath, mod2) {
  const key = `${platform}+helModNameOrPath`;
  if (!isRunInJest() || modSetted[key]) {
    return;
  }
  try {
    const nodeModName = mapNodeModsManager.getNodeModName(helModNameOrPath, platform);
    if (!nodeModName) {
      return;
    }
    const oriFilePath = resolveNodeModPath(nodeModName, true);
    if (oriFilePath) {
      mapNodeModsManager.getProxyFile(nodeModName, helModNameOrPath, oriFilePath);
    }
    doJestMock(nodeModName, mod2);
    modSetted[key] = true;
  } catch (err) {
    print(err.message);
    rawLog(err.message);
  }
}
var modSetted;
var init_jest_mock = __esm({
  "src/test-util/jest-mock.ts"() {
    init_logger();
    init_mem_logger();
    init_path_helper();
    init_map_node_mods();
    init_jest_env();
    modSetted = {};
  }
});

// src/test-util/index.ts
var init_test_util = __esm({
  "src/test-util/index.ts"() {
    init_jest_env();
    init_jest_mock();
  }
});

// src/server-mod/mod-manager-helper.ts
function getEnsuredIMBMOptions(meta, options) {
  const platform = options.platform || meta.app.platform || PLATFORM;
  return __spreadProps(__spreadValues({}, options), { platform });
}
function getModProxyHelpData(helModNameOrPath, platform) {
  const nodeModName = mapNodeModsManager.getNodeModName(helModNameOrPath, platform);
  const data = mapNodeModsManager.getNodeModData(nodeModName);
  const { rawPath, fallback, isShapeReady } = data;
  let { fnProps, dictProps } = data;
  let rawMod = {};
  if (!isShapeReady) {
    rawMod = getModByPath(rawPath, { allowNull: true }) || {};
    const result = extractFnAndDictProps(rawMod);
    fnProps = result.fnProps;
    dictProps = result.fnProps;
  }
  return { fnProps, dictProps, rawMod, fallback, rawPath };
}
function getHelModFilePath(helModOrPath, modItem) {
  const { modPath, exportedMods, modName, platform } = modItem;
  const isMainMod = helModOrPath === modName;
  let helModFilePath = "";
  if (isMainMod) {
    helModFilePath = modPath;
  } else {
    const { relPath } = extractNameData(helModOrPath, platform);
    const modInfo = exportedMods.get(relPath);
    helModFilePath = modInfo ? modInfo.path : "";
  }
  return helModFilePath;
}
function isHelModProxy(mayModProxy) {
  if (!mayModProxy) {
    return false;
  }
  return mayModProxy[HEL_MDO_PROXY] === IS_HEL_MOD_PROXY;
}
function mayInjectApiUrl(helModName, options) {
  const helpackApiUrl = mapNodeModsManager.getMappedApiUrl(helModName);
  const newOptions = helpackApiUrl ? Object.assign({ helpackApiUrl }, options || {}) : options;
  return newOptions;
}
async function getMetaByImportOptions(helModNameOrPath, options) {
  const optionsVar = options || {};
  const { platform = PLATFORM, skipMeta, customVer } = optionsVar;
  const { helModName } = extractNameData(helModNameOrPath, platform);
  let meta;
  if (skipMeta) {
    meta = makeMeta(platform, helModName, customVer);
  } else {
    meta = await fetchModMeta(helModName, mayInjectApiUrl(helModName, options));
  }
  return meta;
}
var init_mod_manager_helper = __esm({
  "src/server-mod/mod-manager-helper.ts"() {
    init_consts();
    init_mod_consts();
    init_fake_meta();
    init_map_node_mods();
    init_mod_ins();
    init_mod_meta();
    init_mod_name();
    init_util2();
  }
});

// src/server-mod/mod-manager.ts
var _fguard = require('@helux/f-guard');

function log(options) {
  recordMemLog(__spreadProps(__spreadValues({}, options), { type: "HelServerMod" }));
}
var ModManager, modManager;
var init_mod_manager = __esm({
  "src/server-mod/mod-manager.ts"() {
    init_consts();
    init_clear_module();
    init_util();
    init_hooks();
    init_mem_logger();
    init_logger();
    init_mod_consts();
    init_mod_meta();
    init_fake_meta();
    init_file_helper();
    init_map_node_mods();
    init_mod_ins();
    init_path_helper();
    init_test_util();
    init_mod_name();
    init_mod_manager_helper();
    init_util2();
    ModManager = class {
      constructor() {
        /** 模块管理数据映射 */
        this.modItemMap = {};
        /** 并发守护实例 */
        this.guard = new (0, _fguard.ConcurrencyGuard)();
        /** 模块代理缓存 */
        this.modProxyCache = {};
      }
      /**
       * 获取模块描述，支持传入 hel 模块名或原始模块名，
       * 需注意如果传入的是原始模块名的话，需提前在 mapNodeMod 里映射了调用才会返回有意义的值
       */
      getModDesc(helModNameOrPath, options) {
        const { platform: plat = PLATFORM } = options || {};
        const { helModName } = extractNameData(helModNameOrPath, plat);
        const modItem = this.getServerModItem(helModName, options);
        if (!modItem) {
          return {
            modName: "",
            modVer: "",
            modDirPath: "",
            modRootDirPath: "",
            modPath: "",
            downloadCount: 0,
            storedVers: [],
            exportedModPaths: {},
            firstDownloadVer: "",
            platform: plat
          };
        }
        const {
          modName,
          modVer,
          modDirPath,
          modRootDirPath,
          modPath,
          downloadCount,
          storedVers,
          exportedMods,
          firstDownloadVer,
          platform
        } = modItem;
        const exportedModPaths = {};
        exportedMods.forEach((modInfo, key) => exportedModPaths[key] = modInfo.path);
        return {
          modName,
          modVer,
          modDirPath,
          modRootDirPath,
          modPath,
          downloadCount,
          storedVers,
          exportedModPaths,
          firstDownloadVer,
          platform
        };
      }
      /**
       * 获取模块版本, 支持传入 hel 模块名或原始模块名
       */
      getModVer(helModNameOrPath, platform) {
        const { helModName } = extractNameData(helModNameOrPath, platform);
        const modItem = this.getServerModItem(helModName, { platform, allowNull: false });
        return modItem.modVer;
      }
      /**
       * 查看映射的 hel 模块路径数据
       * @example
       * 当 mapNodeMod 函数映射的hel模块被激活时，导出的模块路径会指向代理模块，形如：
       * /proj/node_modules/.hel_modules/.proxy/hel-lib-test.js
       */
      resolveMod(helModNameOrPath, platform) {
        const { helModName, helModPath } = extractNameData(helModNameOrPath, platform);
        const modItem = this.getServerModItem(helModName, { platform, allowNull: false });
        const helModInfo = mapNodeModsManager.getHelModData(helModName, platform);
        const isMainMod = helModName === helModPath;
        const { modVer } = modItem;
        if (!helModInfo) {
          return {
            nodeModName: "",
            nodeModFilePath: "",
            helModName,
            helModVer: modVer,
            helModPath,
            helModFilePath: "",
            helModFallbackPath: "",
            isMainMod,
            proxyFilePath: ""
          };
        }
        const { nodeModName } = helModInfo;
        const { rawPath, fallback, proxyFilePath } = mapNodeModsManager.getNodeModData(nodeModName);
        const helModFilePath = getHelModFilePath(helModNameOrPath, modItem);
        return {
          nodeModName,
          nodeModFilePath: rawPath,
          helModName,
          helModVer: modVer,
          helModPath,
          helModFilePath,
          helModFallbackPath: fallback.path,
          isMainMod,
          proxyFilePath
        };
      }
      /**
       * 同步获取 server 模块，确保模块已被初始化过，此同步方法才可用，
       * 提供 proxy 对象，支持用户在文件头部缓存模块根引用
       * @example 无兜底模块时，不可以在文件头部对模块引用做解构，只能在用的地方现场解构或直接调用
       * ```
       * // good 热更新能生效的写法
       * const someMod = requireMod('my-util');
       *
       * function logic(){
       *   // 直接调用
       *   someMod.callMethod();
       *   // 或写为
       *   const { callMethod } = someMod;
       *   callMethod();
       * }
       *
       * // bad 缓存住了方法引用，导致热更新失效
       * const { callMethod } = requireMod('my-util');
       * ```
       * @example 有兜底模块时，可以提前解构函数、字典对象，内部会自动创建一层包裹
       * ```
       * // ok, 热更新能正常工作，此时的 callMethod 是一个包裹函数，someDict 是一个代理对象
       * const { callMethod, someDict } = requireMod('my-util', { rawMod });
       *
       * // 如一级属性对应 primitive 类型，则不能提前解构，否则导致热更新失效
       * // bad
       * const { someNum } = requireMod('my-util', { rawMod });
       * // good;
       * const mod = requireMod('my-util', { rawMod });
       * mod.someNum; // 用的地方现获取
       *
       * // 故建议一级属性不要暴露原始类型的值，可以统一包裹到一个字典下再导出，例如
       * const { consts } = requireMod('my-util', { rawMod });
       * consts.someNum // consts 会把包裹为一个代理，用的时候才获取，此时热更新能生效
       * ```
       */
      requireMod(helModNameOrPath, options) {
        if (KW_NODE_MOD_NAME === helModNameOrPath) {
          return {};
        }
        const { platform = PLATFORM } = options || {};
        const { fnProps, dictProps, rawMod, fallback, rawPath } = getModProxyHelpData(helModNameOrPath, platform);
        if (fallback.force) {
          return mapNodeModsManager.getFallbackMod(helModNameOrPath, platform);
        }
        const dictKey = this.getDictKey(platform, helModNameOrPath);
        const cachedProxy = this.modProxyCache[dictKey];
        if (cachedProxy) {
          return cachedProxy;
        }
        const nameData = extractNameData(helModNameOrPath, platform);
        const modRef = this.getHelModRef(platform, nameData);
        if (!modRef) {
          throw new Error(`Module ${helModNameOrPath} not preloaded!`);
        }
        const modProxy = new Proxy(rawMod, {
          get: (target, prop) => {
            if (KEY_DEFAULT === prop) {
              return modProxy;
            }
            if (HEL_MDO_PROXY === prop) {
              return IS_HEL_MOD_PROXY;
            }
            if (prop === "then") {
              return target[prop];
            }
            if (fnProps[prop]) {
              const fn = (...args) => {
                const modRef3 = this.getModRef(platform, nameData, rawMod);
                return modRef3[prop](...args);
              };
              return fn;
            }
            if (dictProps[prop]) {
              return new Proxy(
                {},
                {
                  get: (t, dictKey2) => {
                    const modRef3 = this.getModRef(platform, nameData, rawMod);
                    return modRef3[prop][dictKey2];
                  }
                }
              );
            }
            const modRef2 = this.getModRef(platform, nameData, rawMod);
            return modRef2[prop];
          }
        });
        modProxy.default = modProxy;
        if (rawPath) {
          this.modProxyCache[dictKey] = modProxy;
        }
        return modProxy;
      }
      /**
       * 通过 hel 模块信息参数异步导入 server 模块
       */
      async importModByMeta(meta, options) {
        const ensuredOptions = getEnsuredIMBMOptions(meta, options);
        const { onFilesReady, reuseLocalFiles, platform, standalone } = ensuredOptions;
        const helModNameOrPath = ensuredOptions.helModNameOrPath || meta.app.name;
        const result = this.tryGetLocalModIns(platform, meta, helModNameOrPath);
        const { modItem, webFile, modIns } = result;
        if (modIns) {
          this.updateModManagerItem(modItem, modIns, { helModNameOrPath, platform });
          return modIns.mod;
        }
        log({ subType: "importModByMeta", desc: "getWebModIns", data: webFile });
        const prepareFiles = ensuredOptions.prepareFiles || mapNodeModsManager.getPrepareFilesFn(helModNameOrPath, platform);
        const webModIns = await getWebModIns(webFile, { meta, prepareFiles, onFilesReady, reuseLocalFiles });
        if (standalone) {
          return webModIns.mod;
        }
        this.updateModManagerItem(modItem, webModIns, { helModNameOrPath, platform, isDownload: true });
        const mod2 = this.requireMod(ensuredOptions.helModNameOrPath || meta.app.name, ensuredOptions);
        maySetToJestMock(platform, helModNameOrPath, mod2);
        return mod2;
      }
      /**
       * 通过 hel 模块名称异步导入 server 模块
       */
      async importMod(helModNameOrPath, options) {
        const { platform = PLATFORM, skipMeta, customVer } = options;
        const { helModName } = extractNameData(helModNameOrPath, platform);
        const guardKey = this.getDictKey(platform, helModName);
        let meta;
        if (skipMeta) {
          meta = makeMeta(platform, helModName, customVer);
        } else {
          meta = await this.guard.call(guardKey, async () => {
            meta = await fetchModMeta(helModName, mayInjectApiUrl(helModName, options));
            return meta;
          });
        }
        const mod2 = await this.importModByMeta(meta, __spreadProps(__spreadValues({}, options), { helModNameOrPath }));
        return mod2;
      }
      /**
       * 通过自定义的同步的准备文件函数准备 server 模块
       */
      importModByMetaSync(meta, options) {
        const { helModNameOrPath, prepareFiles, onFilesReady, standalone } = options;
        const platform = options.platform || meta.app.platform || PLATFORM;
        const nameOrPath = helModNameOrPath || meta.app.name;
        const result = this.tryGetLocalModIns(platform, meta, nameOrPath);
        let { modIns } = result;
        if (!modIns) {
          log({ subType: "importModByMetaSync", desc: "getCustomModIns" });
          modIns = getCustomModIns(result.webFile, prepareFiles, onFilesReady);
        }
        const { mod: mod2 } = modIns;
        if (standalone) {
          return mod2;
        }
        this.updateModManagerItem(result.modItem, modIns, { helModNameOrPath: nameOrPath, platform });
        maySetToJestMock(platform, nameOrPath, mod2);
        return mod2;
      }
      /**
       * 根据用户透传的模块初始路径，同步准备 server 模块
       */
      importModByPath(helModName, modInitPath, options) {
        const { platform = PLATFORM, ver, standalone } = options;
        const modVer = ver || modInitPath;
        const modIns = getDiskModInsByInitPath(modInitPath, modVer);
        const { mod: mod2 } = modIns;
        if (standalone) {
          return mod2;
        }
        const modItem = this.ensureModItem(platform, helModName);
        if (modItem.storedVers.includes(modVer)) {
          throw new Error(`Hel module ${helModName} ver ${modVer} duplicated, please check!`);
        }
        log({ subType: "importModByPath", data: { modPath: modIns.modPath, modVer: modIns.modVer } });
        this.updateModManagerItem(modItem, modIns, { helModNameOrPath: helModName, platform });
        maySetToJestMock(platform, helModName, mod2);
        return mod2;
      }
      /**
       * 为服务端模块准备相关文件
       */
      async prepareServerModFiles(helModNameOrPath, options) {
        const { helModName } = extractNameData(helModNameOrPath);
        const { platform = PLATFORM, onFilesReady, reuseLocalFiles } = options || {};
        const result = await this.guard.call(`${helModName}-PSMF`, async () => {
          const meta = await fetchModMeta(helModName, options);
          const { webFile } = this.prepareModParams(platform, meta, helModNameOrPath);
          const modFileInfo = await prepareWebModFiles(webFile, { meta, onFilesReady, reuseLocalFiles });
          return { meta, modFileInfo };
        });
        return result;
      }
      /**
       * 尝试从本地磁盘里获取模块实例
       */
      tryGetLocalModIns(platform, meta, helModNameOrPath) {
        const logBase = { subType: "tryGetLocalModIns" };
        const { modItem, webFile } = this.prepareModParams(platform, meta, helModNameOrPath);
        log(__spreadProps(__spreadValues({}, logBase), { data: { webFile, storedVers: modItem.storedVers } }));
        let modIns = null;
        if (modItem.storedVers.includes(meta.version.sub_app_version)) {
          log(__spreadProps(__spreadValues({}, logBase), { desc: "getLocalModIns", data: webFile }));
          modIns = getDiskModIns(webFile);
        }
        return { modItem, modIns, webFile };
      }
      /**
       * 清理上一个版本的已导出模块内存数据
       */
      clearPrevModCache(prevModPaths) {
        const validPaths = prevModPaths.filter((v) => !!v);
        if (!validPaths.length) {
          return;
        }
        log({ subType: "clearPrevModCache", desc: "start clear prev mod data", data: { prevModPaths } });
        prevModPaths.forEach((path10) => clearModule(path10));
      }
      /**
       * 获取模块引用，优先获取hel模块，不存在则降级为兜底模块
       */
      getModRef(platform, nameData, backupMod) {
        let modRef = this.getHelModRef(platform, nameData);
        if (modRef) {
          return modRef;
        }
        const { helModNameOrPath } = nameData;
        printWarn(`hel module ${helModNameOrPath} not found, try use backup module`);
        modRef = backupMod;
        if (!isValidModule(modRef)) {
          throw new Error(`${platform}: module not found for ${helModNameOrPath}`);
        }
        return modRef;
      }
      /**
       * 获取hel模块引用对象
       */
      getHelModRef(platform, nameData) {
        const { helModName, relPath } = nameData;
        const modItem = this.getServerModItem(helModName, { platform });
        if (!modItem) {
          return null;
        }
        if (!relPath || relPath === INDEX_JS) {
          let mainMod = modItem.mod;
          if (!mainMod) {
            mainMod = getModByPath(modItem.modPath, { allowNull: true });
            modItem.mod = mainMod;
          }
          return mainMod;
        }
        const { exportedMods, modDirPath: modDir, modPaths } = modItem;
        const modInfo = exportedMods.get(relPath);
        if (modInfo) {
          return modInfo.mod;
        }
        const modPath = path8.join(modDir, relPath);
        const modRef = getModByPath(modPath, { allowNull: true });
        if (modRef) {
          exportedMods.set(relPath, { mod: modRef, path: modPath });
          uniqueStrPush(modPaths, modPath);
        }
        return modRef;
      }
      /**
       * 确保模块对应管理对象存在
       */
      ensureModItem(platform, helModName) {
        const dictKey = this.getDictKey(platform, helModName);
        let modItem = this.modItemMap[dictKey];
        if (!modItem) {
          modItem = {
            mod: null,
            modName: helModName,
            modVer: "",
            modDirPath: "",
            modRootDirPath: "",
            modPath: "",
            exportedMods: /* @__PURE__ */ new Map(),
            modPaths: [],
            storedDirs: [],
            storedVers: [],
            downloadCount: 0,
            firstDownloadVer: "",
            platform
          };
          this.modItemMap[dictKey] = modItem;
        }
        return modItem;
      }
      /**
       * 为后续逻辑执行准备模块相关参数
       */
      prepareModParams(platform, meta, helModNameOrPath) {
        const {
          version: { src_map: srcMap },
          app: { name }
        } = meta;
        const { srvModSrcList = [], srvModSrcIndex } = srcMap;
        const webDirPath = noSlash(srcMap.webDirPath);
        const { modRootDirName, modVer } = getModRootDirData({ meta, platform, webDirPath });
        const webFile = {
          name,
          webDirPath,
          relPath: INDEX_JS,
          urls: srvModSrcList,
          indexUrl: srvModSrcIndex,
          modRootDirName,
          modVer
        };
        if (helModNameOrPath) {
          const nameData = extractNameData(helModNameOrPath, platform);
          if (name === nameData.helModName) {
            webFile.relPath = nameData.relPath;
          }
        }
        if (!srvModSrcList.length) {
          throw new Error(`no server mod files for ${name}`);
        }
        const modItem = this.ensureModItem(platform, name);
        return { modItem, webFile };
      }
      /**
       * 清理模块磁盘文件
       */
      mayClearModDiskFiles(modItem) {
        const { storedDirs, storedVers, firstDownloadVer, modRootDirPath } = modItem;
        const vers = storedVers.filter((v) => ![firstDownloadVer, MOD_INIT_VER].includes(v));
        if (vers.length <= LIMIT_VER_COUNT - 1) {
          return;
        }
        const toDelVer = vers[0];
        const idx = storedVers.indexOf(toDelVer);
        const toDelVerDir = path8.join(modRootDirPath, toDelVer);
        const dirIndex = storedDirs.indexOf(toDelVerDir);
        const subType = "mayClearModDiskFiles";
        log({ subType, desc: "before del dir", data: { toDelVer, idx, dirIndex } });
        const shouldDel = idx >= 0 && dirIndex >= 0;
        if (!shouldDel) {
          log({ subType, desc: "del noop", data: { toDelVer, idx, dirIndex } });
          return;
        }
        storedVers.splice(idx, 1);
        storedDirs.splice(dirIndex, 1);
        delFileOrDir(toDelVerDir, {
          onSuccess: () => log({ subType, desc: "del dir done", data: { toDelVerDir } }),
          onFail: (err) => log({ subType, desc: "del dir err", data: { toDelVerDir, err: err.message } })
        });
      }
      /**
       * 获取模块管理对象
       */
      getServerModItem(helModName, options) {
        const { allowNull = true, platform = PLATFORM } = options || {};
        const dictKey = this.getDictKey(platform, helModName);
        const modItem = this.modItemMap[dictKey] || null;
        if (!(modItem == null ? void 0 : modItem.mod) && !allowNull) {
          throw new Error(`Mapped hel module ${helModName} not preloaded`);
        }
        return modItem;
      }
      /**
       * 更新模块管理数据
       */
      updateModManagerItem(modItem, modIns, options) {
        const { mod: mod2, modPath, modDirPath, modRootDirPath, modVer, modRelPath, isMainMod, mainModPath } = modIns;
        const { isDownload, platform = PLATFORM, helModNameOrPath } = options || {};
        const subType = "updateModManagerItem";
        if (modVer === modItem.modVer) {
          log({
            subType,
            desc: "update same ver",
            data: { modVer, isMainMod, modPath }
          });
          if (isMainMod) {
            Object.assign(modItem, { mod: mod2, modPath });
          } else {
            modItem.exportedMods.set(modRelPath, { mod: mod2, path: modPath });
            uniqueStrPush(modItem.modPaths, modPath);
          }
          return;
        }
        log({
          subType,
          desc: "update different ver",
          data: { newVer: modVer, prevVer: modItem.modVer, isDownload, isMainMod, modRelPath }
        });
        const prevModPaths = modItem.modPaths.concat(modItem.modPath);
        modItem.exportedMods.clear();
        const base = { modVer, modRootDirPath, modDirPath, modPaths: [] };
        if (isMainMod) {
          Object.assign(modItem, __spreadValues({ mod: mod2, modPath }, base));
        } else {
          Object.assign(modItem, __spreadValues({ mod: null, modPath: mainModPath }, base));
          modItem.exportedMods.set(modRelPath, { mod: mod2, path: modPath });
          modItem.modPaths.push(modPath);
        }
        const { storedDirs, storedVers } = modItem;
        const modItemVar = modItem;
        if (isDownload) {
          if (!modItem.downloadCount) {
            modItemVar.firstDownloadVer = modVer;
          }
          modItemVar.downloadCount += 1;
        }
        uniqueStrPush(storedDirs, modDirPath);
        uniqueStrPush(storedVers, modVer);
        this.triggerOnModLoadedHook(modItem, helModNameOrPath, platform);
        this.clearPrevModCache(prevModPaths);
        this.mayClearModDiskFiles(modItem);
      }
      triggerOnModLoadedHook(modItem, helModNameOrPath, platform) {
        if (!isHookValid(HOOK_TYPE.onHelModLoaded, platform)) {
          return;
        }
        const isInitialVersion = !modItem.modPath;
        const { helModName, helModPath, helModVer } = this.resolveMod(helModNameOrPath, platform);
        const pkgName = mapNodeModsManager.getNodeModName(helModNameOrPath, platform);
        triggerHook(
          HOOK_TYPE.onHelModLoaded,
          { helModName, helModPath, pkgName, version: helModVer, isInitialVersion },
          platform
        );
      }
      getDictKey(platform, helModNameOrPath) {
        return `${platform}/${helModNameOrPath}`;
      }
    };
    modManager = new ModManager();
  }
});

// src/server-mod/mod-meta-backup.ts

function mayInitModBackupData(platform) {
  if (backupModIsInit[platform]) {
    return;
  }
  const sdkCtx = getSdkCtx(platform);
  const mayThrowErr = (err) => {
    print(err);
  };
  backupModIsInit[platform] = true;
  const platModInfos = safeGet(backupModInfos, platform, {});
  const platModMetas = safeGet(backupModMetas, platform, {});
  try {
    const metas = JSON.parse(fs8.readFileSync(sdkCtx.helMetaBackupFilePath).toString());
    Object.assign(backupModMetas, metas);
    Object.keys(metas).forEach((name) => {
      const meta = metas[name];
      const modInfo = makeModInfo(meta);
      modInfo.meta.version._is_backup = true;
      platModMetas[name] = meta;
      platModInfos[name] = modInfo;
    });
  } catch (err) {
    sdkCtx.reporter.reportError(err.stack, errDesc);
    mayThrowErr(err);
  }
  const noDefaultNames = [];
  sdkCtx.modNames.forEach((name) => {
    if (!platModInfos[name]) {
      noDefaultNames.push(name);
    }
  });
  if (noDefaultNames.length) {
    const msg = `these mods(${noDefaultNames}) has no backup hel meta`;
    sdkCtx.reporter.reportError(msg, errDesc);
    mayThrowErr(new Error(msg));
  }
}
function getBackupModInfo(platform, modName) {
  mayInitModBackupData(platform);
  const platModInfos = safeGet(backupModInfos, platform, {});
  const modInfo = platModInfos[modName];
  return modInfo;
}
var backupModInfos, backupModMetas, backupModIsInit, errDesc;
var init_mod_meta_backup = __esm({
  "src/server-mod/mod-meta-backup.ts"() {
    init_logger();
    init_util();
    init_context();
    init_mod_meta_helper();
    backupModInfos = {};
    backupModMetas = {};
    backupModIsInit = {};
    errDesc = "err-init-hed-mod-defaults";
  }
});

// src/mod-view/preset-data-helper.ts
function log2(options) {
  recordMemLog(__spreadProps(__spreadValues({}, options), { type: "PresetData" }));
}
function hasServerModFile(modInfo) {
  const { srvModSrcList = [] } = modInfo.meta.version.src_map;
  return srvModSrcList.length > 0;
}
function checkServerModFile(modInfo, options) {
  const { mustBeServerMod, label } = options;
  if (!hasServerModFile(modInfo)) {
    log2({ subType: label, desc: "no srvModSrcList" });
    if (mustBeServerMod) {
      throw new Error(`no server mod files for ${modInfo.name}`);
    }
    return false;
  }
  return true;
}
var init_preset_data_helper = __esm({
  "src/mod-view/preset-data-helper.ts"() {
    init_mem_logger();
  }
});

// src/mod-view/preset-data.ts
var PresetData, presetDataMgr;
var init_preset_data = __esm({
  "src/mod-view/preset-data.ts"() {
    init_consts();
    init_util();
    init_context();
    init_facade();
    init_map_node_mods();
    init_mod_manager();
    init_mod_meta_backup();
    init_preset_data_helper();
    PresetData = class {
      constructor(allowOldVer) {
        this.modInfoCache = {};
        /** 元数据缓存 */
        this.metaCache = {};
        /** 已生成的元数据字符串 */
        this.metaStr = "";
        /** css 含link的字符串缓存 */
        this.cssCache = {};
        /** 已生成的样式字符串 */
        this.cssLinkStr = "";
        /** hel-entry js sdk 缓存 */
        this.helEntryCache = {};
        /** 模板名对应的产物数据, key: 模板名（ xxx.ejs ），value：产物对象 */
        this.viewAssetCache = {};
        /** 入口名对应的产物数据, key: 带模块前缀的入口名（ xxxMod/yyy ），value：产物对象 */
        this.entryAssetCache = {};
        /** 需预拉取 js 的模块元数据缓存 */
        this.preloadMetaCache = {};
        /** 已生成的需预拉取的 js link 字符串 */
        this.preloadJsStr = "";
        /** 是否允许更新低于镜像里默认版本的旧版本数据 */
        this.allowOldVer = false;
        const defaultAllow = !CTX_ENV.isProd;
        this.allowOldVer = allowOldVer != null ? allowOldVer : defaultAllow;
      }
      /**
       * 服务于 initMiddleware 同步流程，此模式下优先更新客户端模块，
       * 顺带检查服务端模块是否存在，如存在则异步更新，适用于前后端模块版本可短时间不一致的场景
       */
      updateForClient(platform, modInfo) {
        if (!this.canUpdate(platform, modInfo)) {
          return false;
        }
        this.setModInfo(modInfo);
        this.updateClientMod(platform, modInfo);
        this.updateServerInitMod(platform, modInfo);
        this.updateServerModSync(platform, modInfo);
      }
      /**
       * 优先更新服务端模块数据，服务于 preloadMiddleware 异步流程，此模式下优先更新服务端模块（如存在），
       * 更新成功后再更新客户端模块数据（预埋在首页里下发给前端hel-micro sdk使用的相关hel数据），
       * 适用于需要前后端模块版本强一致的场景
       */
      async updateForServerFirst(platform, modInfo, options) {
        if (!this.canUpdate(platform, modInfo)) {
          log2({ subType: "updateForServerFirst", desc: `${modInfo.name} canUpdate is false` });
          return false;
        }
        const isModUpdated = await this.updateServerMod(platform, modInfo, options);
        if (isModUpdated) {
          this.setModInfo(modInfo);
        }
        this.updateClientMod(platform, modInfo);
        return isModUpdated;
      }
      updateForServerFirstSync(platform, modInfo, options) {
        if (!this.canUpdate(platform, modInfo)) {
          log2({ subType: "updateForServerFirstSync", desc: `${modInfo.name} canUpdate is false` });
          return false;
        }
        const isModUpdated = this.updateServerModSync(platform, modInfo, options);
        if (isModUpdated) {
          this.setModInfo(modInfo);
        }
        this.updateClientMod(platform, modInfo);
        return true;
      }
      /**
       * 获取 hel 主项目胶水层代码 js
       */
      getHelPageEntrySrc(modName) {
        const defaultVal = this.helEntryCache.default;
        if (!modName) {
          return defaultVal;
        }
        return this.helEntryCache[modName] || defaultVal;
      }
      /**
       * 获取页面对应的 js css 资源路径
       */
      getPageAsset(viewName, helEntry) {
        const { entryAssetCache, viewAssetCache } = this;
        const viewAsset = viewAssetCache[viewName] || viewAssetCache.index || { css: "", js: "" };
        if (helEntry) {
          return entryAssetCache[helEntry] || viewAsset;
        }
        return viewAsset;
      }
      getCachedModInfo(modName) {
        return this.modInfoCache[modName] || null;
      }
      /** 尝试更新前端模块相关预设数据 */
      updateClientMod(platform, modInfo) {
        const modConf = getEnsuredModConf(modInfo.name, platform);
        if (!modConf) {
          return;
        }
        const { updatePresetMeta, updatePageAsset, extractCssStr, isHelEntry, isDefaultHelEntry, isPreloadJs } = modConf;
        if (updatePresetMeta) {
          this.updatePresetHelMetaStr(modInfo);
        }
        if (updatePageAsset) {
          this.updatePageAssetCache(modInfo);
        }
        if (extractCssStr) {
          this.updatePresetCssLinkStr(modInfo);
        }
        if (isHelEntry) {
          this.updateHelEntryCache(modInfo, isDefaultHelEntry);
        }
        if (isPreloadJs) {
          this.updatePreloadJsStr(modInfo);
        }
      }
      setModInfo(modInfo) {
        this.modInfoCache[modInfo.name] = modInfo;
      }
      /** 如存在 server 模块则更新对应模块实例 */
      async updateServerMod(platform, modInfo, options) {
        const { mustBeServerMod, importOptions } = options || {};
        const shouldContinue = checkServerModFile(modInfo, { mustBeServerMod, label: "updateServerMod" });
        if (!shouldContinue) {
          return false;
        }
        const { name, fullMeta } = modInfo;
        const sdkCtx = getSdkCtx(platform);
        const helModPaths = mapNodeModsManager.getHelModPaths(name, platform);
        uniqueStrPush(helModPaths, name);
        await Promise.all(
          helModPaths.map(async (helModNameOrPath) => {
            const options2 = importOptions || {
              platform,
              prepareFiles: sdkCtx.prepareFiles,
              helModNameOrPath,
              standalone: false
            };
            await modManager.importModByMeta(fullMeta, options2);
          })
        );
        return true;
      }
      /** 如存在 server 模块则更新对应模块实例 */
      updateServerModSync(platform, modInfo, options) {
        const { mustBeServerMod, importOptions } = options || {};
        const shouldContinue = checkServerModFile(modInfo, { mustBeServerMod, label: "updateServerModSync" });
        if (!shouldContinue) {
          return false;
        }
        const sdkCtx = getSdkCtx(platform);
        const importOptionsVar = importOptions || { prepareFiles: sdkCtx.prepareFiles, standalone: false };
        modManager.importModByMetaSync(modInfo.fullMeta, importOptionsVar);
      }
      /** 更新用户可能设定的 server 端本地初始兜底模块 */
      updateServerInitMod(platform, modInfo) {
        const { name } = modInfo;
        const { serverModInitPath } = getEnsuredModConf(name, platform);
        if (serverModInitPath) {
          modManager.importModByPath(name, serverModInitPath);
        }
      }
      /**
       * 能否使用新版本
       */
      canUseNewVersion(platform, modInfo, prevModInfo) {
        const newMeta = modInfo.fullMeta;
        const data = mapNodeModsManager.getHelModData(modInfo.name, platform);
        const { nodeModName } = data || {};
        if (!nodeModName) {
          return true;
        }
        const helModName = modInfo.name;
        const currentMeta = (prevModInfo == null ? void 0 : prevModInfo.fullMeta) || null;
        return shouldAcceptVersion({ platform, currentMeta, newMeta, nodeModName, helModName });
      }
      /**
       * 出现以下状况任意一个，则不能更新：
       * 1 未在用户的模块声明表里
       * 2 模块版本检查失败
       */
      canUpdate(platform, modInfo) {
        const isMapped = isModMapped(platform, modInfo.name);
        if (!isMapped) {
          return false;
        }
        const prevModInfo = this.modInfoCache[modInfo.name];
        if (!prevModInfo) {
          return this.canUseNewVersion(platform, modInfo, prevModInfo);
        }
        if (prevModInfo.createTime === modInfo.createTime) {
          return false;
        }
        const defaultModInfo = getBackupModInfo(platform, modInfo.name);
        if (!defaultModInfo || this.allowOldVer) {
          return this.canUseNewVersion(platform, modInfo, prevModInfo);
        }
        return defaultModInfo.createTime <= modInfo.createTime;
      }
      /**
       * 更新需要在首页预埋的 hel-meta 对象
       */
      updatePresetHelMetaStr(modInfo) {
        const { metaCache } = this;
        metaCache[modInfo.name] = modInfo.meta;
        this.metaStr = `<script>window.__HEL_PRESET_META__=${JSON.stringify(metaCache)}</script>`;
      }
      /**
       * 更新访问页面的资源描述对象
       */
      updatePageAssetCache(modInfo) {
        const { src_map: srcMap, sub_app_name: curAppName } = modInfo.meta.version;
        const { chunkCssSrcList, chunkJsSrcList } = srcMap;
        const { viewAssetCache, entryAssetCache } = this;
        const { assetNameInfos, assetName2view } = getModDerivedConf();
        assetNameInfos.forEach((nameInfo) => {
          const { appName, entryName, name } = nameInfo;
          if (curAppName === appName) {
            const css = chunkCssSrcList.find((src) => src.includes(`/${entryName}.css`)) || "";
            const js = chunkJsSrcList.find((src) => src.includes(`/${entryName}.js`)) || "";
            viewAssetCache[assetName2view[name]] = { js, css };
            entryAssetCache[name] = { js, css };
          }
        });
      }
      /**
       * 获取需要预设的 css link 字符串
       */
      updatePresetCssLinkStr(modInfo) {
        const { cssCache } = this;
        cssCache[modInfo.name] = modInfo.cssHtmlStr;
        let cssLinkStr = "";
        Object.keys(cssCache).forEach((key) => {
          cssLinkStr += cssCache[key];
        });
        this.cssLinkStr = cssLinkStr;
      }
      /**
       * 更新入口胶水层代码 js 缓存
       */
      updateHelEntryCache(modInfo, isDefaultHelEntry) {
        const { helEntryCache } = this;
        const { chunkJsSrcList } = modInfo.meta.version.src_map;
        const entrySrc = chunkJsSrcList[0] || "";
        if (!entrySrc) {
          return;
        }
        helEntryCache[modInfo.name] = entrySrc;
        if (isDefaultHelEntry) {
          helEntryCache.default = entrySrc;
        }
      }
      /**
       * 更新需在首页做 js 预拉取的描述字符
       */
      updatePreloadJsStr(modInfo) {
        const { preloadMetaCache } = this;
        preloadMetaCache[modInfo.name] = modInfo.meta;
        let str = "";
        Object.keys(preloadMetaCache).forEach((key) => {
          const meta = preloadMetaCache[key];
          const { chunkJsSrcList } = meta.version.src_map;
          chunkJsSrcList.forEach((src) => {
            str += `<link rel="preload" href="${xssFilter(src)}" as="script">`;
          });
        });
        this.preloadJsStr = str;
      }
    };
    presetDataMgr = new PresetData();
  }
});

// src/mod-node/index.ts
function getMappedData(nodeModName) {
  return mapNodeModsManager.getNodeModData(nodeModName, false);
}
function extractOptions(nodeModName, meta, options) {
  const { helModName, platform } = getMappedData(nodeModName);
  if (helModName !== meta.app.name) {
    throw new Error(`Meta name ${meta.app.name} not equal to helModName ${helModName}`);
  }
  const newOptions = __spreadProps(__spreadValues({}, options || {}), { standalone: false, platform });
  return newOptions;
}
function resolveNodeMod(nodeModName) {
  const { helPath, platform } = getMappedData(nodeModName);
  return modManager.resolveMod(helPath, platform);
}
function requireNodeMod(nodeModName) {
  if (nodeModName === KW_NODE_MOD_NAME) {
    return {};
  }
  const { helPath, platform } = getMappedData(nodeModName);
  const mod2 = modManager.requireMod(helPath, { platform });
  return mod2;
}
async function importNodeMod(nodeModName, options) {
  const { helPath, platform } = getMappedData(nodeModName);
  const importOptions = __spreadProps(__spreadValues({}, options || {}), { standalone: false, platform });
  const meta = await getMetaByImportOptions(helPath, importOptions);
  const modInfo = makeModInfo(meta);
  const isUpdated = await presetDataMgr.updateForServerFirst(platform, modInfo, { mustBeServerMod: true, importOptions });
  const mod2 = requireNodeMod(nodeModName);
  return { mod: mod2, isUpdated };
}
async function importNodeModByMeta(nodeModName, meta, options) {
  const { platform } = getMappedData(nodeModName);
  const importOptions = extractOptions(nodeModName, meta, options);
  const modInfo = makeModInfo(meta);
  const isUpdated = await presetDataMgr.updateForServerFirst(platform, modInfo, { mustBeServerMod: true, importOptions });
  const mod2 = requireNodeMod(nodeModName);
  return { mod: mod2, isUpdated };
}
function importNodeModByMetaSync(nodeModName, meta, options) {
  const { platform } = getMappedData(nodeModName);
  const importOptions = extractOptions(nodeModName, meta, options);
  const modInfo = makeModInfo(meta);
  const isUpdated = presetDataMgr.updateForServerFirstSync(platform, modInfo, { mustBeServerMod: true, importOptions });
  const mod2 = requireNodeMod(nodeModName);
  return { mod: mod2, isUpdated };
}
function importNodeModByPath(nodeModName, nodeModPath, options) {
  const { helPath, platform } = getMappedData(nodeModName);
  const newOptions = __spreadProps(__spreadValues({}, options || {}), { standalone: false, platform });
  return modManager.importModByPath(helPath, nodeModPath, newOptions);
}
function mapNodeMods(modMapper) {
  return mapNodeModsManager.setModMapper(modMapper);
}
function getNodeModDesc(nodeModName, options) {
  const { helPath, platform } = getMappedData(nodeModName);
  const newOptions = __spreadProps(__spreadValues({}, options || {}), { standalone: false, platform });
  return modManager.getModDesc(helPath, newOptions);
}
function getNodeModVer(nodeModName) {
  const { helPath, platform } = getMappedData(nodeModName);
  return modManager.getModVer(helPath, platform);
}
async function downloadNodeModFiles(nodeModName, options) {
  const { helPath, platform } = getMappedData(nodeModName);
  const prepareOptions = __spreadProps(__spreadValues({}, options || {}), { platform });
  const { modFileInfo, meta } = await modManager.prepareServerModFiles(helPath, prepareOptions);
  const files = getDirFileList(modFileInfo.modDirPath);
  return { meta, files };
}
function getFallbackMod(nodeModName) {
  const { helPath, platform } = getMappedData(nodeModName);
  return mapNodeModsManager.getFallbackMod(helPath, platform);
}
var init_mod_node = __esm({
  "src/mod-node/index.ts"() {
    init_mod_consts();
    init_path_helper();
    init_preset_data();
    init_map_node_mods();
    init_mod_manager();
    init_mod_manager_helper();
    init_mod_meta_helper();
    init_file_helper();
  }
});

// src/server-mod/mod-tpl.ts
var require_mod_tpl = __commonJS({
  "src/server-mod/mod-tpl.ts"(exports, module) {
    init_mod_node();
    var proxyMod = requireNodeMod("{{NODE_MOD_NAME}}");
    module.exports = proxyMod;
  }
});

// src/export.ts
var export_exports = {};
__export(export_exports, {
  addBizHooks: () => addBizHooks,
  downloadFile: () => downloadFile,
  downloadHelModFiles: () => downloadHelModFiles,
  downloadNodeModFiles: () => downloadNodeModFiles,
  getFallbackMod: () => getFallbackMod,
  getHelModMeta: () => getHelModMeta,
  getHelModulesPath: () => getHelModulesPath,
  getMemLogs: () => getMemLogs,
  getNodeModDesc: () => getNodeModDesc,
  getNodeModVer: () => getNodeModVer,
  importHelMod: () => importHelMod,
  importHelModByMeta: () => importHelModByMeta,
  importHelModByMetaSync: () => importHelModByMetaSync,
  importHelModByPath: () => importHelModByPath,
  importNodeMod: () => importNodeMod,
  importNodeModByMeta: () => importNodeModByMeta,
  importNodeModByMetaSync: () => importNodeModByMetaSync,
  importNodeModByPath: () => importNodeModByPath,
  initMiddleware: () => initMiddleware,
  isHelModProxy: () => isHelModProxy,
  mapAndPreload: () => mapAndPreload,
  mapNodeMods: () => mapNodeMods,
  mockAutoDownload: () => mockAutoDownload,
  mockUtil: () => mock_util_exports,
  preloadMappedData: () => preloadMappedData,
  preloadMiddleware: () => preloadMiddleware,
  recordMemLog: () => recordMemLog,
  registerPlatform: () => registerPlatform,
  requireNodeMod: () => requireNodeMod,
  resolveNodeMod: () => resolveNodeMod,
  setGlobalConfig: () => setGlobalConfig,
  setPlatformConfig: () => setPlatformConfig
});

// src/api/index.ts
var api_exports = {};
__export(api_exports, {
  addBizHooks: () => addBizHooks,
  downloadFile: () => downloadFile,
  downloadHelModFiles: () => downloadHelModFiles,
  downloadNodeModFiles: () => downloadNodeModFiles,
  getFallbackMod: () => getFallbackMod,
  getHelModMeta: () => getHelModMeta,
  getHelModulesPath: () => getHelModulesPath,
  getMemLogs: () => getMemLogs,
  getNodeModDesc: () => getNodeModDesc,
  getNodeModVer: () => getNodeModVer,
  importHelMod: () => importHelMod,
  importHelModByMeta: () => importHelModByMeta,
  importHelModByMetaSync: () => importHelModByMetaSync,
  importHelModByPath: () => importHelModByPath,
  importNodeMod: () => importNodeMod,
  importNodeModByMeta: () => importNodeModByMeta,
  importNodeModByMetaSync: () => importNodeModByMetaSync,
  importNodeModByPath: () => importNodeModByPath,
  initMiddleware: () => initMiddleware,
  isHelModProxy: () => isHelModProxy,
  mapAndPreload: () => mapAndPreload,
  mapNodeMods: () => mapNodeMods,
  mockAutoDownload: () => mockAutoDownload,
  mockUtil: () => mock_util_exports,
  preloadMappedData: () => preloadMappedData,
  preloadMiddleware: () => preloadMiddleware,
  recordMemLog: () => recordMemLog,
  requireNodeMod: () => requireNodeMod,
  resolveNodeMod: () => resolveNodeMod,
  setGlobalConfig: () => setGlobalConfig,
  setPlatformConfig: () => setPlatformConfig
});
var import_mod_tpl = __toESM(require_mod_tpl());

// src/server-mod/resolve-filename.ts
init_global_config();
init_map_node_mods();
// replace module ori _resolveFilename
var _module = require('module');
var oriResolveFilename = _module._resolveFilename;
_module._resolveFilename = function(pkgName, parentModule, isMain, options) {
  const helModOrPath = mapNodeModsManager.getMappedPath(pkgName);
  const getOriFilename = () => {
    const result = oriResolveFilename.call(this, pkgName, parentModule, isMain, options);
    return result;
  };
  let sourceFilename = "";
  if (helModOrPath) {
    try {
      sourceFilename = getOriFilename();
    } catch (err) {
      const { strict } = getGlobalConfig();
      const willKnowModShape = mapNodeModsManager.isFallbackModExist(pkgName) || mapNodeModsManager.isModShapeExist(pkgName);
      if (
        // strict 模式下，node 模块必须存在
        strict || !willKnowModShape
      ) {
        throw err;
      }
    }
    const proxyFile = mapNodeModsManager.getProxyFile(pkgName, helModOrPath, sourceFilename);
    return proxyFile;
  }
  sourceFilename = getOriFilename();
  return sourceFilename;
};

// src/api/index.ts
init_mem_logger();
init_path_helper();
init_context();

// src/init/index.ts
init_consts();
init_util();
init_context();


// src/context/meta-cache.ts
init_consts();


// src/base/lru-cache.ts
var _lrucache = require('lru-cache'); var cache = _interopRequireWildcard(_lrucache);
function newCache(options) {
  const CacheClass = cache.LRUCache;
  if (CacheClass) {
    return new CacheClass(options);
  }
  const ctor = cache.default || cache;
  return new ctor(options);
}

// src/context/meta-cache.ts
init_mod_meta();
init_context();
var guard = new (0, _fguard.ConcurrencyGuard)();
var modMetaCache = newCache({ max: 3e3 });
function setMetaCache(modMeta) {
  modMetaCache.set(modMeta.app.name, modMeta);
}
function getMetaCache(name) {
  const cachedMeta = modMetaCache.get(name);
  return cachedMeta;
}
async function getModMeta(name, options) {
  const { platform = PLATFORM, ver, branch, gray, projId } = options || {};
  let guardKey = `${platform}/${name}@${ver}`;
  if (branch || projId || gray) {
    guardKey = `${guardKey}--${branch}${projId}${gray}`;
    const meta2 = await guard.call(guardKey, fetchModMeta, name, options);
    return meta2;
  }
  const ctx = getSdkCtx(platform);
  if (ctx.careAllModsChange) {
    const cachedMeta = getMetaCache(name);
    if (cachedMeta) {
      return cachedMeta;
    }
  }
  const meta = await guard.call(guardKey, fetchModMeta, name, { platform, ver });
  return meta;
}

// src/init/index.ts
init_global_config();

// src/mod-view/cache.ts
init_consts();
init_mem_logger();
init_facade();
init_hooks();
init_context();
init_mod_meta();
init_mod_meta_backup();
init_jest_env();
init_consts2();
init_preset_data();

// src/mod-view/watch.ts
init_consts();
init_mod_consts();
init_context();
init_facade();
init_hooks();

// src/socket/client.ts
init_util();
var _uuid = require('@helbase/uuid');
var _ws = require('ws');

// src/socket/consts.ts
var EWSEvent = {
  open: "open",
  message: "message",
  close: "close",
  error: "error"
};
var DEFAULT_URL = "ws://localhost:8086";
var HEART_BEAT_INTERVAL = 4e4;
var RECONNECT_DELAY_MS = 1e4;
var RECONNECT_DELAY_MAX_MS = 6e4 * 10;
var RECONNECT_BY_HTTP_PING_INTERVAL_MS = 2e3;
var RECONNECT_BY_HTTP_PING_LIMIT_TIMES = 60;
var RECONNECT_DELAY_DELTA_MS = 1e4;
var RECONNECT_COUNT_DIVISOR = 5;
var HEART_BEAT_PING = "ping";
var HEART_BEAT_PONG = "pong";

// src/socket/util.ts
function toDataStr(mayJson) {
  if (typeof mayJson === "string") {
    return mayJson;
  }
  return JSON.stringify(mayJson);
}
function toDataJson(str) {
  try {
    return JSON.parse(str);
  } catch (err) {
    return str;
  }
}

// src/socket/client.ts
function getSafeNext(input) {
  const num2 = input === Number.MAX_SAFE_INTEGER ? 1 : input + 1;
  return num2;
}
var WSAutoReconnectClient = class {
  constructor(inputOptions) {
    /** 是否还处于活跃状态 */
    this.isAlive = false;
    /** 心跳 timer */
    this.heartBeatTimer = null;
    /** 已重连成功的次数 */
    this.reconnectSuccessCount = 0;
    /** 已尝试重连的次数 */
    this.reconnectCount = 0;
    this.reconnectLogicId = getSafeNext(0);
    /** 初始的延迟多少毫秒后开始重连值 */
    this.reconnectDelayMs = RECONNECT_DELAY_MS;
    /** 随后即将开始重连的 timer */
    this.reconnectTimer = null;
    this.httpPingTimer = null;
    this.httpPingReconnectCount = 0;
    this.httpPingReconnectLogicId = 0;
    this.isReconnectInsInitCalled = false;
    this.options = {
      id: _uuid.v7.call(void 0, ),
      url: "",
      onConnected: () => "",
      onMessage: () => {
      },
      getUrlWhenReconnect: () => Promise.resolve("")
    };
    this.hasGetUrl = false;
    if (!inputOptions.url) {
      throw new Error("missing url param");
    }
    const id = inputOptions.id || _uuid.v7.call(void 0, );
    const options = purify(__spreadProps(__spreadValues({}, inputOptions), { id }));
    if (typeof options.getUrlWhenReconnect === "function") {
      this.hasGetUrl = true;
    }
    Object.assign(this.options, options);
    this.newClientIns();
  }
  /**
   * 创建新的连接实例
   * @param isReconnect
   */
  newClientIns(isReconnect) {
    const { url = DEFAULT_URL } = this.options;
    try {
      const initInsAndListenEvent = (url2) => {
        const client = new (0, _ws.WebSocket)(url2);
        this.client = client;
        client.on(EWSEvent.open, () => {
          if (isReconnect) {
            this.reconnectSuccessCount += 1;
            this.reconnectLogicId = getSafeNext(this.reconnectLogicId);
            if (this.reconnectTimer) {
              clearTimeout(this.reconnectTimer);
            }
          }
          this.isAlive = true;
          this.startHeartBeat();
          this.handleOpen();
        });
        client.on(EWSEvent.message, (data) => {
          this.handleMessage(data.toString());
        });
        client.on(EWSEvent.close, () => {
          this.handleConnectionFail(new Error("Server closed"));
        });
        client.on(EWSEvent.error, (err) => {
          this.handleConnectionFail(err);
        });
      };
      if (isReconnect) {
        if (this.isReconnectInsInitCalled) {
          return;
        }
        const connectByUrl = (url2) => {
          if (this.isReconnectInsInitCalled) {
            return;
          }
          this.isReconnectInsInitCalled = true;
          initInsAndListenEvent(url2);
        };
        if (this.hasGetUrl) {
          this.options.getUrlWhenReconnect().then((newUrl) => connectByUrl(newUrl)).catch((err) => {
            this.handleConnectionFail(err);
          });
        } else {
          connectByUrl(url);
        }
        return;
      }
      initInsAndListenEvent(url);
    } catch (err) {
      this.handleConnectionFail(err);
    }
  }
  /**
   * 处理连接已打开事件
   */
  handleOpen() {
    const data = this.options.onConnected();
    this.sendMsg({ id: this.options.id, data });
  }
  /**
   * 处理接受到的消息
   */
  handleMessage(dataStr) {
    if (dataStr === HEART_BEAT_PONG) {
      return;
    }
    const data = toDataJson(dataStr);
    this.options.onMessage(data);
  }
  /**
   * 处理连接失败
   */
  handleConnectionFail(err) {
    console.log(err);
    this.isAlive = false;
    this.stopHeartBeat();
    this.mayReconnectLater();
  }
  /**
   * 重试次数越多，稍后重连的时间越长，用旧的延迟时间加上增量得到新的延迟时间，
   * 每当满足 reconnectCount 是 RECONNECT_COUNT_DIVISOR 新的倍数时，就会触发 reconnectDelayMs 改变
   */
  mayResetDelay() {
    if (this.reconnectDelayMs === RECONNECT_DELAY_MAX_MS) {
      return;
    }
    const timesValue = Math.floor(this.reconnectCount / RECONNECT_COUNT_DIVISOR);
    this.reconnectDelayMs = this.reconnectDelayMs + timesValue * RECONNECT_DELAY_DELTA_MS;
    if (this.reconnectDelayMs >= RECONNECT_DELAY_MAX_MS) {
      this.reconnectDelayMs = RECONNECT_DELAY_MAX_MS;
    }
  }
  /**
   * 尝试稍后重连服务端
   */
  mayReconnectLater() {
    if (this.reconnectTimer) {
      return;
    }
    this.isReconnectInsInitCalled = false;
    this.mayResetDelay();
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.reconnectCount += 1;
      this.newClientIns(true);
    }, this.reconnectDelayMs);
    this.mayInitReconnectByHttpPing();
  }
  mayInitReconnectByHttpPing() {
    const { httpPingWhenTryReconnect } = this.options;
    if (!httpPingWhenTryReconnect || this.httpPingTimer || this.httpPingReconnectLogicId === this.reconnectLogicId) {
      return;
    }
    const timer = setInterval(() => {
      const clearup = () => {
        this.httpPingReconnectLogicId = this.reconnectLogicId;
        this.httpPingReconnectCount = 0;
        clearInterval(timer);
        this.httpPingTimer = null;
      };
      if (this.httpPingReconnectCount >= RECONNECT_BY_HTTP_PING_LIMIT_TIMES) {
        return clearup();
      }
      this.httpPingReconnectCount += 1;
      httpPingWhenTryReconnect().then((isPingSuccess) => {
        if (isPingSuccess) {
          clearup();
          this.newClientIns(true);
        }
      }).catch(console.error);
    }, RECONNECT_BY_HTTP_PING_INTERVAL_MS);
    this.httpPingTimer = timer;
  }
  /**
   * 发送消息体
   */
  sendMsg(msg) {
    try {
      this.client.send(toDataStr(msg));
    } catch (err) {
      this.mayReconnectLater();
    }
  }
  /**
   * 开始发送心跳包
   */
  startHeartBeat() {
    this.heartBeatTimer = setInterval(() => {
      if (this.isAlive) {
        this.sendMsg(HEART_BEAT_PING);
      }
    }, HEART_BEAT_INTERVAL);
  }
  /**
   * 停止发送心跳包
   */
  stopHeartBeat() {
    if (this.heartBeatTimer) {
      clearInterval(this.heartBeatTimer);
    }
  }
};

// src/mod-view/watch.ts
init_jest_env();
var isSocketSubCalledMap = {};
async function subHelpackModChange(platform, changeCb) {
  const isSocketSubCalled = isSocketSubCalledMap[platform];
  const sdkCtx = getSdkCtx(platform);
  try {
    if (isSocketSubCalled || isRunInJest() || !sdkCtx.helpackSocketUrl) {
      return;
    }
    isSocketSubCalledMap[platform] = true;
    new WSAutoReconnectClient({
      url: sdkCtx.helpackSocketUrl,
      getUrlWhenReconnect: sdkCtx.getSocketUrlWhenReconnect,
      httpPingWhenTryReconnect: sdkCtx.socketHttpPingWhenTryReconnect,
      onConnected: () => {
        const helModNames = getCaredModNames(platform);
        const { careAllModsChange } = sdkCtx;
        const envInfo = sdkCtx.getEnvInfo() || {};
        return { msgType: SOCKET_MSG_TYPE.initHelMods, helModNames, careAllModsChange, envInfo };
      },
      onMessage: (msg) => {
        const { modName, channel } = msg.data;
        triggerHook(HOOK_TYPE.onMessageReceived, { helModName: modName, msgType: channel }, platform);
        if ([CHANNEL_APP_INFO_CHANGED, CHANNEL_APP_VERSION_CHANGED].includes(channel)) {
          changeCb({ modName, type: CHANNEL_APP_INFO_CHANGED });
        }
      }
    });
  } catch (err) {
    const desc = "err-sub-helpack-mod-change";
    const msg = `[${desc}] ${err.message}`;
    sdkCtx.reporter.reportError(msg, desc);
  }
}

// src/mod-view/cache.ts
var { containerName, workerId: workerId2 } = SERVER_INFO;
function log3(options) {
  recordMemLog(__spreadProps(__spreadValues({}, options), { type: "HelModCache" }));
}
function loadBackupHelMod(platform) {
  const sdkCtx = getSdkCtx(platform);
  const modInfoList = [];
  try {
    sdkCtx.modNames.forEach((name) => {
      const modInfo = getBackupModInfo(sdkCtx.platform, name);
      updateModPresetDataSync(sdkCtx.platform, SET_BY.init, modInfo);
      modInfoList.push(modInfo);
    });
    return modInfoList.filter((v) => !!v);
  } catch (err) {
    if (CTX_ENV.isProd) {
      throw err;
    }
    mayUpdateModPresetData(sdkCtx.platform, SET_BY.init).catch((err2) => {
      sdkCtx.reporter.reportError(err2.stack, "err-loadBackupHelMod");
    });
  }
  return modInfoList;
}
var isIntervalUpdateCalled = false;
function enableIntervalUpdate(platform) {
  if (isIntervalUpdateCalled || isRunInJest()) {
    return;
  }
  isIntervalUpdateCalled = true;
  const sdkCtx = getSdkCtx(platform);
  setInterval(() => {
    mayUpdateModPresetData(platform, SET_BY.timer).catch((err) => {
      sdkCtx.reporter.reportError(err.stack, "err-intervalUpdate");
    });
  }, UPDATE_INTERVAL);
}
function getCanFetchNewVersionData(platform, modName) {
  var _a;
  const fetchOptions = getMappedModFetchOptions(modName, platform);
  const { ver: userSpecifiedVer } = fetchOptions || {};
  if (!userSpecifiedVer) {
    return true;
  }
  const cachedModInfo = presetDataMgr.getCachedModInfo(modName);
  if (!cachedModInfo) {
    return true;
  }
  const cachedVer = (_a = cachedModInfo.meta.version) == null ? void 0 : _a.sub_app_version;
  if (userSpecifiedVer === cachedVer) {
    return false;
  }
  return true;
}
async function handleHelModChanged(platform, modName) {
  const sdkCtx = getSdkCtx(platform);
  try {
    const canFetchNew = getCanFetchNewVersionData(platform, modName);
    if (!canFetchNew) {
      return;
    }
    const fetchOptions = getMappedModFetchOptions(modName, platform);
    const modInfo = await fetchModInfo(modName, fetchOptions);
    if (!modInfo) {
      return;
    }
    if (sdkCtx.careAllModsChange) {
      setMetaCache(modInfo.fullMeta);
    }
    mayUpdateModPresetData(platform, SET_BY.watch, modName, modInfo);
  } catch (err) {
    sdkCtx.reporter.reportError(err.stack, "err-handle-hel-mod-changed");
    const errMsg = err.message;
    log3({ subType: "handleHelModChanged", desc: "err occurred", data: { modName, errMsg, platform } });
  }
}
function listenHelModChange(platform) {
  subHelpackModChange(platform, (params) => {
    log3({ subType: "listenHelModChange", desc: "trigger updateModInfo", data: { params, platform } });
    handleHelModChanged(platform, params.modName);
  });
}
async function updateRegisteredModsPresetData(platform, setBy) {
  const modInfoList = await fetchRegisteredModInfoList(platform);
  await Promise.all(modInfoList.map((modInfo) => updateModPresetData(platform, setBy, modInfo)));
  return modInfoList;
}
async function mayUpdateModPresetData(platform, setBy, modName, modInfo) {
  const subType = "mayUpdateModPresetData";
  const sdkCtx = getSdkCtx(platform);
  try {
    if (!modName) {
      await updateRegisteredModsPresetData(platform, setBy);
      return;
    }
    if (!isModMapped(platform, modName)) {
      log3({ subType, desc: `ignore not configured mod ${modName}` });
      return;
    }
    let targetModInfo = modInfo || null;
    if (!modInfo) {
      targetModInfo = await fetchModInfo(modName, { platform });
    }
    if (!targetModInfo) {
      log3({ subType, desc: `no modInfo for ${modName}` });
    }
    await updateModPresetData(sdkCtx.platform, setBy, targetModInfo);
  } catch (err) {
    sdkCtx.reporter.reportError(err.stack, "err-update-mod-info");
    const errMsg = err.message;
    log3({ subType, desc: "err occurred", data: { setBy, modName, errMsg, platform } });
  }
}
async function fetchRegisteredModInfoList(platform, options) {
  const sdkCtx = getSdkCtx(platform);
  const tasks = sdkCtx.modNames.map((name) => {
    const fetchOptions = options || getMappedModFetchOptions(name, platform);
    return fetchModInfo(name, fetchOptions);
  });
  const list = await Promise.all(tasks);
  const modInfoList = list.filter(Boolean);
  return modInfoList;
}
function markAppDesc(setBy, modInfo) {
  const modInfoVar = modInfo;
  modInfoVar.meta.app.desc = `set by [${setBy}], from container [${containerName}] worker [${workerId2}]`;
}
function updateModPresetDataSync(platform, setBy, modInfo) {
  if (!modInfo) {
    return;
  }
  markAppDesc(setBy, modInfo);
  presetDataMgr.updateForClient(platform, modInfo);
}
async function updateModPresetData(platform, setBy, modInfo) {
  if (!modInfo) {
    return;
  }
  const sdkCtx = getSdkCtx(platform);
  markAppDesc(setBy, modInfo);
  if (sdkCtx.isPreloadMode) {
    log3({ subType: "updateModPresetData", desc: `updateForServerFirst for ${modInfo.name}` });
    await presetDataMgr.updateForServerFirst(platform, modInfo);
    return;
  }
  presetDataMgr.updateForClient(platform, modInfo);
}
async function getModeInfoListForPreloadMode(platform, mustBeServerMod) {
  const modInfoList = await fetchRegisteredModInfoList(platform);
  modInfoList.forEach((info) => {
    triggerHook(HOOK_TYPE.onInitialHelMetaFetched, { helModName: info.name, version: info.meta.version.version_tag }, platform);
  });
  await Promise.all(modInfoList.map((modInfo) => presetDataMgr.updateForServerFirst(platform, modInfo, { mustBeServerMod })));
  return modInfoList;
}

// src/init/index.ts
init_map_node_mods();

// src/init/inject.ts
init_context();

// src/init/util.ts
init_consts();
var { env, containerName: containerName2, workerId: workerId3 } = SERVER_INFO;
function markHelEnv(ctx, isGrayVer) {
  const mark = `${env}-${containerName2}-${workerId3}-${isGrayVer ? "1" : "0"}`;
  ctx.response.set("Hel-Env", mark);
}
var seg = 0;
var num = 0;
function markHelHit(ctx) {
  num += 1;
  if (num === Number.MAX_SAFE_INTEGER) {
    seg += 1;
    num = 0;
  }
  const mark = `${seg}_${num}`;
  ctx.response.set("Hel-Hit", mark);
}

// src/init/inject.ts
var HelModViewMiddleware = class {
  constructor() {
    this.name = "mod-view-middleware";
    // TODO 实现生成中间件逻辑
    this.run = async (ctx, next) => {
      const render = ctx.render.bind(ctx);
      ctx.render = async function(viewPath, pageData) {
        markHelEnv(ctx);
        const result = await getSdkCtx().getHelRenderParams({ ctx, viewPath, pageData });
        markHelHit(ctx);
        return render(result.viewPath, result.pageData);
      };
      await next();
    };
  }
};

// src/init/index.ts
var isInitCommonCalled = false;
var middleware;
var callLabels = {
  initMiddleware: "initMiddleware",
  preloadMiddleware: "preloadMiddleware",
  preloadHelMods: "preloadHelMods"
};
var guard2 = new (0, _fguard.ConcurrencyGuard)();
function initCommon(options, label) {
  const forMiddleware = [callLabels.initMiddleware, callLabels.preloadMiddleware].includes(label);
  if (forMiddleware && isInitCommonCalled) {
    throw new Error(`initCommon can only been called one time, the second call comes from ${label}!`);
  }
  const { isProd, platform = PLATFORM } = options;
  if (!isInitCommonCalled) {
    setCtxEnv({ isProd });
  }
  isInitCommonCalled = true;
  mergeOptions(options);
  listenHelModChange(platform);
  enableIntervalUpdate(platform);
}
var isSetPlatformConfigCalledDict = {};
function setPlatformConfig(config) {
  const { platform = PLATFORM } = config;
  if (isSetPlatformConfigCalledDict[platform]) {
    throw new Error("setPlatformConfig can be called only one time");
  }
  isSetPlatformConfigCalledDict[platform] = true;
  mergeConfig(config);
}
var isSetGlobalConfigCalled = false;
function setGlobalConfig(config) {
  if (isSetGlobalConfigCalled) {
    throw new Error("setGlobalConfig can be called only one time");
  }
  isSetGlobalConfigCalled = true;
  mergeGlobalConfig(config);
}
async function preloadMiddleware(options) {
  const sdkCtx = getSdkCtx(options.platform);
  sdkCtx.isPreloadMode = true;
  initCommon(options, callLabels.preloadMiddleware);
  const modInfoList = await getModeInfoListForPreloadMode(sdkCtx.platform);
  const helModViewMiddleware = new HelModViewMiddleware();
  middleware = helModViewMiddleware;
  return { helModViewMiddleware, modInfoList };
}
function initMiddleware(options) {
  initCommon(options, callLabels.initMiddleware);
  const modInfoList = loadBackupHelMod(options.platform);
  const helModViewMiddleware = new HelModViewMiddleware();
  return { helModViewMiddleware, modInfoList };
}
async function preloadHelMods(helModNames, inputPlat) {
  const sdkCtx = getSdkCtx(inputPlat);
  const { platform } = sdkCtx;
  if (sdkCtx.beforePreloadOnce && !sdkCtx.helpackSocketUrl) {
    const result = await guard2.call(platform, sdkCtx.beforePreloadOnce);
    if (result && !sdkCtx.helpackSocketUrl) {
      const { helpackSocketUrl } = result;
      mergeConfig({ helpackSocketUrl, platform });
    }
  }
  const mod2conf = {};
  helModNames.forEach((name) => {
    const fetchOptions = mapNodeModsManager.getFetchOptions(name, platform);
    if (fetchOptions) {
      mod2conf[name] = { fetchOptions: __spreadProps(__spreadValues({}, fetchOptions), { platform }) };
    } else {
      mod2conf[name] = {};
    }
  });
  initCommon({ mod2conf, platform }, callLabels.preloadHelMods);
  sdkCtx.isPreloadMode = true;
  const modInfoList = await getModeInfoListForPreloadMode(platform, true);
  modInfoList.forEach((v) => setMetaCache(v.fullMeta));
  return modInfoList;
}
async function preloadMappedData(platform = PLATFORM) {
  const untriggeredHelModNames = mapNodeModsManager.getHelModNames(platform, true);
  untriggeredHelModNames.forEach((v) => mapNodeModsManager.setIsPreloadTriggered(v, platform));
  const modInfoList = await preloadHelMods(untriggeredHelModNames, platform);
  return modInfoList;
}
async function mapAndPreload(modMapper) {
  mapNodeModsManager.setModMapper(modMapper);
  const helModNameInfos = [];
  const plat2helModNames = {};
  Object.keys(modMapper).forEach((nodeModName) => {
    const { helModName, platform, fallback } = mapNodeModsManager.getNodeModData(nodeModName);
    if (fallback.force) {
      return;
    }
    const helModNames = safeGet(plat2helModNames, platform, []);
    if (!helModNames.includes(helModName)) {
      helModNameInfos.push({ platform, helModName });
      helModNames.push(helModName);
    }
  });
  helModNameInfos.forEach((v) => mapNodeModsManager.setIsPreloadTriggered(v.helModName, v.platform));
  const plats = Object.keys(plat2helModNames);
  const aoaList = await Promise.all(plats.map((plat) => preloadHelMods(plat2helModNames[plat], plat)));
  let modInfoList = [];
  aoaList.forEach((list) => {
    modInfoList = modInfoList.concat(list);
  });
  return modInfoList;
}

// src/api/index.ts
init_mod_node();

// src/server-mod/index.ts
init_path_helper();
init_mod_manager();
init_mod_name();
init_file_helper();
async function getHelModMeta(helModNameOrPath, options) {
  const { helModName } = extractNameData(helModNameOrPath);
  const meta = await getModMeta(helModName, options);
  return meta;
}
async function importHelMod(helModNameOrPath, options) {
  const importOptions = __spreadProps(__spreadValues({}, options || {}), { standalone: true });
  const mod2 = await modManager.importMod(helModNameOrPath, importOptions);
  return mod2;
}
function importHelModByMeta(meta, options) {
  const importOptions = __spreadProps(__spreadValues({}, options || {}), { standalone: true });
  return modManager.importModByMeta(meta, importOptions);
}
function importHelModByMetaSync(meta, options) {
  const importOptions = __spreadProps(__spreadValues({}, options), { standalone: true });
  return modManager.importModByMetaSync(meta, importOptions);
}
function importHelModByPath(helModNameOrPath, modePath, options) {
  const importOptions = __spreadProps(__spreadValues({}, options || {}), { standalone: true });
  return modManager.importModByPath(helModNameOrPath, modePath, importOptions);
}
async function downloadHelModFiles(helModNameOrPath, options) {
  const { modFileInfo, meta } = await modManager.prepareServerModFiles(helModNameOrPath, options);
  const files = getDirFileList(modFileInfo.modDirPath);
  return { meta, files };
}

// src/api/index.ts
init_mod_manager_helper();

// src/test-util/mock-download.ts
init_consts();
init_logger();
init_path_helper();
init_util();
init_file_helper();
init_map_node_mods();
init_mod_manager();
init_mod_meta();


// src/test-util/mock-util.ts
var mock_util_exports = {};
__export(mock_util_exports, {
  clearData: () => clearData,
  clearVerSeed: () => clearVerSeed,
  cpSync: () => cpSync,
  getCacheMeta: () => getCacheMeta,
  getCanClear: () => getCanClear,
  getFirstVerModDirPath: () => getFirstVerModDirPath,
  getIsHandled: () => getIsHandled,
  getMetaDict: () => getMetaDict,
  getServerInfo: () => getServerInfo,
  getVerSeed: () => getVerSeed,
  getVerSeedExpire: () => getVerSeedExpire,
  readFileContent: () => readFileContent,
  saveMetaDict: () => saveMetaDict,
  setCacheMeta: () => setCacheMeta,
  setFirstVerModDirPath: () => setFirstVerModDirPath,
  setIsHandled: () => setIsHandled,
  setVerSeedExpire: () => setVerSeedExpire
});
init_consts();
init_path_helper();
init_file_helper();


// src/test-util/mock-util-inner.ts

var fsOptions = { encoding: "utf8" };
function ensureDict(filePath) {
  if (!fs9.existsSync(filePath)) {
    fs9.writeFileSync(filePath, "{}", fsOptions);
  }
  const dictStr = readFileContent(filePath);
  const dict = JSON.parse(dictStr);
  return dict;
}
function saveDict(filePath, dict) {
  fs9.writeFileSync(filePath, JSON.stringify(dict, null, 2), fsOptions);
}
function clearSubDict(dictFilePath, helModName) {
  const dict = ensureDict(dictFilePath);
  dict[helModName] = {};
  saveDict(dictFilePath, dict);
}
function readFileContent(filePath) {
  const content = fs9.readFileSync(filePath, fsOptions);
  return content;
}

// src/test-util/mock-util.ts
var verSeedFile = path9.join(__dirname, "./verSeedDict.json");
var verSeedExpireDictFile = path9.join(__dirname, "./verSeedExpireDict.json");
var verSeedHandledDictFile = path9.join(__dirname, "./verSeedHandledDict.json");
var metaDictFile = path9.join(__dirname, "./metaDict.json");
var modDirPathDictFile = path9.join(__dirname, "./modDirPathDict.json");
var mockUtilMetaFile = path9.join(__dirname, "./mockUtilMeta.json");
var clearCDMs = 5e3;
var verSeedExpireMs = 3e4;
function getVerSeedExpire(helModName) {
  const dict = ensureDict(verSeedExpireDictFile);
  return dict[helModName] || verSeedExpireMs;
}
function setVerSeedExpire(helModName, expireMs) {
  const dict = ensureDict(verSeedExpireDictFile);
  dict[helModName] = expireMs;
  saveDict(verSeedFile, dict);
}
function clearVerSeed(helModName) {
  const dict = ensureDict(verSeedFile);
  dict[helModName] = { seed: 0, time: Date.now() };
  saveDict(verSeedFile, dict);
}
function getVerSeed(helModName) {
  const dict = ensureDict(verSeedFile);
  const result = dict[helModName];
  if (!(result == null ? void 0 : result.seed)) {
    dict[helModName] = { seed: 1, time: Date.now() };
    saveDict(verSeedFile, dict);
    return 1;
  }
  const now = Date.now();
  const expireMs = getVerSeedExpire(helModName);
  if (now - result.time < expireMs) {
    return result.seed;
  }
  const nextSeed = result.seed + 1;
  dict[helModName] = { seed: nextSeed, time: Date.now() };
  saveDict(verSeedFile, dict);
  return nextSeed;
}
function getMetaDict() {
  return ensureDict(metaDictFile);
}
function saveMetaDict(metaDict) {
  saveDict(metaDictFile, metaDict);
}
function getCacheMeta(helModName) {
  const metaDict = getMetaDict();
  return metaDict[helModName] || null;
}
function setCacheMeta(helModName, meta) {
  const metaDict = getMetaDict();
  metaDict[helModName] = meta;
  saveMetaDict(metaDict);
}
function getFirstVerModDirPath(helModName) {
  const dict = ensureDict(modDirPathDictFile);
  return dict[helModName] || "";
}
function setFirstVerModDirPath(helModName, path10) {
  const dict = ensureDict(modDirPathDictFile);
  dict[helModName] = path10;
  saveDict(modDirPathDictFile, dict);
}
function getServerInfo() {
  return SERVER_INFO;
}
function getIsHandled(helModName, verSeed) {
  const dict = ensureDict(verSeedHandledDictFile);
  if (!dict[helModName]) {
    dict[helModName] = {};
  }
  const subDict = dict[helModName];
  return subDict[verSeed] || false;
}
function setIsHandled(helModName, verSeed, isHandle) {
  const dict = ensureDict(verSeedHandledDictFile);
  if (!dict[helModName]) {
    dict[helModName] = {};
  }
  const subDict = dict[helModName];
  subDict[verSeed] = isHandle;
  saveDict(verSeedHandledDictFile, dict);
}
function getCanClear() {
  const rawData = ensureDict(mockUtilMetaFile);
  const defaultMeta = { time: 0 };
  const data = Object.assign(defaultMeta, rawData);
  const now = Date.now();
  if (now - data.time < clearCDMs) {
    return false;
  }
  data.time = now;
  saveDict(mockUtilMetaFile, data);
  return true;
}
function clearData(helModName, mockInterval2, platform = PLATFORM) {
  const canClear = getCanClear();
  if (!canClear) {
    return;
  }
  const modRootDirName = getModRootDirName(helModName, platform);
  const modRootDirPath = getModRootDirPath(modRootDirName);
  delFileOrDir(modRootDirPath);
  setVerSeedExpire(helModName, mockInterval2);
  clearVerSeed(helModName);
  setFirstVerModDirPath(helModName, "");
  setCacheMeta(helModName, null);
  clearSubDict(verSeedHandledDictFile, helModName);
}

// src/test-util/mock-download.ts
var mockInterval = 1e5;
function replaceMetaVer(verSeed, meta) {
  const newMeta = clone(meta);
  const { version } = newMeta;
  const { src_map: srcMap, sub_app_version: curVer } = version;
  const { srvModSrcList = [] } = srcMap;
  const ver = `${curVer}_${verSeed}`;
  version.sub_app_version = ver;
  srvModSrcList.forEach((v, idx) => srvModSrcList[idx] = v.replace(curVer, ver));
  srcMap.webDirPath = srcMap.webDirPath.replace(curVer, ver);
  srcMap.srvModSrcIndex = (srcMap.srvModSrcIndex || "").replace(curVer, ver);
  return newMeta;
}
function recordFirstVerModDirPath(helModName, modDirPath) {
  const firstVerModDirPath = getFirstVerModDirPath(helModName);
  if (!firstVerModDirPath) {
    const bakDirPathOfMock = `${modDirPath}_bak`;
    cpSync(modDirPath, bakDirPathOfMock);
    setFirstVerModDirPath(helModName, bakDirPathOfMock);
  }
}
async function copyFilesToNewVerModDir(nodeModName, options) {
  const { helModName } = mapNodeModsManager.getNodeModData(nodeModName, false);
  const { platform = PLATFORM } = options || {};
  const modDesc = modManager.getModDesc(helModName);
  if (!modDesc.modPath) {
    return null;
  }
  const verSeed = getVerSeed(helModName);
  if (verSeed === 1) {
    recordFirstVerModDirPath(helModName, modDesc.modDirPath);
  }
  const prepareFiles = (options == null ? void 0 : options.prepareFiles) || ((params) => {
    if (!fs10.existsSync(params.modDirPath)) {
      fs10.mkdirSync(params.modDirPath);
    }
    const files = getDirFileList(params.modDirPath);
    if (files.length < 2) {
      const modDirPath = getFirstVerModDirPath(helModName);
      cpSync(modDirPath, params.modDirPath);
    }
  });
  try {
    let meta = getCacheMeta(helModName);
    if (!meta) {
      meta = await fetchModMeta(helModName, { platform });
      setCacheMeta(helModName, meta);
    }
    meta = replaceMetaVer(verSeed, meta);
    await modManager.importModByMeta(meta, {
      prepareFiles,
      onFilesReady: (params) => {
        var _a;
        const curVer = getVerSeed(helModName);
        const isHandled = getIsHandled(helModName, curVer);
        if (isHandled) {
          return;
        }
        setIsHandled(helModName, curVer, true);
        (_a = options == null ? void 0 : options.onFilesReady) == null ? void 0 : _a.call(options, params);
      },
      reuseLocalFiles: false,
      standalone: false
    });
    return null;
  } catch (err) {
    print(`wid:${SERVER_INFO.workerId}`, err);
    return err;
  }
}
function mockAutoDownload(helModName, options) {
  const intervalMs = (options == null ? void 0 : options.intervalMs) || mockInterval;
  clearData(helModName, mockInterval, options == null ? void 0 : options.platform);
  const timerId = setInterval(() => {
    copyFilesToNewVerModDir(helModName, options);
  }, intervalMs);
  const clearAutoTask = () => clearInterval(timerId);
  return clearAutoTask;
}

// src/api/register.ts
init_logger();
init_util();
init_context();
var platAt2ndObj = [
  "importHelMod",
  "importHelModByMeta",
  "importHelModByMetaSync",
  "getHelModMeta",
  "mockAutoDownload",
  "downloadHelModFiles"
];
var platAt1stObj = ["initMiddleware", "preloadMiddleware", "setPlatformConfig"];
var platAt1stStr = ["preloadMappedData"];
var platAt3rdObj = ["importNodeModByPath", "importHelModByPath"];
var mapNodeModsLike = ["mapNodeMods", "mapAndPreload"];
function ensureObjPlat(platform, arg) {
  const newArg = __spreadValues({ platform }, arg || {});
  return newArg;
}
function handleMapNodes(platform, modMapper, apiName) {
  const newMapper = {};
  Object.keys(modMapper).forEach((nodeModName) => {
    let val = modMapper[nodeModName];
    if (!val) {
      return;
    }
    const valType = typeof val;
    if (!["string", "boolean", "object"].includes(valType)) {
      return;
    }
    if (valType === "string") {
      val = { helModName: val };
    } else if (valType === "boolean") {
      val = { helModName: nodeModName };
    }
    newMapper[nodeModName] = __spreadValues({ platform }, purify(val));
  });
  if (apiName === "mapAndPreload") {
    return mapAndPreload(newMapper);
  }
  return mapNodeMods(newMapper);
}
function registerPlatform(config) {
  const {
    platform: injectPlat,
    getMeta,
    getEnvInfo,
    registrationSource,
    beforePreloadOnce,
    helpackApiUrl,
    hooks = {},
    getSocketUrlWhenReconnect,
    socketHttpPingWhenTryReconnect
  } = config;
  if (!injectPlat) {
    throw new Error("platform must be supplied");
  }
  const sdkCtx = getSdkCtx(injectPlat);
  if (sdkCtx.isActive) {
    printWarn(`platform ${injectPlat} already registered!`);
    return sdkCtx.api;
  }
  sdkCtx.isActive = true;
  const isApiUrlSet = maySet(sdkCtx, "helpackApiUrl", helpackApiUrl);
  if (isApiUrlSet) {
    sdkCtx.isApiUrlOverwrite = true;
  }
  maySetFn(sdkCtx, "getMeta", getMeta);
  maySetFn(sdkCtx, "getEnvInfo", getEnvInfo);
  maySet(sdkCtx, "registrationSource", registrationSource);
  maySetFn(sdkCtx, "beforePreloadOnce", beforePreloadOnce);
  maySetFn(sdkCtx, "getSocketUrlWhenReconnect", getSocketUrlWhenReconnect);
  maySetFn(sdkCtx, "socketHttpPingWhenTryReconnect", socketHttpPingWhenTryReconnect);
  Object.assign(sdkCtx.regHooks, purifyFn(hooks));
  const wrappedApi = __spreadValues({}, api_exports);
  Object.keys(wrappedApi).forEach((key) => {
    if (mapNodeModsLike.includes(key)) {
      wrappedApi[key] = (modMapper) => handleMapNodes(injectPlat, modMapper, key);
      return;
    }
    if (platAt1stStr.includes(key)) {
      wrappedApi[key] = (arg1) => api_exports[key](arg1 || injectPlat);
      return;
    }
    if (platAt1stObj.includes(key)) {
      wrappedApi[key] = (arg1) => api_exports[key](ensureObjPlat(injectPlat, arg1));
      return;
    }
    if (platAt2ndObj.includes(key)) {
      wrappedApi[key] = (arg1, arg2) => api_exports[key](arg1, ensureObjPlat(injectPlat, arg2));
      return;
    }
    if (platAt3rdObj.includes(key)) {
      wrappedApi[key] = (arg1, arg2, arg3) => api_exports[key](arg1, arg2, ensureObjPlat(injectPlat, arg3));
      return;
    }
    wrappedApi[key] = api_exports[key];
  });
  sdkCtx.api = wrappedApi;
  return wrappedApi;
}

// src/index.ts
var index_default = export_exports;


































exports.addBizHooks = addBizHooks; exports.default = index_default; exports.downloadFile = downloadFile; exports.downloadHelModFiles = downloadHelModFiles; exports.downloadNodeModFiles = downloadNodeModFiles; exports.getFallbackMod = getFallbackMod; exports.getHelModMeta = getHelModMeta; exports.getHelModulesPath = getHelModulesPath; exports.getMemLogs = getMemLogs; exports.getNodeModDesc = getNodeModDesc; exports.getNodeModVer = getNodeModVer; exports.importHelMod = importHelMod; exports.importHelModByMeta = importHelModByMeta; exports.importHelModByMetaSync = importHelModByMetaSync; exports.importHelModByPath = importHelModByPath; exports.importNodeMod = importNodeMod; exports.importNodeModByMeta = importNodeModByMeta; exports.importNodeModByMetaSync = importNodeModByMetaSync; exports.importNodeModByPath = importNodeModByPath; exports.initMiddleware = initMiddleware; exports.isHelModProxy = isHelModProxy; exports.mapAndPreload = mapAndPreload; exports.mapNodeMods = mapNodeMods; exports.mockAutoDownload = mockAutoDownload; exports.mockUtil = mock_util_exports; exports.preloadMappedData = preloadMappedData; exports.preloadMiddleware = preloadMiddleware; exports.recordMemLog = recordMemLog; exports.registerPlatform = registerPlatform; exports.requireNodeMod = requireNodeMod; exports.resolveNodeMod = resolveNodeMod; exports.setGlobalConfig = setGlobalConfig; exports.setPlatformConfig = setPlatformConfig;
//# sourceMappingURL=index.js.map