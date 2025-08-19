/**
 * [hel-del-after-copy] Do not change this file, some contents will be replaced by hel script
 * [hel-tip] 此文件由 mono-helper 脚本自动生成，无需修改
 * hel模块名称配置
 */
import { monoLog } from 'hel-mono-runtime-helper';
import { DEV_INFO } from './devInfo';
import { DEPLOY_ENV } from './deployEnv';

const { appGroupName, appNames } = DEV_INFO.appConfs['{{APP_PACK_NAME}}'].hel;

export const APP_GROUP_NAME = appGroupName;

export const APP_NAME = appNames[DEPLOY_ENV] || appGroupName;

monoLog(`${APP_GROUP_NAME} deployEnv is ${DEPLOY_ENV}, mapped ${APP_NAME}`);
