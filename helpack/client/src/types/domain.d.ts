import { ISubApp, ISubAppVersion } from 'hel-types'

export interface User {
  user: string;
  icon: string;
}

export type SubApp = ISubApp;

export type SubAppVersion = ISubAppVersion;

export interface IServerModStat {
  id: string,
  // create_at: '2020-04-01T02:51:35.000Z',
  create_at: string,
  update_at: string,
  env_name: string;
  mod_name: string;
  mod_version: string;
  pod_name: string;
  container_name: string;
  container_ip: string;
  img_version: string;
  city: string;
  load_at: string;
  extra: any;
}
