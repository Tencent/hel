import { ISubApp } from 'hel-types';

const FALSE = 0 as const;
const TRUE = 1 as const;

export default function makeApp(options?: Partial<ISubApp>) {
  const appDemo = {
    'id': 1016,
    'name': 'app',
    'app_group_name': 'app',
    'name_in_sec': '',
    'logo': '',
    'splash_screen': '',
    'is_test': FALSE,
    'enable_build_to_online': TRUE,
    'enable_pipeline': TRUE,
    'token': '******',
    'cnname': '',
    'desc': '远程vue组件模板',
    'class_name': '',
    'create_by': 'fantasticsoul',
    'online_version': 'app_20220602022833',
    'pre_version': 'app_20220602022833',
    'test_version': 'app_20220602022833',
    'build_version': 'app_20220602022833',
    'enable_display': TRUE,
    'api_host': '',
    'render_mode': '',
    'ui_framework': 'lib',
    'iframe_src_map': '',
    'host_map': '',
    'git_repo_url': '',
    'is_rich': FALSE,
    'is_top': FALSE,
    'is_back_render': FALSE,
    'extract_mode': 'bu_st' as const,
    'additional_scripts': [],
    'additional_body_scripts': [],
    'is_local_render': TRUE,
    'render_app_host': '',
    'enable_gray': FALSE,
    'is_in_gray': FALSE,
    'owners': [],
    'gray_users': [],
    'is_xc': FALSE,
    'create_at': '2022-05-31T17:34:13.000Z',
    'update_at': '2022-06-01T18:29:18.000Z'
  };
  return { ...appDemo, ...(options || {}) };
}