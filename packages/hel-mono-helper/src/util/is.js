const {
  HEL_START_AND_WAIT_LOCAL_DEPS,
  HEL_START_WITH_LOCAL_RUNNING_DEPS,
  HEL_START_WITH_REMOTE_DEPS,
  HEL_MICRO_BUILD,
  HEL_MICRO_BUILD_BS,
  HEL_ALL_BUILD,
  HEL_EXTERNAL_BUILD,
} = require('../consts');

const startModes = [HEL_START_AND_WAIT_LOCAL_DEPS, HEL_START_WITH_LOCAL_RUNNING_DEPS, HEL_START_WITH_REMOTE_DEPS];
const buildModes = [HEL_MICRO_BUILD, HEL_MICRO_BUILD_BS];

/**
 * hel应用（模块）处于 微模块 start 或 微模块 build 模式
 */
function isHelMicroMode() {
  const helBuildMode = process.env.HEL_BUILD;
  const helStartMode = process.env.HEL_START;
  return buildModes.includes(helBuildMode) || startModes.includes(helStartMode);
}

/**
 * 走了 scripts/hel 相关脚本执行运行或构建
 * @returns
 */
function isHelMode() {
  return isHelMicroMode() || isHelAllBuild() || isHelExternalBuild();
}

/**
 * hel应用（模块）处于整体构建模式（即传统的单一应用构建模式）
 */
function isHelAllBuild() {
  return process.env.HEL_BUILD === HEL_ALL_BUILD;
}

/**
 * hel应用（模块）external 构建模式，辅助提取应用的外部静态资源
 */
function isHelExternalBuild() {
  return process.env.HEL_BUILD === HEL_EXTERNAL_BUILD;
}

function isHelStart() {
  const helStartMode = process.env.HEL_START;
  const isStartWithHel = startModes.includes(helStartMode);
  return isStartWithHel;
}

function isHelStartWithLocalDeps() {
  const helStartMode = process.env.HEL_START;
  return [HEL_START_AND_WAIT_LOCAL_DEPS, HEL_START_WITH_LOCAL_RUNNING_DEPS].includes(helStartMode);
}

function isFastRefreshMarked() {
  const hasFRFlag = process.argv.some((v) => v === '-fr') || process.argv.some((v) => v === '--fast-refresh');
  return hasFRFlag && isHelStartWithLocalDeps();
}

module.exports = {
  isHelMode,
  isHelMicroMode,
  isHelAllBuild,
  isHelExternalBuild,
  isHelStart,
  isHelStartWithLocalDeps,
  isFastRefreshMarked,
};
