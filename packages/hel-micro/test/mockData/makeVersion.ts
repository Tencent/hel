import { IAssetItem } from 'hel-types';

interface IMakeVersionOptions {
  versionId?: string;
  name?: string;
  platform?: string;
  semverApi?: boolean;
}

export default function makeVersion(options?: IMakeVersionOptions) {
  const { name = 'remote-vue-comps-tpl', platform = 'hel', semverApi = true } = options || {};
  let { versionId } = options || {};
  if (!versionId) {
    versionId = semverApi ? '1.1.3' : `${name}_20220602022833`;
  }
  const versionDesc = semverApi ? `${name}@${versionId}` : `${name}_20220602022833`;

  let webDirPath = `https://xx.cdn.com/hel/${versionDesc}`;
  let htmlIndexSrc = `https://xx.cdn.com/hel/${versionDesc}/index.html`;
  let cssUrl1 = `https://xx.cdn.com/hel/${versionDesc}/css/chunk1.css`;
  let cssUrl2 = `https://xx.cdn.com/hel/${versionDesc}/css/chunk2.css`;
  // real meta json see: https://unpkg.com/hel-tpl-remote-vue-comps@1.1.3/hel_dist/hel-meta.json
  if (platform === 'unpkg') {
    webDirPath = `https://unpkg.com/${versionDesc}/hel_dist`;
    htmlIndexSrc = `https://unpkg.com/${versionDesc}/hel_dist/index.html`;
    cssUrl1 = `https://unpkg.com/${versionDesc}/hel_dist/css/chunk1.css`;
    cssUrl2 = `https://unpkg.com/${versionDesc}/hel_dist/css/chunk2.css`;
  }

  if (platform === 'unpkg') {
  }

  return {
    id: 1294,
    sub_app_id: '1016',
    sub_app_name: name,
    sub_app_version: versionId,
    src_map: {
      webDirPath,
      htmlIndexSrc,
      iframeSrc: '',
      chunkCssSrcList: [cssUrl1, cssUrl2],
      chunkJsSrcList: [],
      staticJsSrcList: [],
      staticCssSrcList: [],
      relativeJsSrcList: [],
      relativeCssSrcList: [],
      privCssSrcList: [],
      headAssetList: [
        {
          tag: 'link',
          attrs: {
            href: cssUrl1,
            rel: 'prefetch',
          },
        },
        {
          tag: 'link',
          attrs: {
            href: cssUrl2,
            rel: 'prefetch',
          },
        },
        {
          tag: 'link',
          attrs: {
            href: `${webDirPath}/js/chunk-22a77020.00c5ef17.js`,
            rel: 'prefetch',
          },
        },
        {
          tag: 'link',
          attrs: {
            href: `${webDirPath}/js/chunk-f3ad9638.3a5553b3.js`,
            rel: 'prefetch',
          },
        },
        {
          tag: 'link',
          attrs: {
            href: `${webDirPath}/js/app~e2e93592.bd978cec.js`,
            rel: 'preload',
          },
        },
      ] as IAssetItem[],
      bodyAssetList: [
        {
          tag: 'script',
          attrs: {
            src: `${webDirPath}/js/app~e2e93592.bd978cec.js`,
          },
        },
      ] as IAssetItem[],

    },
    html_content:
      '<!DOCTYPE html><html lang=""><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="https://xx.cdn.com/hel/remote-vue-comps-tpl_20220602022833/favicon.ico"><title>remote-vue-comps-tpl</title><script src="https://xx.cdn.com/hel-runtime/level1/v1-2.6.14-vue.js"></script><link href="https://xx.cdn.com/hel/remote-vue-comps-tpl_20220602022833/css/chunk-22a77020.8cdf916a.css" rel="prefetch"><link href="https://xx.cdn.com/hel/remote-vue-comps-tpl_20220602022833/css/chunk-f3ad9638.8cdf916a.css" rel="prefetch"><link href="https://xx.cdn.com/hel/remote-vue-comps-tpl_20220602022833/js/chunk-22a77020.00c5ef17.js" rel="prefetch"><link href="https://xx.cdn.com/hel/remote-vue-comps-tpl_20220602022833/js/chunk-f3ad9638.3a5553b3.js" rel="prefetch"><link href="https://xx.cdn.com/hel/remote-vue-comps-tpl_20220602022833/js/app~e2e93592.bd978cec.js" rel="preload" as="script"></head><body><noscript><strong>We\'re sorry but remote-vue-comps-tpl doesn\'t work properly without JavaScript enabled. Please enable it to continue.</strong></noscript><div id="app"></div><script src="https://xx.cdn.com/hel/remote-vue-comps-tpl_20220602022833/js/app~e2e93592.bd978cec.js"></script></body></html>',
    create_by: 'fantasticsoul',
    desc: 'feat:接入hel-dev-utils',
    api_host: '',
    project_name: 'hel-app-store',
    pipeline_id: 'p-7d61863165294893acacb66266b8eefd',
    build_id: 'b-df65eaa7b3a64be3af100e53fc0afbf7',
    git_branch: 'master',
    git_hashes: '67cce83a3fb7ac82a0ccaf6852e791c294b144e0,005c3d58000e6c37cb9e177cb66b4bf94ee620b7',
    git_messages: [],
    git_repo_url: 'https://github.com/hel-eco/hel-tpl-remote-vue-comp.git',
    plugin_ver: '2.2.2',
    create_at: '2022-06-01T18:29:18.000Z',
    update_at: '2022-06-01T18:29:18.000Z',
  };
}
