// a demo of helpack app meta data

exports.getVer = function (name) {
  return {
    sub_app_name: name,
    sub_app_version: `${name}_20230418200716`,
    src_map: {
      webDirPath: 'https://tnfe.gtimg.com/hel/test-hel-demo_20230418200716',
      htmlIndexSrc: 'https://tnfe.gtimg.com/hel/test-hel-demo_20230418200716/index.html',
      extractMode: 'all',
      iframeSrc: '',
      chunkCssSrcList: ['https://tnfe.gtimg.com/hel/test-hel-demo_20230418200716/css/chunk-68902ca6.392410ec.css'],
      chunkJsSrcList: [
        'https://tnfe.gtimg.com/hel/test-hel-demo_20230418200716/js/app~e2e93592.7a12b549.js',
        'https://tnfe.gtimg.com/hel/test-hel-demo_20230418200716/js/chunk-68902ca6.e705c89f.js',
      ],
      staticCssSrcList: [],
      staticJsSrcList: ['https://tnfe.gtimg.com/hel-runtime/level1/v1-2.6.14-vue.js'],
      relativeCssSrcList: [],
      relativeJsSrcList: [],
      privCssSrcList: [],
      headAssetList: [
        {
          tag: 'link',
          append: false,
          attrs: {
            href: 'https://tnfe.gtimg.com/hel/test-hel-demo_20230418200716/favicon.ico',
            rel: 'icon',
          },
        },
        {
          tag: 'staticScript',
          append: false,
          ex: '',
          attrs: {
            src: 'https://tnfe.gtimg.com/hel-runtime/level1/v1-2.6.14-vue.js',
          },
        },
        {
          tag: 'link',
          append: true,
          attrs: {
            href: 'https://tnfe.gtimg.com/hel/test-hel-demo_20230418200716/css/chunk-68902ca6.392410ec.css',
            rel: 'prefetch',
          },
        },
        {
          tag: 'link',
          append: true,
          attrs: {
            href: 'https://tnfe.gtimg.com/hel/test-hel-demo_20230418200716/js/chunk-68902ca6.e705c89f.js',
            rel: 'prefetch',
          },
        },
        {
          tag: 'link',
          append: true,
          attrs: {
            href: 'https://tnfe.gtimg.com/hel/test-hel-demo_20230418200716/js/app~e2e93592.7a12b549.js',
            rel: 'preload',
          },
        },
      ],
      bodyAssetList: [
        {
          tag: 'script',
          append: true,
          attrs: {
            src: 'https://tnfe.gtimg.com/hel/test-hel-demo_20230418200716/js/app~e2e93592.7a12b549.js',
          },
        },
      ],
    },
    html_content:
      '<!DOCTYPE html><html lang=""><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="https://tnfe.gtimg.com/hel/test-hel-demo_20230418200716/favicon.ico"><title>@tencent/test-hel-demo</title><script src="https://tnfe.gtimg.com/hel-runtime/level1/v1-2.6.14-vue.js"></script><link href="https://tnfe.gtimg.com/hel/test-hel-demo_20230418200716/css/chunk-68902ca6.392410ec.css" rel="prefetch"><link href="https://tnfe.gtimg.com/hel/test-hel-demo_20230418200716/js/chunk-68902ca6.e705c89f.js" rel="prefetch"><link href="https://tnfe.gtimg.com/hel/test-hel-demo_20230418200716/js/app~e2e93592.7a12b549.js" rel="preload" as="script"></head><body><noscript><strong>We\'re sorry but @tencent/test-hel-demo doesn\'t work properly without JavaScript enabled. Please enable it to continue.</strong></noscript><div id="app"></div><script src="https://tnfe.gtimg.com/hel/test-hel-demo_20230418200716/js/app~e2e93592.7a12b549.js"></script></body></html>',
    create_by: 'qinglili',
    desc: 'feat: 更改组件对外暴露类型',
    api_host: '',
    project_name: 'qqstockdev',
    pipeline_id: 'p-e6358314aed24e15ad30df6be1420e0f',
    build_id: 'b-c756a86e9723458dacd7ff57a41ae60f',
    git_branch: 'master',
    git_hashes: '1f894b8c82b3da659c5156163768a583087c0f80',
    git_messages: [],
    git_repo_url: 'https://your.git',
    plugin_ver: '3.8.10',
    create_at: '2023-04-18T12:08:09.000Z',
    update_at: '2023-04-18T12:08:09.000Z',
  };
};
