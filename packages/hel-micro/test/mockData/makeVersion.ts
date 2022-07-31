import { IAssetItem } from 'hel-types';

export default function makeVersion() {
  return {
    'id': 1294,
    'sub_app_id': '1016',
    'sub_app_name': 'app',
    'sub_app_version': 'app_20220606060606',
    'src_map': {
      'webDirPath': 'https://xx.cdn.com/hel/app_20220606060606',
      'htmlIndexSrc': 'https://xx.cdn.com/hel/app_20220606060606/index.html',
      'iframeSrc': '',
      'chunkCssSrcList': [
        'https://xx.cdn.com/hel/app_20220606060606/css/chunk-22a77020.8cdf916a.css',
        'https://xx.cdn.com/hel/app_20220606060606/css/chunk-f3ad9638.8cdf916a.css'
      ],
      'privCssSrcList': [],
      'headAssetList': [
        {
          'tag': 'link',
          'attrs': {
            'href': 'https://xx.cdn.com/hel/app_20220606060606/favicon.ico',
            'rel': 'icon'
          }
        },
        {
          'tag': 'link',
          'attrs': {
            'href': 'https://xx.cdn.com/hel/app_20220606060606/css/chunk-22a77020.8cdf916a.css',
            'rel': 'prefetch'
          }
        },
        {
          'tag': 'link',
          'attrs': {
            'href': 'https://xx.cdn.com/hel/app_20220606060606/css/chunk-f3ad9638.8cdf916a.css',
            'rel': 'prefetch'
          }
        },
        {
          'tag': 'link',
          'attrs': {
            'href': 'https://xx.cdn.com/hel/app_20220606060606/js/chunk-22a77020.00c5ef17.js',
            'rel': 'prefetch'
          }
        },
        {
          'tag': 'link',
          'attrs': {
            'href': 'https://xx.cdn.com/hel/app_20220606060606/js/chunk-f3ad9638.3a5553b3.js',
            'rel': 'prefetch'
          }
        },
        {
          'tag': 'link',
          'attrs': {
            'href': 'https://xx.cdn.com/hel/app_20220606060606/js/app~e2e93592.bd978cec.js',
            'rel': 'preload'
          }
        }
      ] as IAssetItem[],
      'bodyAssetList': [
        {
          'tag': 'script',
          'attrs': {
            'src': 'https://xx.cdn.com/hel/app_20220606060606/js/app~e2e93592.bd978cec.js'
          }
        }
      ] as IAssetItem[],
    },
    'html_content': '<div>webpack output html content</div>',
    'create_by': 'fantasticsoul',
    'desc': 'feat:接入hel-dev-utils',
    'api_host': '',
    'project_name': 'hel-app-store',
    'pipeline_id': 'p-7d61863165294893acacb66266b8eefd',
    'build_id': 'b-df65eaa7b3a64be3af100e53fc0afbf7',
    'git_branch': 'master',
    'git_hashes': '67cce83a3fb7ac82a0ccaf6852e791c294b144e0,005c3d58000e6c37cb9e177cb66b4bf94ee620b7',
    'git_messages': [],
    'git_repo_url': '',
    'plugin_ver': '2.2.2',
    'create_at': '2022-06-01T18:29:18.000Z',
    'update_at': '2022-06-01T18:29:18.000Z'
  };
}
