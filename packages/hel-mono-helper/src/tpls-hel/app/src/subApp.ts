/**
 * [hel-del-after-copy] Do not change this file, some contents will be replaced by hel script
 * [hel-tip] 此文件由 mono-helper 脚本自动生成，无需修改
 * hel模块名称配置
 */
import type { IHelModConf } from 'hel-mono-types';
import { DEV_INFO } from './devInfo';
import { getDeployEnv, monoLog } from './util';

const fallbackConf: IHelModConf = { appGroupName: '', appNames: {} };
const helConf = DEV_INFO.appConfs['{{APP_PACK_NAME}}']?.hel || fallbackConf;
const { appGroupName, appNames } = helConf;
const deployEnv = getDeployEnv();

export const APP_GROUP_NAME = appGroupName;

export const APP_NAME = appNames[deployEnv] || appGroupName;

monoLog(`deployEnv of ${APP_GROUP_NAME}(${APP_NAME}) is ${deployEnv}`);
