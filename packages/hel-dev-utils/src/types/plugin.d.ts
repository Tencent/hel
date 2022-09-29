/**
 * 插件自身相关的各种类型
 */

export interface BkSensitiveConfInfo {}

export interface BKParams {
  BK_CI_BUILD_END_TIME: string;
  BK_CI_BUILD_ID: string;
  BK_CI_BUILD_NUM: string;
  BK_CI_BUILD_START_TIME: string;
  BK_CI_BUILD_TOTAL_TIME: string;
  BK_CI_IS_MOBILE: string;
  BK_CI_PIPELINE_CREATE_USER: string;
  BK_CI_PIPELINE_ID: string;
  BK_CI_PIPELINE_NAME: string;
  BK_CI_PIPELINE_UPDATE_USER: string;
  BK_CI_PIPELINE_VERSION: string;
  BK_CI_PROJECT_NAME: string;
  BK_CI_PROJECT_NAME_CN: string;
  BK_CI_RETRY_BUILD_ID: string;
  BK_CI_RETRY_COUNT: string;
  BK_CI_RETRY_TASK_ID: string;
  BK_CI_START_CHANNEL: string;
  BK_CI_START_TYPE: string;
  BK_CI_START_USER_ID: string;
  BK_CI_START_USER_NAME: string;
  BK_CI_HOOK_REVISION: string;
  BK_CI_HOOK_BRANCH: string;
  PACKAGE_NAME: string;
  PACKAGE_PATH: string;
  PACKAGE_TMP_DIR: string;
  PROJCET_DIR: string;
  WEB_URL: string;
  WORKSPACE_DIR: string;
  'pipeline.build.id': string;
  'pipeline.build.num': string;
  'pipeline.id': string;
  'pipeline.name': string;
  'pipeline.retry.build.id': string;
  'pipeline.retry.count': string;
  'pipeline.retry.start.task.id': string;
  'pipeline.start.channel': string;
  'pipeline.start.isMobile': string;
  'pipeline.start.type': string;
  'pipeline.start.user.id': string;
  'pipeline.start.user.name': string;
  'pipeline.time.duration': string;
  'pipeline.time.end': string;
  'pipeline.time.start': string;
  'pipeline.version': string;
  'project.name': string;
  'project.name.chinese': string;
  BK_CI_BUILD_JOB_ID: string;
  BK_CI_BUILD_TASK_ID: string;
  BK_CI_TURBO_ID: string;
  'pipeline.job.id': string;
  'pipeline.task.id': string;
  'turbo.task.id': string;
  bkWorkspace: string;
  testVersionFlag: string;
  inputDemo: string;
  bkSensitiveConfInfo: BkSensitiveConfInfo;
}

export interface InputParams extends BKParams {
  HEL_CDN_HOST: string; // cos域名
  HEL_BUILD_ZIP_NAME: string; // build.zip
  HEL_BUILD_DIR_NAME: string; // build(具体看不同项目的配置，ng项目为dist)
  HEL_APP_NAME: string; // 子应用的具体名称
  HEL_APP_TOKEN: string; // 子应用token
  HEL_APP_CDN_DIR: string; // 每次构建动态生成的子应用资源根目录名称, 同时也是app版本信息
  HEL_APP_IFRAME_SRC: string; // 当以iframe渲染子应用时，载入子应用的iframeSrc值
}
