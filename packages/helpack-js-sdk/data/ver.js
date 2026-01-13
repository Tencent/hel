/*
|------------------------------------------------------------------------------------------------
| 此文件仅用于辅助跑 helpack-js-sdk 的示例，真实的版本数据应由 hel-dev-utils 生成
|------------------------------------------------------------------------------------------------
*/

exports.getVer = function (options) {
  const optionsVar = options || {};
  const { name = '@hel-demo/mono-libs' } = optionsVar;
  const ver = optionsVar.ver || '20230418200716';

  return {
    sub_app_name: name,
    sub_app_version: `${name}@${ver}`,
    version_tag: ver,
    "src_map": {
      "webDirPath": "https://unpkg.com/@hel-demo/mono-libs@1.0.0/hel_dist",
      "htmlIndexSrc": "https://unpkg.com/@hel-demo/mono-libs@1.0.0/hel_dist/index.html",
      "extractMode": "all",
      "iframeSrc": "",
      "chunkCssSrcList": [],
      "chunkJsSrcList": [
        "https://unpkg.com/@hel-demo/mono-libs@1.0.0/hel_dist/static/js/main.d8beaf7f.js",
        "https://unpkg.com/@hel-demo/mono-libs@1.0.0/hel_dist/static/js/241.07b6c302.chunk.js",
        "https://unpkg.com/@hel-demo/mono-libs@1.0.0/hel_dist/static/js/244.c757696f.chunk.js"
      ],
      "staticCssSrcList": [],
      "staticJsSrcList": [
        "https://tnfe.gtimg.com/hel-mono/l1/react-hel/v3.js"
      ],
      "relativeCssSrcList": [],
      "relativeJsSrcList": [],
      "headAssetList": [
        {
          "tag": "script",
          "append": true,
          "attrs": {
            "src": "https://unpkg.com/@hel-demo/mono-libs@1.0.0/hel_dist/static/js/main.d8beaf7f.js",
            "defer": "defer"
          }
        }
      ],
      "bodyAssetList": [
        {
          "tag": "staticScript",
          "append": false,
          "attrs": {
            "src": "https://tnfe.gtimg.com/hel-mono/l1/react-hel/v3.js"
          }
        }
      ],
      "otherSrcList": [
        "https://unpkg.com/@hel-demo/mono-libs@1.0.0/hel_dist/asset-manifest.json",
        "https://unpkg.com/@hel-demo/mono-libs@1.0.0/hel_dist/index.html",
        "https://unpkg.com/@hel-demo/mono-libs@1.0.0/hel_dist/robots.txt",
        "https://unpkg.com/@hel-demo/mono-libs@1.0.0/hel_dist/static/js/241.07b6c302.chunk.js.LICENSE.txt",
        "https://unpkg.com/@hel-demo/mono-libs@1.0.0/hel_dist/static/js/241.07b6c302.chunk.js.map",
        "https://unpkg.com/@hel-demo/mono-libs@1.0.0/hel_dist/static/js/244.c757696f.chunk.js.map",
        "https://unpkg.com/@hel-demo/mono-libs@1.0.0/hel_dist/static/js/main.d8beaf7f.js.map"
      ],
      "srvModSrcList": [
        "https://unpkg.com/@hel-demo/mono-libs@1.0.0/hel_dist/srv/index.js"
      ],
      "srvModSrcIndex": "https://unpkg.com/@hel-demo/mono-libs@1.0.0/hel_dist/srv/index.js"
    },
    "html_content": "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"/><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"/><meta name=\"theme-color\" content=\"#000000\"/><meta name=\"description\" content=\"Web site created by create-hel\"/><title>Create Hel App</title><script defer=\"defer\" src=\"https://unpkg.com/@hel-demo/mono-libs@1.0.0/hel_dist/static/js/main.d8beaf7f.js\"></script></head><body><noscript>You need to enable JavaScript to run this app.</noscript><script src=\"https://tnfe.gtimg.com/hel-mono/l1/react-hel/v3.js\"></script><div id=\"hel-app-root\"></div></body></html>",
    "create_at": "2025-11-17T10:03:30.723Z",
    create_by: 'fatasticsoul',
    desc: 'feat: 更改组件对外暴露类型',
    api_host: '',
    project_name: 'qqstockdev',
    pipeline_id: 'p-e6358314aed24e15ad30df6be1420e0f',
    build_id: 'b-c756a86e9723458dacd7ff57a41ae60f',
    git_branch: 'master',
    git_hashes: '1f894b8c82b3da659c5156163768a583087c0f80',
    git_messages: [],
    git_repo_url: 'https://github.com/hel-eco/hel-mono/tree/main/packages/mono-libs',
    plugin_ver: '3.8.10',
    create_at: '2023-04-18T12:08:09.000Z',
    update_at: '2023-04-18T12:08:09.000Z',
  };
};

