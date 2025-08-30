/**
 * [hel-del-after-copy] Do not change this file, some contents will be replaced by hel script
 * [hel-tip] 此文件由 mono-helper 脚本自动生成，无需修改
 * hel模块名称配置
 */
import { monoLog } from 'hel-mono-runtime-helper';
import { DEPLOY_ENV } from './deployEnv';
import { DEV_INFO } from './devInfo';

const { groupName, names } = DEV_INFO.mods['{{APP_PACK_NAME}}'];

export const APP_GROUP_NAME = groupName;

export const APP_NAME = names[DEPLOY_ENV] || groupName;

monoLog(`${APP_GROUP_NAME} deployEnv is ${DEPLOY_ENV}`);
