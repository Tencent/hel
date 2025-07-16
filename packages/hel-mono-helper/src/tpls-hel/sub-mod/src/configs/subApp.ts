/**
 * [hel-del-after-copy] Do not change this file, some contents will be replaced by hel script
 * [hel-tip] 此文件由 mono-helper 脚本自动生成，无需修改
 * hel模块名称配置
 */
import { DEV_INFO } from './devInfo';
import { getDeployEnv } from './util';

const fallbackConf = { appGroupName: '', appNames: { test: '', prod: '' } };
const helConf = DEV_INFO.appConfs['{{APP_PACK_NAME}}']?.hel || fallbackConf;
const { appGroupName, appNames } = helConf;

export const APP_GROUP_NAME = appGroupName;

export const APP_NAME = appNames[getDeployEnv()] || appGroupName;