exports.getOtherCdnVer = function (options) {
  const optionsVar = options || {};
  const { name = '@hel-demo/mono-libs' } = optionsVar;
  const ver = optionsVar.ver || '20230418200716';

  return {
    sub_app_name: name,
    sub_app_version: `${name}@${ver}`,
    version_tag: ver,
    "src_map": {
      "webDirPath": "https://unpkg.com/@hel-demo/mono-libs@1.0.1/hel_dist",
      "htmlIndexSrc": "https://unpkg.com/@hel-demo/mono-libs@1.0.1/hel_dist/index.html",
      "extractMode": "all",
      "iframeSrc": "",
      "chunkCssSrcList": [],
      "chunkJsSrcList": [
        "https://unpkg.com/@hel-demo/mono-libs@1.0.1/hel_dist/static/js/main.25a88556.js",
        "https://unpkg.com/@hel-demo/mono-libs@1.0.1/hel_dist/static/js/241.c247f85e.chunk.js",
        "https://unpkg.com/@hel-demo/mono-libs@1.0.1/hel_dist/static/js/244.ce3c16fb.chunk.js"
      ],
      "staticCssSrcList": [],
      "staticJsSrcList": [
        "https://tnfe.gtimg.com/hel-mono/l1/react-hel/v3.js"
      ],
      "relativeCssSrcList": [],
      "relativeJsSrcList": [],
      "headAssetList": [
        {
          "tag": "script",
          "append": true,
          "attrs": {
            "src": "https://unpkg.com/@hel-demo/mono-libs@1.0.1/hel_dist/static/js/main.25a88556.js",
            "defer": "defer"
          }
        }
      ],
      "bodyAssetList": [
        {
          "tag": "staticScript",
          "append": false,
          "attrs": {
            "src": "https://tnfe.gtimg.com/hel-mono/l1/react-hel/v3.js"
          }
        }
      ],
      "otherSrcList": [
        "https://unpkg.com/@hel-demo/mono-libs@1.0.1/hel_dist/asset-manifest.json",
        "https://unpkg.com/@hel-demo/mono-libs@1.0.1/hel_dist/index.html",
        "https://unpkg.com/@hel-demo/mono-libs@1.0.1/hel_dist/robots.txt",
        "https://unpkg.com/@hel-demo/mono-libs@1.0.1/hel_dist/static/js/241.c247f85e.chunk.js.LICENSE.txt",
        "https://unpkg.com/@hel-demo/mono-libs@1.0.1/hel_dist/static/js/241.c247f85e.chunk.js.map",
        "https://unpkg.com/@hel-demo/mono-libs@1.0.1/hel_dist/static/js/244.ce3c16fb.chunk.js.map",
        "https://unpkg.com/@hel-demo/mono-libs@1.0.1/hel_dist/static/js/main.25a88556.js.map"
      ],
      "srvModSrcList": [
        "https://unpkg.com/@hel-demo/mono-libs@1.0.1/hel_dist/srv/index.js"
      ],
      "srvModSrcIndex": "https://unpkg.com/@hel-demo/mono-libs@1.0.1/hel_dist/srv/index.js"
    },
    "html_content": "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"/><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"/><meta name=\"theme-color\" content=\"#000000\"/><meta name=\"description\" content=\"Web site created by create-hel\"/><title>Create Hel App</title><script defer=\"defer\" src=\"https://unpkg.com/@hel-demo/mono-libs@1.0.1/hel_dist/static/js/main.25a88556.js\"></script></head><body><noscript>You need to enable JavaScript to run this app.</noscript><script src=\"https://tnfe.gtimg.com/hel-mono/l1/react-hel/v3.js\"></script><div id=\"hel-app-root\"></div></body></html>",
    create_by: 'fatasticsoul',
    desc: 'fix: --other=升级 fusion-sdk 解决私有化请求路径问题\\n',
    api_host: '',
    project_name: '',
    pipeline_id: '',
    build_id: '',
    git_branch: 'release-wedata2.3.0.1-tcs',
    git_hashes: '',
    git_messages: [],
    git_repo_url: 'https://github.com/hel-eco/hel-mono/tree/main/packages/mono-libs',
    plugin_ver: '3.3.2',
    create_at: '2023-05-29T08:15:04.000Z',
    update_at: '2023-05-29T08:15:04.000Z',
  };
};

