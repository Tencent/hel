import { getPlatform } from 'hel-micro-core';
import { ISubApp } from 'hel-types';

const FALSE = 0 as const;
const TRUE = 1 as const;

export default function makeApp(options?: { app?: Partial<ISubApp>; platform?: string }) {
  const { app = {}, platform = getPlatform() } = options || {};

  const { name = app.name || 'remote-vue-comps-tpl', app_group_name: appGroupName = app.app_group_name || 'remote-vue-comps-tpl' } = app;
  let { build_version: buildVer } = app;
  if (!buildVer) {
    buildVer = platform === 'hel' ? `${name}_20220602022833` : '1.1.3';
  }

  const appDemo = {
    id: 1016,
    name,
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
    extract_mode: 'bu_st' as const,
    additional_scripts: [],
    additional_body_scripts: [],
    is_local_render: TRUE,
    render_app_host: '',
    enable_gray: FALSE,
    is_in_gray: FALSE,
    owners: [],
    gray_users: [],
    proj_ver: { map: {}, utime: 0 },
    is_xc: FALSE,
    create_at: '2022-05-31T17:34:13.000Z',
    update_at: '2022-06-01T18:29:18.000Z',
  };
  return { ...appDemo, ...(options || {}) };
}