exports.getWeDataVer = function () {
  return {
    plugin_ver: '3.3.2',
    sub_app_name: '@hel-demo/mono-comps',
    sub_app_version: '@hel-demo/mono-comps@0.1.3',
    version_tag: '0.1.3',
    "src_map": {
      "webDirPath": "https://unpkg.com/@hel-demo/mono-comps@0.1.3/hel_dist",
      "htmlIndexSrc": "https://unpkg.com/@hel-demo/mono-comps@0.1.3/hel_dist/index.html",
      "extractMode": "all",
      "iframeSrc": "",
      "chunkCssSrcList": [
        "https://unpkg.com/@hel-demo/mono-comps@0.1.3/hel_dist/static/css/main.6c1edb90.css"
      ],
      "chunkJsSrcList": [
        "https://unpkg.com/@hel-demo/mono-comps@0.1.3/hel_dist/static/js/main.06c44ae8.js"
      ],
      "staticCssSrcList": [],
      "staticJsSrcList": [
        "https://tnfe.gtimg.com/hm-test/v1/react16-hel.js",
        "https://tnfe.gtimg.com/hm/v1/runtime-helper@2.3.2.js",
        "https://unpkg.com/hub-ex@0.0.4/hel_dist/static/js/main.38f17314.js"
      ],
      "relativeCssSrcList": [],
      "relativeJsSrcList": [],
      "headAssetList": [
        {
          "tag": "staticScript",
          "append": false,
          "attrs": {
            "src": "https://tnfe.gtimg.com/hm-test/v1/react16-hel.js",
            "id": "BASE_EX1"
          }
        },
        {
          "tag": "staticScript",
          "append": true,
          "attrs": {
            "src": "https://tnfe.gtimg.com/hm/v1/runtime-helper@2.3.2.js",
            "id": "BASE_EX2",
            "data-helex": "HelMonoRuntimeHelper"
          }
        },
        {
          "tag": "staticScript",
          "append": false,
          "attrs": {
            "src": "https://unpkg.com/hub-ex@0.0.4/hel_dist/static/js/main.38f17314.js",
            "id": "REPO_EX0"
          }
        },
        {
          "tag": "script",
          "append": true,
          "attrs": {
            "src": "https://unpkg.com/@hel-demo/mono-comps@0.1.3/hel_dist/static/js/main.06c44ae8.js",
            "defer": "defer"
          }
        },
        {
          "tag": "link",
          "append": true,
          "attrs": {
            "href": "https://unpkg.com/@hel-demo/mono-comps@0.1.3/hel_dist/static/css/main.6c1edb90.css",
            "rel": "stylesheet"
          }
        }
      ],
      "bodyAssetList": [],
      "otherSrcList": [
        "https://unpkg.com/@hel-demo/mono-comps@0.1.3/hel_dist/asset-manifest.json",
        "https://unpkg.com/@hel-demo/mono-comps@0.1.3/hel_dist/index.html",
        "https://unpkg.com/@hel-demo/mono-comps@0.1.3/hel_dist/robots.txt",
        "https://unpkg.com/@hel-demo/mono-comps@0.1.3/hel_dist/static/css/main.6c1edb90.css.map",
        "https://unpkg.com/@hel-demo/mono-comps@0.1.3/hel_dist/static/js/main.06c44ae8.js.LICENSE.txt",
        "https://unpkg.com/@hel-demo/mono-comps@0.1.3/hel_dist/static/js/main.06c44ae8.js.map"
      ],
      "srvModSrcList": [],
      "srvModSrcIndex": ""
    },
    "html_content": "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"/><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"/><meta name=\"theme-color\" content=\"#000000\"/><meta name=\"description\" content=\"Web site created by create-hel\"/><title>Create Hel App</title><script id=\"BASE_EX1\" src=\"https://tnfe.gtimg.com/hm-test/v1/react16-hel.js\"></script><script id=\"BASE_EX2\" data-helex=\"HelMonoRuntimeHelper\" src=\"https://tnfe.gtimg.com/hm/v1/runtime-helper@2.3.2.js\"></script><script id=\"REPO_EX0\" src=\"https://unpkg.com/hub-ex@0.0.4/hel_dist/static/js/main.38f17314.js\"></script><script defer=\"defer\" src=\"https://unpkg.com/@hel-demo/mono-comps@0.1.3/hel_dist/static/js/main.06c44ae8.js\"></script><link href=\"https://unpkg.com/@hel-demo/mono-comps@0.1.3/hel_dist/static/css/main.6c1edb90.css\" rel=\"stylesheet\"></head><body><noscript>You need to enable JavaScript to run this app.</noscript><div id=\"hel-app-root\"></div></body></html>",

    desc: '测试',
    git_branch: 'tcs',
    git_repo_url: 'https://github.com/hel-eco/hel-mono/tree/main/packages/mono-comps',
    create_by: 'wingpan',
  };
};
